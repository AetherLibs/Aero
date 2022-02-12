const { Event } = require('@aero/klasa');
const { FLAGS } = require('discord.js').Permissions;
const { join } = require('path');
const { readFile, readdir } = require('fs/promises');
const sharp = require('sharp');

const req = require('@aero/centra');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});

		this.bannedMemberNames = [
			/(mod(erator)?|hypesquad|developer)\s+academy/i,
			/discord\s+hypesquad/i,
			/(hypesquad|discord)\s+events/i,
			/discord\s+(developers|api|bots|message)?/i,
			/^discord\s+moderator$/i
		]

		this.bannedAvatars = new Map();
		this.avatarThreshold = 0.95;
	}

	async run(member) {
		await member.settings.sync();

		const autoroles = await member.guild.settings.get('mod.roles.auto');
		const botrole = await member.guild.settings.get('mod.roles.bots');

		// persistency
		const botsHighestRole = member.guild.me.roles.highest;
		const persistroles = member.settings.get('persistRoles')
			.filter(id => !autoroles.includes(id))
			.filter(id => botsHighestRole.comparePositionTo(id) > 0)
			.filter(id => id !== member.guild.id);
		const persistnick = member.settings.get('persistNick');
		if (persistnick) await member.setNickname(persistnick);

		// botroles
		if (member.guild.me.permissions.has(FLAGS.MANAGE_ROLES)) {
			let roles = persistroles;

			if (autoroles.length && !member.user.bot && !member.pending) {
				roles = roles.concat(autoroles);
			} else if (member.user.bot && botrole) {
				roles.push(botrole);
			}

			member.addRoles(roles);
		}

		// raid prevention
		member.guild.joinCache.add(member.id);
		setTimeout(() => { member.guild.joinCache.delete(member.id); }, 20000);
		if (member.guild.joinCache.size >= 50) this.client.emit('raid', member.guild, [...member.guild.joinCache]);

		// welcoming
		this.welcome(member);

		// username cleanup
		member.guild.modCache.add(member.id);
		await this.dehoist(member);
		await this.cleanName(member);
		member.guild.modCache.delete(member.id);

		// logging
		await member.guild.log.memberJoined({ member });

		if (member.guild.settings.get('mod.shield')) {
			// global ban check
			const { trust, bans } = await req('https://ravy.org/api/v1/')
				.path('/users')
				.path(member.id)
				.path('/bans')
				.header('Authorization', process.env.RAVY_TOKEN)
				.json();
			if (trust.level <= 2) this.client.emit('globalBan', member, bans);

			// username check
			if (this.bannedMemberNames.reduce((acc, cur) => acc || cur.test(member.user.username), false)) {
				member.guild.members.ban(member.id, { reason: 'Probable spambot, matched suspicious username' });
			}

			// avatar check
			const matchedAvatar = this.matchesBannedAvatar(member.user);
			if (matchedAvatar) {
				member.guild.members.ban(member.id, { reason: `Probable spambot, matched suspicious avatar [${matchedAvatar}]` });
			}

		}
		return member;
	}

	dehoist(member) {
		if (!member.guild.settings.get('mod.anti.hoisting')) return member;
		if (member.hoisting) member.dehoist();
		return member;
	}

	cleanName(member) {
		if (!member.guild.settings.get('mod.anti.unmentionable')) return member;
		member.cleanName();
		return member;
	}

	welcome(member) {
		if (member.user.bot) return member;
		const { guild } = member;
		const channelID = guild.settings.get('welcome.channel');
		if (!channelID) return member;
		const channel = guild.channels.cache.get(channelID);
		if (!channel) return member;

		const message = guild.settings.get('welcome.message');
		if (!message) return member;

		const parsed = this._fillTemplate(message, member);

		channel.send(parsed);
		return member;
	}

	_fillTemplate(template, member) {
		return template
			.replace(/{(member|user|mention)}/gi, member.toString())
			.replace(/{(name|username)}/gi, member.user.username)
			.replace(/{tag}/gi, member.user.tag)
			.replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
			.replace(/{(guild|server)}/gi, member.guild.name);
	}

	async matchesBannedAvatar(user) {
		if (!user.avatar) return false;
		const _avatar = await req(user.avatarURL({ format: 'png', size: 256 })).raw();
		const avatar = await sharp(_avatar).resize(256, 256).toBuffer();
		for (const [key, bannedAvatar] of this.bannedAvatars.entries()) {
			const similarity = await this.ssim(avatar, bannedAvatar);
			if (similarity > this.avatarThreshold) return key;
		}
		return false;
	}

	async init() {
		const base = join(process.cwd(), 'config/avatars');
		const ssim = await import('@aero/ssim');

		this.ssim = ssim.default;

		const files = await readdir(base);

		for (const filename of files) {
			const file = await readFile(join(base, filename));
			const key = filename.replace('.png', '');

			this.bannedAvatars.set(key, file);
		}
	}

};
