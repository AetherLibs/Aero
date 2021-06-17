const { Command } = require('@aero/klasa');

const { FLAGS } = require('discord.js').Permissions;
const { DISCORD_ACTIVITY_YOUTUBE, DISCORD_EMBEDDED_APPLICATION_TYPE } = require('~/lib/util/constants');
const req = require('@aero/centra');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_YOUTUBETOGETHER_DESCRIPTION'),
			usage: '<channel:voiceChannel>',
			aliases: ['yt']
		});

		this.defaultPermissions = FLAGS.CREATE_INSTANT_INVITE;
	}

	async run(msg, [channel]) {
		const res = await req('https://discord.com/api/v8')
			.path(`/channels/${channel.id}/invites`)
			.method('POST')
			.header('Authorization', `Bot ${this.client.token}`)
			.body({
				max_age: 0,
				target_type: DISCORD_EMBEDDED_APPLICATION_TYPE,
				target_application_id: DISCORD_ACTIVITY_YOUTUBE
			}, 'json')
			.json();
		
		msg.send(`<https://discord.gg/${res.code}>`);
	}

};
