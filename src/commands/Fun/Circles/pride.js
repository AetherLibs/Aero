const { Command } = require('@aero/klasa');
const req = require('@aero/centra');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PRIDE_DESCRIPTION'),
			usage: '[user:username]',
			aliases: ['gay', 'lgbt']
		});
	}

	async run(msg, [user = msg.author]) {
		const avatar = user.displayAvatarURL({ size: 1024, format: 'png' });

		const img = await req(this.client.config.lgbtURL)
			.path('circle')
			.query({ image: avatar, type: 'pride' })
			.raw();

		return msg.channel.sendFile(img, 'avatar.png');
	}

};
