const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8', 'magic', '8ball', 'mirror'],
			bucket: 2,
			cooldown: 5,
			description: language => language.get('COMMAND_8BALL_DESCRIPTION'),
			usage: '<query:str>'
		});

		this
			.customizeResponse('query', msg => msg.language.get('COMMAND_8BALL_PROMPT'));
	}

	async run(msg, [question]) {
		const answers = msg.language.get('COMMAND_8BALL_ANSWERS');
		return msg.send(question.endsWith('?')
			? `${msg.author} | 🎱 ${answers[Math.floor(Math.random() * answers.length)]}`
			: msg.language.get('COMMAND_8BALL_NOQUESTION'));
	}

};
