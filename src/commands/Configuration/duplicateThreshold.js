const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			aliases: ['dupsim'],
			description: language => language.get('COMMAND_DUPLICATETHRESHOLD_DESCRIPTION'),
			usage: '<percentage:integer{50,100}>'
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async run(msg, [percentage]) {
		const enabled = msg.guild.settings.get('mod.anti.duplicates');
		if (!enabled) return msg.responder.error('COMMAND_DUPLICATETHRESHOLD_DISABLED', msg.guild.settings.get('prefix'));

		await msg.guild.settings.update('mod.similarityThreshold', percentage);
		return msg.responder.success();
	}

};
