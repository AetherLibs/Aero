/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command } = require('@aero/klasa');
const req = require('@aero/http');
const BASE_URL = 'https://api.urbandictionary.com/v0';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_URBAN_DESCRIPTION'),
			usage: '<searchTerm:str> [result:int]',
			usageDelim: ', ',
			cooldown: 5,
			requiredPermissions: ['EMBED_LINKS'],
			aliases: ['ud']
		});

		this
			.customizeResponse('searchTerm', (message) => message.language.get('COMMAND_URBAN_MISSINGTERM'));
	}

	splitText(str, length) {
		const dx = str.substring(0, length).lastIndexOf(' ');
		const pos = dx === -1 ? length : dx;
		return str.substring(0, pos);
	}

	async run(msg, [search, resultNum = 0]) {
		const body = await req(BASE_URL)
			.path('define')
			.query('term', search)
			.json();
		if (resultNum > 1) resultNum--;

		if (!body.list) throw 'COMMAND_URBAN_NODEF';

		const result = body.list[resultNum];
		if (!result) throw msg.language.get('COMMAND_URBAN_MAX', body.list.length);
		const wdef = result.definition.length > 1000
			? `${this.splitText(result.definition, 1000)}...`
			: result.definition;

		const wex = result.example.length > 1000
			? `${this.splitText(result.example, 1000)}...`
			: result.example;

		return msg.send(`${this.removeBrackets(wdef)}\n\n*${this.removeBrackets(wex)}*`);
	}

	removeBrackets(text) {
		return text.replace(/\[([^\[\]]+)\]/g, '$1'); /* eslint-disable-line no-useless-escape */
	}

};
