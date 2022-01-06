const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const { infinity } = require('../util/constants').emojis;

module.exports = class LGBTImageCommand extends Command {


	constructor(name, ...args) {
		const options = args.pop();

		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			usage: '[user:username]',
			...options
		});

		this.name = name;
	}

	async run(msg, [user = msg.author]) {
		let avatar = user.displayAvatarURL({ size: 1024, format: 'png' });
		if (msg.flagArgs.guild) {
			const member = await msg.guild.members.fetch(user);
			if (member.customAvatar) avatar = member.customAvatarURL({ size: 1024, format: 'png' });
		}
		

		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);

		const img = await req(this.client.config.lgbtURL)
			.path('circle')
			.query({ image: avatar, type: this.name })
			.raw();

		await msg.channel.sendFile(img, 'avatar.png');

		return loading.delete();
	}

};
