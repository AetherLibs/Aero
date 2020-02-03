const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { color: { VERY_NEGATIVE, NEGATIVE, POSITIVE, INFORMATION }, emojis: { success, error } } = require('../../../lib/util/constants');
const req = require('@aero/centra');
const url = 'https://status.discordapp.com/api/v2/';


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
		const overview = await req(url)
			.path('summary.json')
			.json();

		const embed = new MessageEmbed()
			.setTitle(overview.status.description)
			.setColor(this.colors[overview.status.indicator] || INFORMATION);

		const description = [];
		const components = overview.components.filter(comp => !comp.group_id);
		for (const component of components) {
			description.push(`${component.status === 'operational' ? success : error} **${component.name}:** ${component.status.replace(/_/g, ' ')}`);
		}

		embed.setDescription(description.join('\n'));

		const incident = await req(url)
			.path('incidents.json')
			.json()
			.then(res => res.incidents[0]);

		embed.addField('Latest Incident', `[${incident.name}](${incident.shortlink}) (${incident.status})`);

		return msg.sendEmbed(embed);
	}

};
