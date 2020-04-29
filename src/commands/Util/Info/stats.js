const { Command, version: klasaVersion, Duration } = require('klasa');
const { version: discordVersion, MessageEmbed } = require('discord.js');
const { hostname, totalmem, cpus, loadavg } = require('os');
const { version: aeroVersion } = require('../../../../package');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(message) {
		const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024;
		const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

		const stats = message.language.get('COMMAND_STATS',
			this.client.user.username,
			usage.toLocaleString(),
			total.toLocaleString(),
			(usage / total * 100).toFixed(1),
			(loadavg()[0] * 100).toFixed(1),
			cpus().length,
			(cpus()[0].speed / 1000).toFixed(1),
			Duration.toNow(Date.now() - (process.uptime() * 1000)),
			klasaVersion, discordVersion, process.version, hostname(),
			(message.guild
				? message.guild.shardID
				: 0) + 1,
			this.client.options.shardCount
		).join('\n');
		const embed = new MessageEmbed()
			.setAuthor(`${this.client.user.username} v${aeroVersion} [${process.env.npm_package_gitHead?.slice(0, 12) ?? 'dev'}]`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }), this.client.config.repoURL)
			.setDescription(stats)
			.setColor((message.guild && message.guild.me.displayColor) || 'RANDOM');

		message.send({ embed });
	}

};
