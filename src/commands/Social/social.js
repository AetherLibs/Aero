const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SOCIAL_DESCRIPTION'),
			runIn: ['text'],
			usage: '[toggle|enable|disable|levelmessages]',
			subcommands: true
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	toggle(msg) {
		const enabled = msg.guild.settings.get('social.enabled');
		return this.update(msg, !enabled);
	}

	enable(msg) {
		return this.update(msg, true);
	}

	disable(msg) {
		return this.update(msg, false);
	}

	async update(msg, state) {
		await msg.guild.settings.sync();
		await msg.guild.settings.update('social.enabled', state).catch(() => null);
		return msg.responder.success('COMMAND_SOCIAL_TOGGLE_SOCIAL', state);
	}

	async levelmessages(msg) {
		await msg.guild.settings.sync();
		await msg.guild.settings.update('social.levelupMessages', !msg.guild.settings.get('social.levelupMessages'));
		return msg.responder.success('COMMAND_SOCIAL_TOGGLE_LEVELS', msg.guild.settings.get('social.levelupMessages'));
	}

	async run(msg) {
		await msg.guild.settings.sync();
		const enabled = msg.guild.settings.get('social.enabled');
		return msg.send(msg.language.get('COMMAND_SOCIAL_STATUS', enabled));
	}

};
