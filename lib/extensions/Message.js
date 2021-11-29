/*
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Credit example: Credit goes to [ravy](https://ravy.pink) and [Stitch07](https://github.com/Stitch07). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Structures } = require('discord.js');
const Responder = require('../Responder');

Structures.extend('Message', Message => {
	class AeroMessage extends Message {

		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.invite = null;
		}

		get exempt() {
			if (!this.guild) return false;
			if (this?.member?.hasPermission('ADMINISTRATOR')) return true;
			if (this.guild.settings.get('mod.ignored.users').includes(this.author.id)) return true;
			if (this.guild.settings.get('mod.ignored.channels').includes(this.channel.id)) return true;
			const ignoredRoles = this.guild.settings.get('mod.ignored.roles');
			if (!this.member) return false;
			for (const role of this.member.roles.cache.keys()) {
				if (ignoredRoles.includes(role)) return true;
			}
			return false;
		}

	}
	return AeroMessage;
});
