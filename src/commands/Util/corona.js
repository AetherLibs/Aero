const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['covid', 'ncov', 'nc'],
			bucket: 2,
			cooldown: 5,
			description: language => language.get('COMMAND_CORONA_DESCRIPTION'),
			usage: '[country:str]'
		});
	}

	async run(msg, [country]) {
		if (!country) return this.allStats(msg);
		return this.countryStats(msg, country);
	}

	async allStats(msg) {
		const stats = await this.client.corona.total();
		const embed = new MessageEmbed()
			.setTitle(msg.language.get('COMMAND_CORONA_EMBED_TITLE'))
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_CASES_TITLE'),
				stats.cases.toLocaleString(),
				true
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_DEATHS_TITLE'),
				stats.deaths.toLocaleString(),
				true
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_RECOVERED_TITLE'),
				stats.recovered.toLocaleString(),
				true
			)
			.setFooter(msg.language.get('COMMAND_CORONA_EMBED_DISCLAIMER'));
		return msg.send({ embed });
	}

	async countryStats(msg, country) {
		const stats = await this.client.corona.country(country).catch(() => null);
		if (!stats) return msg.responder.error('COMMAND_CORONA_INVALID_COUNTRY');

		const embed = new MessageEmbed()
			.setTitle(msg.language.get('COMMAND_CORONA_EMBED_TITLE_COUNTRY', country))
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_CASES_TITLE'),
				`${stats.cases.toLocaleString()} (+${stats.todayCases} ${msg.language.get('COMMAND_CORONA_TODAY')})`,
				true
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_DEATHS_TITLE'),
				`${stats.deaths.toLocaleString()} (+${stats.todayDeaths} ${msg.language.get('COMMAND_CORONA_TODAY')})`,
				true
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_RECOVERED_TITLE'),
				stats.recovered.toLocaleString(),
				true
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_CRITICAL_TITLE'),
				stats.critical.toLocaleString(),
				true
			)
			.setFooter(msg.language.get('COMMAND_CORONA_EMBED_DISCLAIMER'));
		return msg.send({ embed });
	}

};
