/*
 * rero():
 * Co-Authored-By: William Johnstone <william@endevrr.com> (https://endevrr.com)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 *
 * run, stars, lemons():
 * Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Event } = require('@aero/klasa');
const { syncVotes: syncStarVotes } = require('~/lib/structures/StarEvent');
const { syncVotes: syncLemonVotes } = require('~/lib/structures/LemonEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'ws'
		});
	}

	async run({ user_id: userID, guild_id: guildID, message_id: messageID, channel_id: channelID, emoji }) {
		const guild = this.client.guilds.cache.get(guildID);
		if (!guild) return null;

		this.rero({ userID, messageID, guild, emoji });

		this.stars({ userID, messageID, guild, emoji, channelID });
		this.lemons({ userID, messageID, guild, emoji, channelID });

		return true;
	}

	async rero({ userID, messageID, guild, emoji }) {
		const reactionRoles = guild.settings.get('mod.roles.reactionRoles');
		if (!reactionRoles) return null;
		await guild.members.fetch(userID).catch(() => null);

		reactionRoles.find(reactionRole => {
			if (reactionRole.messageID === messageID && (reactionRole.emoji === emoji.id || reactionRole.emoji === emoji.name)) {
				const member = guild.members.cache.get(userID);
				if (member?.user.bot) return false;
				const role = guild.roles.cache.get(reactionRole.roleID);
				if (!role) return false;
				member?.roles?.remove(role, guild.language.get('COMMAND_REACTIONROLE_ROLEUPDATE_REASON'));
				return true;
			}
			return false;
		});

		return false;
	}

	async stars({ userID, messageID, channelID, guild, emoji }) {
		const { bot } = await this.client.users.fetch(userID);
		if (bot) return false;
		const starChannelID = guild.settings.get('starboard.channel');
		if (!starChannelID) return false;
		const starChannel = await guild.channels.cache.get(starChannelID);
		if (!starChannel) return false;
		const isStarChannel = channelID === starChannelID;
		if (userID === this.client.user.id) return false;

		if (!['⭐', '🌟'].includes(emoji?.name)) return false;

		const threshold = guild.settings.get('starboard.trigger');

		const starredMessages = guild.settings.get('starboard.messages');
		const starredMessage = starredMessages.find((msg) =>
			isStarChannel
				? msg.starMessage === messageID
				: msg.id === messageID && msg.channel === channelID
		);

		if (isStarChannel && !starredMessage) return false;

		const message = isStarChannel
			? await guild.channels.cache.get(starredMessage.channel)?.messages.fetch(starredMessage.id).catch(() => null)
			: await guild.channels.cache.get(channelID).messages.fetch(messageID).catch(() => null);
		if (!message) return false;
		await guild.members.fetch(message.author.id);

		let votes = await syncStarVotes(message);
		if ((votes.length < threshold) && !isStarChannel) return false;

		if (!starredMessage && !isStarChannel) return false;

		const starMessage = await starChannel.messages.fetch(starredMessage.starMessage)
			.catch(() => null);
		if (!starMessage) return false;
		votes = await syncStarVotes(message, starMessage);
		this.client.emit('starUpdated', message, { votes, starMessage });

		return true;
	}

	async lemons({ userID, messageID, channelID, guild, emoji }) {
		const { bot } = await this.client.users.fetch(userID);
		if (bot) return false;
		const lemonChannelID = guild.settings.get('lemonboard.channel');
		if (!lemonChannelID) return false;
		const lemonChannel = await guild.channels.cache.get(lemonChannelID);
		if (!lemonChannel) return false;
		const isLemonChannel = channelID === lemonChannelID;
		if (userID === this.client.user.id) return false;

		if (emoji?.name !== '🍋') return false;

		const threshold = guild.settings.get('lemonboard.trigger');

		const lemonedMessages = guild.settings.get('lemonboard.messages');
		const lemonedMessage = lemonedMessages.find((msg) =>
			isLemonChannel
				? msg.starMessage === messageID
				: msg.id === messageID && msg.channel === channelID
		);

		if (isLemonChannel && !lemonedMessage) return false;

		const message = isLemonChannel
			? await guild.channels.cache.get(lemonedMessage.channel)?.messages.fetch(lemonedMessage.id).catch(() => null)
			: await guild.channels.cache.get(channelID).messages.fetch(messageID).catch(() => null);
		if (!message) return false;
		await guild.members.fetch(message.author.id);

		if (userID === message.author.id) return message.reactions.cache.get(emoji.name)?.users.remove(userID).catch(() => null);

		let votes = await syncLemonVotes(message);
		if ((votes.length < threshold) && !isLemonChannel) return false;

		if (!lemonedMessage && !isLemonChannel) return false;

		const starMessage = await lemonChannel.messages.fetch(lemonedMessage.starMessage)
			.catch(() => null);
		if (!starMessage) return false;
		votes = await syncLemonVotes(message, starMessage);
		this.client.emit('lemonUpdated', message, { votes, starMessage });

		return true;
	}

};
