const { Command } = require('@aero/klasa');
const { badges } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_ADDBADGE_DESCRIPTION'),
			usage: '<badgeID:integer> <user  or  users:users>',
			usageDelim: ' ',
			aliases: ['crk'],
			guarded: true
		});
	}

	async run(msg, [id, users]) {
		if (!badges[id]) return msg.responder.error('COMMAND_CREATEKEY_INVALID');

		for (const user of users) {
			user.settings.sync().then(() =>
				user.settings.update('badges', user.settings.get('badges') | (1 << id))); /* eslint-disable-line no-bitwise */
		}
		const out = [
			`Added the ${badges[id].icon} **${badges[id].title}** badge to: `,
			users.map(user => user.tag).join(', ')
		].join('\n');
		return msg.send(out);
	}

};
