const { Structures } = require('discord.js');
const sanitize = require('@aero/sanitizer');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		constructor(client, data, guild) {
			super(client, data, guild);
			this.pending = data?.pending ?? false;
			this.communicationDisabledUntil = data?.communication_disabled_until ?? null;
			this.customAvatar = data?.avatar ?? null;
			this.prevMessageContent = null;
			this.prevMessageID = null;
			this.prevChannelID = null;
			this.duplicateCount = 0;
			this.nonduplicateCount = 0;
		}

		get muted() {
			if (this.chatMutedUntil) return true;
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

		muteTimed(reason, date) {
			/* eslint-disable-next-line camelcase */
			this.client.api.guilds(this.guild.id).members(this.id).patch({ data: { communication_disabled_until: date }, reason });
			return this;
		}

		unmute(reason) {
			const id = this.guild.settings.get('mod.roles.mute');
			if (this.chatMutedUntil) this.muteTimed(reason, null);
			if (!id) return this;
			if (this.guild.roles.cache.get(id)) this.roles.remove(id, reason);
			return this;
		}

		dehoist() {
			this.setNickname(`⬇${this.displayName.slice(1, 32)}`).catch(() => null);
			return this;
		}

		customAvatarURL({ size = '2048', format = 'webp', dynamic = false } = {}) {
			if (!this.customAvatar) return null;
			if (dynamic && this.customAvatar.startsWith('a_')) format = 'gif';
			return `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.id}/avatars/${this.customAvatar}.${format}?size=${size}`;
		}

		displayAvatarURL(...args) {
			if (this.customAvatar) return this.customAvatarURL(...args);
			else return this.user.displayAvatarURL(...args);
		}

		_patch(data) {
			if ('pending' in data) this.pending = data.pending;
			if ('communication_disabled_until' in data) this.communicationDisabledUntil = data.communication_disabled_until;
			if ('avatar' in data) this.customAvatar = data.avatar;
			super._patch(data);
		}

		get communicationDisabledUntil() {
			return this.chatMutedTimestamp;
		}

		set communicationDisabledUntil(date) { /* eslint-disable-line camelcase */
			if (!date) {
				this.chatMutedTimestamp = null;
			} else {
				this.chatMutedTimestamp = new Date(date).getTime();
			}
		}

		get chatMutedUntil() {
			if (!this.chatMutedTimestamp) return null;
			return new Date(this.chatMutedTimestamp);
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

		addRoles(roles) {
			if (roles.length > this.client.config.roleBulkThreshold) {
				return this.roles.add(roles);
			} else {
				return Promise.all(roles.map(role => this.roles.add(role)));
			}
		}

	}

	return AeroMember;
});
