const { Monitor } = require('@aero/klasa');
const req = require('@aero/centra');
const { PerspectiveAPI } = require('../../lib/util/constants').url;

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		const scores = await req(PerspectiveAPI, 'POST')
			.path('comments:analyze')
			.query('key', process.env.PERSPECTIVE_TOKEN)
			.body({
				comment: {
					text: msg.content
				},
				languages: ['en'],
				requestedAttributes: { SEVERE_TOXICITY: {}, IDENTITY_ATTACK: {}, TOXICITY: {} }
			}, 'json')
			.header('user-agent', `${this.client.user.username}/${this.client.config.version}`)
			.send()
			.then(res => res.json.attributeScores);
		if (!scores) return;
		const IDENTITY_ATTACK = scores.IDENTITY_ATTACK.summaryScore.value;
		const SEVERE_TOXICITY = scores.SEVERE_TOXICITY.summaryScore.value;

		if (msg.guild && msg.guild.settings.get('mod.anti.toxicity') && (IDENTITY_ATTACK > 0.9 || SEVERE_TOXICITY > 0.9)) {
			msg.delete({ reason: msg.language.get('EVENT_PERSPECTIVE_DELETEREASON') });
		}

		/*
		const TOXICITY = scores.TOXICITY.summaryScore.value;

		for (const obj of [msg.member, msg.author, msg.guild].filter(i => !!i)) {
			await obj.settings.sync();
			const messages = obj.settings.get('stats.messages');
			const prev = obj.settings.get('stats.toxicity');
			if (messages === 0 || prev === 0) { obj.settings.update('stats.toxicity', TOXICITY); } else {
				const updated = ((prev * messages) + TOXICITY) / (messages + 1);
				obj.settings.update('stats.toxicity', updated);
			}
		}
		*/
	}


};
