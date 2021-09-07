const BaseBoardEvent = require('./BaseBoardEvent');

module.exports = class extends BaseBoardEvent {

	generateReacts(count) {
		const tier0 = '⭐';
		const tier1 = '🌟';
		const tier1count = 5;
		const tier2 = '🌠';
		const tier2count = 10;

		const icon = count > tier2count
			? tier2
			: count > tier1count
				? tier1
				: tier0;

		return `${icon} **${count}**`;
	}

	static async syncVotes(msg, starMessage) {
		const mainVoteUserStore = msg.reactions.cache
			.filter(reaction => ['⭐', '🌟'].includes(reaction.emoji?.name))
			.map(reaction => reaction.users);

		const secondaryVoteUserStore = starMessage?.reactions?.cache
			?.filter(reaction => ['⭐', '🌟'].includes(reaction.emoji?.name))
			?.map(reaction => reaction.users) ?? [];

		let userIDs = [];
		for (const userStore of [...mainVoteUserStore, ...secondaryVoteUserStore]) {
			await userStore.fetch();
			userIDs = [...userStore.cache.keyArray(), ...userIDs];
		}

		return [...new Set(userIDs)].filter(id => (id !== msg.client.user.id) && (id !== msg.author.id));
	}

};
