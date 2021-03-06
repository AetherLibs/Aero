const { Structures, Permissions } = require('discord.js');
const req = require('@aero/http');
const { reactions, emojis: { yes, no } } = require('../util/constants');
const emojis = [reactions.yes, reactions.no, reactions.fallbackYes, reactions.fallbackNo];
const GuildLogger = require('../GuildLogger');

Structures.extend('Guild', Guild => {
	class AeroGuild extends Guild {

		constructor(...args) {
			super(...args);
			this.log = new GuildLogger(this);
			this.modCache = new Set();
			this.joinCache = new Set();
			this.raiderCache = new Set();
			this.raidConfirmation = null;
		}

		async createMuteRole(name) {
			const muterole = await this.roles.create({
				data: { name: name || this.language.get('COMMAND_MUTE_ROLE_DEFAULT'),
					permissions: 0,
					color: '737f8c' },
				reason: this.language.get('COMMAND_MUTE_ROLE_REASON')
			});

			if (!muterole?.id) throw 'Issue setting up the mute role.';

			for (const channel of this.channels.cache.filter(chan => chan.type === 'text').values())
				channel.initMute(muterole.id);


			await this.settings.sync();
			await this.settings.update('mod.roles.mute', muterole.id);

			return muterole.id;
		}

		async createRaidMessage() {
			const channel = this.channels.cache.get(this.settings.get('raid.channel'));
			if (!channel) return this;
			const message = await channel.send(this.language.get('EVENT_RAID', yes, no, await this.constructMessage()));
			this.raidConfirmation = message.id;
			try {
				await message.react(reactions.yes);
				await message.react(reactions.no);
			} catch {
				await message.react(reactions.fallbackYes);
				await message.react(reactions.fallbackNo);
			}
			const userFilter = (user) =>
				!user.bot
				&& this.members.fetch(user.id).then(member => member.hasPermission(Permissions.FLAGS.BAN_MEMBERS));
			const reactionFilter = (reaction) =>
				emojis.includes(reaction.emoji.id) || emojis.includes(reaction.emoji.name);
			message
				.awaitReactions(async (reaction, user) => await userFilter(user) && reactionFilter(reaction), { max: 1 })
				.then(collected => {
					collected.first().emoji.id === reactions.yes
					|| collected.first().emoji.name === reactions.fallbackYes
						? this.client.emit('raidBan', message, collected.first().users.cache.filter(userFilter))
						: this.client.emit('raidReset', message);
				});
			return this;
		}

		async updateRaidMessage() {
			const channel = this.channels.cache.get(this.settings.get('raid.channel'));
			if (!channel) return this;
			const message = await channel.messages.fetch(this.raidConfirmation);
			if (!message) return this.createRaidMessage();
			return message.edit(this.language.get('EVENT_RAID', yes, no, await this.constructMessage()));
		}

		async constructMessage() {
			const raiders = [...this.raiderCache.values()];
			const users = this.raiderCache.size < 20
				? raiders
					.map(id => this.client.users.cache.get(id).toString())
					.join(', ')
				: await req(this.client.config.hasteURL)
					.post()
					.path('documents')
					.body([
						`# Raid attempt`,
						'',
						`Timestamp: ${new Date()}`,
						`Guild: ${this.name} [${this.id}]`,
						'',
						...raiders
							.map(id => this.client.users.cache.get(id))
							.map(user => `[${user.id}] ${user.tag}`)
					].join('\n'))
					.send()
					.then(res => `<${this.client.config.hasteURL}/${res.json.key}.md>`);
			return users;
		}

		raidReset() {
			this.joinCache.clear();
			this.raiderCache.clear();
			this.raidConfirmation = null;
		}

	}

	return AeroGuild;
});
