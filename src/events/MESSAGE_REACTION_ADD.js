/*
 * Author: William Johnstone <william@endevrr.com>
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com). (c) [The Aero Team](https://aero.bot) 2020
 */
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'ws'
		});
	}

	async run({ user_id: userID, guild_id: guildID, message_id: messageID, emoji }) {
		const guild = this.client.guilds.get(guildID);
		if (!guild) return null;
		const reactionRoles = guild.settings.get('mod.roles.reactionRoles');
		if (!reactionRoles) return null;
		await guild.members.fetch(userID).catch(() => null);

		reactionRoles.find(reactionRole => {
			if (reactionRole.messageID === messageID && reactionRole.emoji === emoji.id || reactionRole.emoji === emoji.name) {
				const member = guild.members.get(userID);
				if (member.user.bot) return false;
				const role = guild.roles.get(reactionRole.roleID);
				if (!role) return null;
				member?.roles?.add(role, guild.language.get('COMMAND_REACTIONROLE_ROLEUPDATE_REASON'));
				return true;
			}
			return false;
		});

		return false;
	}

};
