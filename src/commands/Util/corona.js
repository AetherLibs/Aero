const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { VERY_NEGATIVE } = require('../../../lib/util/constants').color;

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
		const stats = country 
			? await this.countryStats(country)
			: await this.allStats();

		const embed = this.buildEmbed(msg, stats);

		return msg.send({ embed });
	}

	async allStats() {
		const stats = await this.client.corona.total() || this.client.corona.getTotal();
		if (!stats) throw 'COMMAND_CORONA_UNAVAILABLE';
		
		return stats;
	}

	async countryStats(country) {
		const stats = await this.client.corona.country(country).catch(() => null);
		if (!stats) throw 'COMMAND_CORONA_INVALID_COUNTRY';

		return stats;
	}

	buildEmbed(msg, stats) {
		const embed = new MessageEmbed()
			.setTitle(stats.name 
				? msg.language.get('COMMAND_CORONA_EMBED_TITLE_COUNTRY', stats.name)
				: msg.language.get('COMMAND_CORONA_EMBED_TITLE'))
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_CASES_TITLE'),
				[
					`**${stats.cases.toLocaleString()}** (+${stats.todayCases.toLocaleString()} ${msg.language.get('COMMAND_CORONA_TODAY')})`,
					`${stats.critical.toLocaleString()} ${msg.language.get('COMMAND_CORONA_CRITICAL')}`,
					`${(stats.casesPerOneMillion) / 10000}% ${msg.language.get('COMMAND_CORONA_ABSOLUTE_INFECTION_RATE')}`
				].join('\n')
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_DEATHS_TITLE'),
				[
					`**${stats.deaths.toLocaleString()}** (+${stats.todayDeaths.toLocaleString()} ${msg.language.get('COMMAND_CORONA_TODAY')})`,
					`${Math.round((stats.deaths / stats.cases) * 10000) / 100}% ${msg.language.get('COMMAND_CORONA_CASE_FATALITY_RATE')}`,
					`${(stats.deathsPerOneMillion) / 10000}% ${msg.language.get('COMMAND_CORONA_ABSOLUTE_FATALITY_RATE')}`
				].join('\n')
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_RECOVERED_TITLE'),
				[
					`**${stats.recovered.toLocaleString()}**`,
					`${Math.round((stats.recovered / stats.cases) * 10000) / 100}% ${msg.language.get('COMMAND_CORONA_CASE_RECOVERY_RATE')}`
				].join('\n')
			)
			.addField(
				msg.language.get('COMMAND_CORONA_EMBED_FIELD_TESTS_TITLE'),
				[
					`**${stats.tests.toLocaleString()}**`,
					`${(stats.testsPerOneMillion) / 10000}% ${msg.language.get('COMMAND_CORONA_ABSOLUTE_TESTS_RATE')}`
				].join('\n')
			)
			.setFooter(msg.language.get('COMMAND_CORONA_EMBED_DISCLAIMER'))
			.setColor(VERY_NEGATIVE);

		return embed;
	}

};
