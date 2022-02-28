const { Command } = require('@aero/klasa');
const { PerspectiveAPI: url } = require('~/lib/util/constants').url;
const { ansi } = require('~/lib/util/util');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_PERSPECTIVETEST_DESCRIPTION'),
			usage: '<string:string>'
		});
	}

	async run(msg, [text]) {
		const res = await req(url)
			.post()
			.path('comments:analyze')
			.query('key', process.env.PERSPECTIVE_TOKEN)
			.body({
				comment: {
					text
				},
				languages: ['en'],
				requestedAttributes: { SEVERE_TOXICITY: {}, IDENTITY_ATTACK: {}, TOXICITY: {}, SEXUALLY_EXPLICIT: {}, THREAT: {}, INSULT: {}, PROFANITY: {} },
				communityId: msg.guild.id,
				sessionId: msg.channel.id
			}, 'json')
			.header('user-agent', `${this.client.user.username}/${this.client.config.version}`)
			.json();

		const content = Object.entries(res.attributeScores).map(([key, score]) => `${ansi}${score.summaryScore.value > 0.9
			? ansi.bold().color('red')
			: ansi.color('green')
		} ${key.padEnd(17)} = ${score.summaryScore.value}`).join('\n');

		msg.send(`>>> \`\`\`ansi\n${content}\n\`\`\``);
	}

};
