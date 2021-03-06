const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');
const req = require('@aero/http');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
			description: language => language.get('COMMAND_BAN_DESCRIPTION').join('\n'),
			usage: '<user  or  users:users|username:membername> [duration:time] [purge|p|soft|s] [reason:...string]',
			usageDelim: ' ',
			examples: [
				'@user purge Spammed a lot of messages.',
				'@user1 @user2 @user3 14d Violating several server rules',
				'@user soft Unacceptable messages, initial offense',
				'643945264868098049 Known to cause trouble'
			]
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, duration, purge = false, reason]) {
		if (!Array.isArray(users)) users = [users];
		const bannable = await this.getModeratable(msg.member, users);
		if (!bannable.length) return msg.responder.error('COMMAND_BAN_NOPERMS', users.length > 1);

		const soft = ['soft', 's'].includes(purge);
		if (duration && soft) return msg.responder.error('COMMAND_BAN_CONFLICT');

		if (purge && msg.guild?.log) {
			/* eslint-disable no-await-in-loop */
			for (const user of users) {
				const channel = user.lastMessageChannelID ? await this.client.channels.fetch(user.lastMessageChannelID).catch(() => null) : msg.channel;
				const _messages = await channel.messages.fetch();
				const messages = _messages
					.filter(message => message.author.id === user.id)
					.filter(message => !!message.content)
					.map(message => `--- ${message.author.tag}, ${dayjs(message.createdAt).format('Do MMM YYYY HH:mm')} ---\n${message.content}\n`);
				const { key } = await req(this.client.config.hasteURL)
					.post()
					.path('documents')
					.body(messages.join('\n'))
					.json();

				const haste = `${this.client.config.hasteURL}/${key}`;

				msg.guild.log.messagesPurged({ user, content: haste, channel, reason: `[ban] ${reason}`, moderator: msg.author });
			}
			/* eslint-enable no-await-in-loop */
		}

		await this.executeBans(bannable, duration, reason, purge, soft, msg.guild, msg.author, msg);

		const action = bannable.length > 1
			? 'bulkBan'
			: duration
				? 'tempban'
				: soft
					? 'softban'
					: 'ban';
		await this.logActions(msg.guild, action, bannable, { duration, reason, moderator: msg.author, msg });

		return msg.responder.success();
	}

	async executeBans(users, duration, reason, purge, soft, guild, moderator, msg) {
		for (const user of users) {
			guild.modCache.add(user.id);
			if (!duration) this.updateSchedule(user);
			guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${moderator.tag} | ${reason || guild.language.get('COMMAND_BAN_NOREASON')}`, days: purge ? 1 : 0 })
				.then(() => {
					if (soft) {
						guild.modCache.add(user.id);
						guild.members.unban(user.id, guild.language.get('COMMAND_BAN_SOFTBANRELEASED'));
					}
				})
				.catch((err) => msg.responder.newError('COMMAND_BAN_ERROR', user, err.message));
		}
		if (duration) this.client.schedule.create('endTempban', duration, { data: { users: users.map(user => user.id), guild: guild.id } });
	}

	updateSchedule(user) {
		const unbanTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempban' && task.data.users.includes(user.id));
		if (!unbanTask) return;
		const { time, data } = unbanTask;
		this.client.schedule.delete(unbanTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) this.client.schedule.create('endTempban', time, { data });
	}


};
