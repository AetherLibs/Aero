const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const color = require('tinycolor2');

const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

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
		const colorData = color(hexCode);
		if (colorData._format === false) return msg.responder.error('COMMAND_COLOR_INVALIDCOLOR');
		const img = await this.draw(colorData.toHex());
		return msg.channel.sendFile(img, 'color.png', [
			`**${colorData.toName() ? toTitleCase(colorData.toName()) : 'Unnamed'}**`,
			`Hex: ${colorData.toHexString()}`,
			`RGB: ${colorData.toRgbString()}`,
			`HSV: ${colorData.toHsvString()}`,
			`HSL: ${colorData.toHslString()}`
		].join('\n'));
	}

	random(msg) {
		const random = color.random();
		return this.display(msg, random.toHex());
	}

	async draw(color) {
		const { body } = await req(this.client.config.colorgenURL)
			.path('color')
			.query({ color })
			.send();
		return body;
	}

};
