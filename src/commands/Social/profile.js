const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const { readFile } = require('fs-nextra');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PROFILE_DESCRIPTION'),
			usage: '[user:username]'
		});

		this.requireSocial = true;
	}

	async run(msg, [user = msg.author]) {
		const member = await msg.guild.members.fetch(user.id);

		if (!member) return msg.responder.error(msg.language.get('COMMAND_PROFILE_NOTMEMBER'));
		await member.settings.sync(true);
		const avatarURL = user.displayAvatarURL({ format: 'png' });
		const points = member.settings.get('points');
		const level = member.settings.get('level');
		const nextLevel = this.client.monitors.get('points').xpNeeded(level + 1);

		const avatar = await req(avatarURL).raw();
		const progBar = Math.max((points / nextLevel) * 296, 10);
		const canvas = new Canvas(500, 200);
		const bg = await readFile(`${process.cwd()}/assets/backgrounds/clouds.jpg`);

		const dominant = await req(this.client.config.colorgenURL)
			.path('dominant')
			.query('image', avatarURL)
			.text();

		canvas
			.addTextFont('assets/fonts/quicksand.ttf', 'Quicksand')
			.addTextFont('assets/fonts/quicksand-bold.ttf', 'Quicksand Bold')
			.addImage(bg, 0, 0, 600, 200)
			.save()
			.beginPath()
			.moveTo(0, 0)
			.lineTo(0, 200)
			.lineTo(350, 200)
			.lineTo(250, 0)
			.closePath()
			.clip()
			.setColor('#FFFFFF')
			.fill()
			.restore()
			.setColor(`#${dominant}`)
			.addRect(0, 0, 8, 200)
			.restore()
			.addCircularImage(avatar, 90, 125, 60, true)
			.setColor('#FFFFFF')
			.addBeveledRect(177, 117, 306, 26, 16)
			.restore()
			.setColor(`#${dominant}`)
			.addBeveledRect(179, 119, 302, 22, 12)
			.restore()
			.setColor('#FFFFFF')
			.addBeveledRect(180, 120, 300, 20, 10)
			.restore()
			.setTextAlign('left')
			.setTextFont(`20pt Quicksand Bold`)
			.setColor('#2C2F33')
			.addText(user.username, 40, 45, 200)
			.setTextAlign('left')
			.setTextFont(`8pt Quicksand`)
			.setColor('#4C4F55')
			.addText(`#${user.discriminator}`, 40, 59, 50)
			.restore()
			.setTextFont('20pt Quicksand')
			.setTextAlign('left')
			.addText(`${points} / ${nextLevel}`, 180, 110)
			.setTextFont('12pt Quicksand')
			.setTextAlign('left')
			.addText(`Level ${level}`, 185, 158);

		if (points > 5) {
			canvas
				.setColor(`#${dominant}`)
				.addBeveledRect(182, 122, progBar, 16, 20)
				.restore();
		}

		return msg.channel.sendFile(canvas.toBuffer(), 'profile.png');
	}

};
