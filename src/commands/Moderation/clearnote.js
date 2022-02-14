const Command = require('../../../lib/structures/ModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['un', 'ncl'],
			description: language => language.get('COMMAND_CLEARNOTE_DESCRIPTION'),
			usage: '<user:member> <ids:string>',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [member, id]) {
		const moderatable = this.comparePermissions(msg.member, member);
		if (!moderatable) return msg.responder.error('COMMAND_CLEARNOTE_NOPERMS');

		const notes = this.updateNotes(member, id);
		await member.settings.sync();
		member.settings.update('notes', notes, { arrayAction: 'overwrite' });

		return msg.responder.success();
	}

	updateNotes(member, ids) {
		const notes = member.settings.get('notes');
		if (!notes.length) return [];
		const range = /^(?<start>\d)-(?<end>\d)$/;
		const multiple = /^(\d,)+\d$/;
		if (ids === 'all')
			return [];

		if (range.test(ids)) {
			const { start, end } = range.exec(ids).groups;
			notes.splice(start - 1, end - start + 1);
			return notes;
		}
		if (multiple.test(ids)) {
			ids = ids.split(',').map(id => parseInt(id));
			return notes.filter((_, idx) => !ids.includes(idx + 1));
		}
		if (!Number.isNaN(parseInt(ids)) && notes[ids - 1])
			return notes.filter((_, idx) => idx !== (ids - 1));

		throw 'Invalid id or ids';
	}


};
