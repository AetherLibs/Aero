const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
			description: language => language.get('COMMAND_BAN_DESCRIPTION').join('\n'),
			usage: '<username:membername|user  or  users:users> [duration:time] [purge|p|soft|s] [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, duration, purge = false, reason]) {
		if (!Array.isArray(users)) users = [users];
		const bannable = await this.getModeratable(msg.member, users);
		if (!bannable.length) return msg.responder.error('COMMAND_BAN_NOPERMS', users.length > 1);

		const soft = ['soft', 's'].includes(purge);
		if (duration && soft) return msg.responder.error('COMMAND_BAN_CONFLICT');

		await this.executeBans(bannable, duration, reason, purge, soft, msg.guild, msg.author);

		const action = bannable.length > 1
			? 'bulkBan'
			: duration
				? 'tempban'
				: soft
					? 'softban'
					: 'ban';
		await this.logActions(msg.guild, action, bannable, { duration, reason, moderator: msg.author });

		return msg.responder.success();
	}

	async executeBans(users, duration, reason, purge, soft, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			if (!duration) this.updateSchedule(user);
			await guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${moderator.tag} | ${reason || guild.language.get('COMMAND_BAN_NOREASON')}`, days: purge ? 1 : 0 });
			if (soft) {
				guild.modCache.add(user.id);
				await guild.members.unban(user.id, guild.language.get('COMMAND_BAN_SOFTBANRELEASED'));
			}
		}
		if (duration) this.client.schedule.create('endTempban', duration, { data: { users: users.map(user => user.id), guild: guild.id } });
	}

	updateSchedule(user) {
		const unbanTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempban' && task.data.users.includes(user.id));
		if (!unbanTask) return;
		const { time, data } = unbanTask;
		this.client.schedule.delete(unbanTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempban', time, { data }); }
	}


};
