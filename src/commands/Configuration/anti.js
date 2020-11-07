const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_MESSAGES'],
			aliases: ['automod'],
			description: language => language.get('COMMAND_ANTI_DESCRIPTION'),
			usage: `[${[...args[0].client.gateways.get('guilds').schema.get('mod.anti').keys()].join('|')}] [enable|disable]`,
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async run(msg, [type, action]) {
		if (!action) return this.displaySettings(msg, type);
		if (!type) return msg.responder.error('COMMAND_ANTI_NOTYPE');
		await msg.guild.settings.sync();
		await msg.guild.settings.update(`mod.anti.${type}`, action === 'enable');
		return msg.responder.success('COMMAND_ANTI_SUCCESS', type, action === 'enable', ['hoisting', 'unmentionable'].includes(type));
	}

	async displaySettings(msg, type) {
		if (type) {
			const enabled = msg.guild.settings.get(`mod.anti.${type}`);
			return msg.send(msg.language.get('COMMAND_ANTI_DISPLAY_ONE', type, enabled));
		} else {
			const out = [];
			out.push(msg.language.get('COMMAND_ANTI_DISPLAY_DIVIDER_CHAT'));
			out.push('');
			for (const anti of ['invites', 'duplicates', 'copypastas', 'toxicity', 'gifts']) {
				const enabled = msg.guild.settings.get(`mod.anti.${anti}`);
				out.push(msg.language.get('COMMAND_ANTI_DISPLAY_ALL_CHAT', anti, enabled));
			}
			out.push('');
			out.push(msg.language.get('COMMAND_ANTI_DISPLAY_DIVIDER_USERS'));
			out.push('');
			for (const anti of ['unmentionable', 'hoisting']) {
				const enabled = msg.guild.settings.get(`mod.anti.${anti}`);
				out.push(msg.language.get('COMMAND_ANTI_DISPLAY_ALL_USERS', anti, enabled));
			}
			return msg.send(out.join('\n'));
		}
	}


};
