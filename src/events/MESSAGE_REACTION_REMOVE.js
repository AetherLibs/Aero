/*
 * rero():
 * Co-Authored-By: William Johnstone <william@endevrr.com>
 * Co-Authored-By: Ravy <ravy@aero.bot>
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2020
 *
 * run, stars():
 * Authored-By: Ravy <ravy@aero.bot>
 * Credit example: Credit goes to [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2020
 */
const { Event } = require('klasa');
const { syncVotes } = require('~/lib/structures/StarEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'ws'
		});
	}

	async run({ user_id: userID, guild_id: guildID, message_id: messageID, channel_id: channelID, emoji }) {
		const guild = this.client.guilds.get(guildID);
		if (!guild) return null;

		this.rero({ userID, messageID, guild, emoji });

		this.stars({ userID, messageID, guild, emoji, channelID });

		return true;
	}

	async rero({ userID, messageID, guild, emoji }) {
		const reactionRoles = guild.settings.get('mod.roles.reactionRoles');
		if (!reactionRoles) return null;
		await guild.members.fetch(userID).catch(() => null);

		reactionRoles.find(reactionRole => {
			if (reactionRole.messageID === messageID && reactionRole.emoji === emoji.id || reactionRole.emoji === emoji.name) {
				const member = guild.members.get(userID);
				if (member.user.bot) return false;
				const role = guild.roles.get(reactionRole.roleID);
				if (!role) return false;
				member?.roles?.remove(role, guild.language.get('COMMAND_REACTIONROLE_ROLEUPDATE_REASON'));
				return true;
			}
			return false;
		});

		return false;
	}

	async stars({ userID, messageID, channelID, guild, emoji }) {
		const starChannelID = guild.settings.get('starboard.channel');
		if (!starChannelID) return false;
		const starChannel = await guild.channels.get(starChannelID);
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

		const message = isStarChannel
			? await guild.channels.get(starredMessage.channel).messages.fetch(starredMessage.id)
			: await guild.channels.get(channelID).messages.fetch(messageID);
		await guild.members.fetch(message.author.id);

		let votes = await syncVotes(message);
		if ((votes.length < threshold) && !isStarChannel) return false;

		if (!starredMessage && !isStarChannel) return false;
		const starMessage = await starChannel.messages.fetch(starredMessage.starMessage)
			.catch(() => null);
		if (!starMessage) return false;
		votes = await syncVotes(message, starMessage);
		this.client.emit('starUpdated', message, { votes, starMessage });

		return true;
	}

};
