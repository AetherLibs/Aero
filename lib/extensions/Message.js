/*
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Credit example: Credit goes to [ravy](https://ravy.pink) and [Stitch07](https://github.com/Stitch07). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Structures } = require('discord.js');
const Responder = require('../Responder');
const { ownerAccess } = require('~/config/aero');
const PK_ID = '466378653216014359';

Structures.extend('Message', Message => {
	class AeroMessage extends Message {

		constructor(client, data, channel) {
			super(client, data, channel);
			this.responder = new Responder(this);
			this.invite = null;
			this.originalAuthor = null;
			this.pk = data?.application_id && data.application_id === PK_ID;
		}

		get exempt() {
			if (ownerAccess.includes(this.author.id)) return true;
			if ([...this.client.owners].map(owner => owner.id).includes(this.author.id)) return true;
			if (!this.guild) return false;
			if (this?.member?.hasPermission('ADMINISTRATOR')) return true;
			if (this.guild.settings.get('mod.ignored.users').includes(this.author.id)) return true;
			if (this.guild.settings.get('mod.ignored.channels').includes(this.channel.id)) return true;
			const ignoredRoles = this.guild.settings.get('mod.ignored.roles');
			if (!this.member) return false;
			for (const role of this.member.roles.cache.keys())
				if (ignoredRoles.includes(role)) return true;

			return false;
		}

	}
	return AeroMessage;
});
