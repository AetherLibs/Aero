const { Structures } = require('discord.js');
const { nfkd: normalize } = require('unorm');
const limax = require('limax');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		constructor(...args) {
			super(...args);
			this.lastContent = null;
			this.duplicateCount = 0;
		}

		mute(reason, id) {
			if (!id) id = this.guild.settings.get('mod.roles.mute');
			if (!id) return this;
			this.guild.roles.get(id).then(role => { if (role) this.roles.add(id, reason) });
			return this;
		}

		unmute(reason) {
			const id = this.guild.settings.get('mod.roles.mute');
			if (!id) return this;
			this.guild.roles.get(id).then(role => { if (role) this.roles.remove(id, reason) });
			return this;
		}

		dehoist() {
			this.setNickname(`⬇${this.displayName.slice(1, 32)}`).catch(() => null);
			return this;
		}

		cleanName() {
			const name = limax(normalize(this.displayName), {
				replacement: ' ',
				tone: false,
				separateNumbers: false,
				maintainCase: true,
				custom: ['.', ',', ' ', '!', '\'', '"', '?', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⬇']
			});
			this.setNickname(name.slice(0, 32)).catch(() => null);
			return this;
		}

	}

	return AeroMember;
});
