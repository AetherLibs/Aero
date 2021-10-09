const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');
const { zws } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_LYRICS_DESCRIPTION'),
			usage: '<query:string>',
			aliases: ['ly'],
			requiredPermissions: ['EMBED_LINKS']
		});

		this.deprecated = 'API deprecated the lyrics endpoint.';
	}

	async run(msg, [query]) {
		const track = await this.client.ksoft.lyrics.get(query);
		const embed = new MessageEmbed()
			.setTitle(track.name)
			.setDescription(track.artist.name)
			.setURL(track.url)
			.setThumbnail(track.artwork)
			.setColor(msg.guild ? msg.guild.me.displayColor : 'ffaabb')
			.setFooter(msg.language.get('COMMAND_KSOFT_POWEREDBY'));

		const out = [];
		for (const verse of track.lyrics.split('\n\n')) {
			if (out.length === 0) out.push(verse);
			else if ((out[out.length - 1].length + verse.length) < 1000) out[out.length - 1] += `\n\n${verse}`;
			else out.push(verse);
		}

		for (const part of out) {
			embed.addField(zws, /^\s+$/.test(part) ? zws : part);
		}

		return msg.sendEmbed(embed).catch(() => msg.responder.error('COMMAND_LYRICS_FAILED', track.url));
	}

};
