const { Command } = require('@aero/klasa');
const req = require('@aero/http');
const tc2 = require('tinycolor2');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_COLOR_DESCRIPTION'),
			usage: '[random|display] [color:...str]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, hexCode]) {
		if (!action) {
			if (!hexCode) action = 'random';
			else action = 'display';
		}
		return this[action](msg, hexCode);
	}

	async display(msg, hexCode) {
		if (!hexCode) return msg.responder.error('COMMAND_COLOR_NOCOLOR');
		const colorData = tc2(hexCode);
		if (colorData._format === false) return msg.responder.error('COMMAND_COLOR_INVALIDCOLOR');
		const img = await this.draw(colorData.toHex());
		return msg.channel.sendFile(img, 'color.png', [
			`**${await this.getName(colorData.toHex())}**`,
			`Hex: ${colorData.toHexString()}`,
			`RGB: ${colorData.toRgbString()}`,
			`HSV: ${colorData.toHsvString()}`,
			`HSL: ${colorData.toHslString()}`
		].join('\n'));
	}

	random(msg) {
		const random = tc2.random();
		return this.display(msg, random.toHex());
	}

	async draw(color) {
		const { body } = await req(this.client.config.colorgenURL)
			.path('color')
			.query({ color })
			.send();
		return body;
	}

	async getName(color) {
		const { name } = await req('https://colornames.org/search/json/')
			.query('hex', color)
			.json();
		return name || 'Unnamed';
	}

};
