const { Command } = require('klasa');
const req = require('@aero/centra');
const { infinity } = require('../util/constants').emojis;

class NekosLifeCommand extends Command {

	constructor({ name, pathName, avatarCount = 0, usernameCount = 0, text = false, textValidator = false, textValidatorResponse = '', fileType = 'png', cooldown = 3 }, ...args) {
		let usage = '';

		const userCount = Math.max(avatarCount, usernameCount);

		if (userCount > 0) usage += '<user:username> '.repeat(userCount);
		if (text) usage += '<text:...string>';
		usage = usage.trim();

		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			usage,
			usageDelim: ' ',
			cooldown,
			quotedStringSupport: true,
			requiredPermissions: ['ATTACH_FILES']
		});

		this.name = pathName || name;
		this.avatarCount = avatarCount;
		this.usernameCount = usernameCount;
		this.userCount = userCount;
		this.text = text;
		this.textValidator = textValidator;
		this.textValidatorResponse = textValidatorResponse;
		this.fileType = fileType;
	}

	async run(msg, args) {
		// usage: user1..n text
		const data = {};
		if (this.avatarCount > 0) {
			const users = args.slice(0, this.userCount);
			data.avatars = users.map(u => u.avatarURL({ format: 'png' }));
		}
		if (this.usernameCount > 0) {
			const users = args.slice(0, this.userCount);
			data.usernames = users.map(u => u.username);
		}
		if (this.text) {
			const text = args[this.userCount];
			if (typeof this.textValidator === 'function') {
				if (!this.textValidator(text)) return msg.responder.error(this.textValidatorResponse);
			}
			data.text = text;
		}

		const m = await msg.channel.send(`${infinity} this might take a few seconds`);

		const { body } = await req(this.client.config.memegenURL, 'POST')
			.header('Authorization', process.env.MEMEGEN_TOKEN)
			.path(this.name)
			.body(data, 'json')
			.send();

		await msg.channel.sendFile(body, `${this.name}.${this.fileType}`);

		return m.delete();

	}

}

module.exports = NekosLifeCommand;
