const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');
const sanitize = require('@aero/sanitizer');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			usage: '<add|remove|list:default> [term:...string]',
			usageDelim: ' ',
			description: language => language.get('COMMAND_CENSOR_DESCRIPTION')
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async run(msg, [action, term]) {
		if (action === 'list') return this.list(msg);

		if (!term) throw 'COMMAND_CENSOR_NO_TERM';

		term = sanitize(term).toLowerCase().trim();

		try {
			await msg.guild.settings.sync();
			this.runPrechecks(msg.guild, action, term);

			await msg.guild.settings.update('mod.censor', term, { arrayAction: action });

			return msg.responder.success(`COMMAND_CENSOR_${action.toUpperCase()}`, term);
		} catch (error) {
			return msg.responder.error(error);
		}
	}

	runPrechecks(guild, action, term) {
		const terms = guild.settings.get('mod.censor');
		switch (action) {
			case 'add':
				if (terms.includes(term)) throw 'COMMAND_CENSOR_ALREADY_EXISTS';
				break;
			case 'remove':
				if (!terms.includes(term)) throw 'COMMAND_CENSOR_DOESNT_EXIST';
				break;
		}
		return true;
	}

	list(msg) {
		const terms = msg.guild.settings.get('mod.censor');

		const output = ['Censored terms on this server:', ...terms.map(term => `- \`${term}\``)].join('\n').slice(0, 2000);

		msg.send(output);
	}

};
