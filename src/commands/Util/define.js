const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_DEFINE_DESCRIPTION'),
			usage: '<term:string>',
			aliases: ['def'],
			permissionLevel: 7
		});
	}

	async run(msg, [term]) {
		const res = await req(BASE_URL).path(term).query('key', process.env.MERRIAM_TOKEN).json();

		const definition = res[0];

		if (!definition || !definition.hwi) throw 'COMMAND_DEFINE_NOTFOUND';

		msg.send([
			`(${[definition.fl, ...(definition?.lbs || []) ].join(', ')}) **${definition.hwi.hw.replace(/\*/g, '\\*')}** [${definition.hwi.prs[0].mw}]`,
			definition.def
				.map(def => def.sseq.flat(1)
					.map(sseq => sseq[1])
					.filter(sense => sense.dt)
					.map(sense => {
						const output = [];

						const definitions = sense.dt.find(t => t[0] === 'text');
						if (definitions) {
							const parsed = definitions[1].replace(/{.+?}/g, '');
							if (parsed.replace(/\W+/g, '').length === 0) return false;
							output.push(`- ${parsed}`);
						}

						const examples = sense.dt.find(t => t[0] === 'vis');
						if (examples) output.push(examples[1].filter(obj => obj.t).map(obj => obj.t.replace(/{.+?}/g, '')).map(obj => `  *${obj}*`).join('\n'))

						return output.join('\n');
					})
					.filter(i => !!i)
					.join('\n')
				).join('\n')
		].join('\n'));
	}

};
