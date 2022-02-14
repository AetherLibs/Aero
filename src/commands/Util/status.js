const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');
const { color: { VERY_NEGATIVE, NEGATIVE, POSITIVE, INFORMATION }, emojis: { success, error } } = require('../../../lib/util/constants');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_STATUS_DESCRIPTION')
		});

		this.colors = {
			none: POSITIVE,
			minor: NEGATIVE,
			major: VERY_NEGATIVE
		};
	}

	async run(msg) {
		const overview = await this.client.dstatus.summary();

		const embed = new MessageEmbed()
			.setTitle(overview.status.description)
			.setColor(this.colors[overview.status.indicator] || INFORMATION);

		const description = [];
		for (const component of overview.components)
			description.push(`${component.status === 'operational' ? success : error} **${component.name}:** ${component.status.replace(/_/g, ' ')}`);


		embed.setDescription(description.join('\n'));

		const incident = await this.client.dstatus.incidents().then(res => res[0]);

		embed.addField('Latest Incident', `[${incident.name}](${incident.url}) (${incident.status})`);

		return msg.sendEmbed(embed);
	}

};
