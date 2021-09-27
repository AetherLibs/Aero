const { Structures } = require('discord.js');
const sanitize = require('@aero/sanitizer');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		constructor(client, data, guild) {
			super(client, data, guild);
			this.pending = data?.pending ?? false;
			this.prevMessageContent = null;
			this.prevMessageID = null;
			this.prevChannelID = null;
			this.duplicateCount = 0;
		}

		get muted() {
			const muteRole = this.guild.settings.get('mod.roles.mute');
			if (!muteRole) return false;
			return this.roles.cache.has(muteRole);
		}

		mute(reason, id) {
			if (!id) id = this.guild.settings.get('mod.roles.mute');
			if (!id) return this;
			if (this.guild.roles.cache.get(id)) this.roles.add(id, reason);
			return this;
		}

		unmute(reason) {
			const id = this.guild.settings.get('mod.roles.mute');
			if (!id) return this;
			if (this.guild.roles.cache.get(id)) this.roles.remove(id, reason);
			return this;
		}

		dehoist() {
			this.setNickname(`⬇${this.displayName.slice(1, 32)}`).catch(() => null);
			return this;
		}

		_patch(data) {
			if ('pending' in data) this.pending = data.pending;
			super._patch(data);
		}

		cleanName() {
			const name = this.displayName.startsWith('⬇')
				? `⬇${sanitize(this.displayName.slice(1))}`
				: sanitize(this.displayName);
			this.setNickname(name.slice(0, 32), 'Cleaning nickname').catch(() => null);
			return this;
		}

		get hoisting() {
			return this.displayName[0] < '0';
		}

	}

	return AeroMember;
});
