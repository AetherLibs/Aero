const { Event } = require('klasa');
const Parser = require('@aero/tags');

module.exports = class extends Event {

	async run(msg, command) {
		if (!msg.guild) return null;
		const tag = msg.guild.settings.get('tags').find(([name]) => name === command.toLowerCase());
		if (!tag) return null;
		const parsedTag = await this.parser.parse(tag[1], {
			args: msg.content.slice(msg.prefixLength).trim().split(/\s+/).slice(1),
			user: msg.author,
			guild: msg.guild,
			channel: msg.channel,
			member: msg.member
		});
		return parsedTag.length ? msg.send(parsedTag) : false;
	}

	async init() {
		this.parser = new Parser();
	}

};
