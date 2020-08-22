const { Event } = require('klasa');

const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	buildEmbed(msg, guild, channel, message, stars) {
		const embed = new MessageEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png' }))
			.setColor(msg.member.displayColor || guild.me.displayColor || 'RANDOM')
			.setDescription([
				msg.content.slice(0, 1500) + (msg.content.length > 1500 ? '...' : ''),
				'',
				`${stars} | [jump to message](https://discord.com/channels/${guild.id}/${channel}/${message})`
			].join('\n'));

		return embed;
	}

	generateStars(starCount) {
		const tier0 = '⭐';
		const tier1 = '🌟';
		const tier1count = 5;
		const tier2 = '🌠';
		const tier2count = 10;

		const icon = starCount > tier2count
			? tier2
			: starCount > tier1count
				? tier1
				: tier0;

		return `${icon} **${starCount}**`;
	}

	static async syncVotes(msg, starMessage) {
		const mainVoteUserStore = msg.reactions
			.filter(reaction => ['⭐', '🌟'].includes(reaction.emoji?.name))
			.map(reaction => reaction.users);

		const secondaryVoteUserStore = starMessage?.reactions
			?.filter(reaction => ['⭐', '🌟'].includes(reaction.emoji?.name))
			?.map(reaction => reaction.users) ?? [];

		let userIDs = [];
		for (const userStore of [...mainVoteUserStore, ...secondaryVoteUserStore]) {
			await userStore.fetch();
			userIDs = [...userStore.keyArray(), ...userIDs];
		}

		return [...new Set(userIDs)].filter(id => id !== msg.client.user.id);
	}

};
