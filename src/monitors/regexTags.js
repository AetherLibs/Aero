const { Monitor } = require('@aero/klasa');
const Parser = require('@aero/tags');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild) return;
		const tags = msg.guild.settings.get('regexTags');
		if (!tags?.length) return;

		const matchedTags = tags.filter(([tag]) => tag.test(msg.content));
		const parsedTags = await Promise.all(
			matchedTags.map(tag => this.parser.parse(tag[1], {
				args: msg.content.slice(msg.prefixLength).trim().split(/\s+/).slice(1),
				user: msg.author,
				guild: msg.guild,
				channel: msg.channel,
				member: msg.member,
				trigger: msg,
				logger: this.client.console
			}))
		);
		const results = parsedTags.map(result => result?.trim()).filter(result => result?.length);

		for (const result of results)
			msg.send(result);

		return;
	}

	async init() {
		this.parser = new Parser();
	}

};
