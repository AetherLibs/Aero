const BaseBoardEvent = require('./BaseBoardEvent');

module.exports = class extends BaseBoardEvent {

	generateReacts(count) {
		return `🍋 **${count}**`;
	}

	static async syncVotes(msg, starMessage) {
		const mainVoteUserStore = msg.reactions.cache
			.filter(reaction => reaction.emoji?.name === '🍋')
			.map(reaction => reaction.users);

		const secondaryVoteUserStore = starMessage?.reactions?.cache
			?.filter(reaction => reaction.emoji?.name === '🍋')
			?.map(reaction => reaction.users) ?? [];

		let userIDs = [];
		for (const userStore of [...mainVoteUserStore, ...secondaryVoteUserStore]) {
			await userStore.fetch();
			userIDs = [...userStore.cache.keyArray(), ...userIDs];
		}

		return [...new Set(userIDs)].filter(id => (id !== msg.client.user.id) && (id !== msg.author.id));
	}

};
