const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['ub', 'unbean'],
			description: language => language.get('COMMAND_UNBAN_DESCRIPTION'),
			usage: '<user  or  users:users> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, reason]) {
		const bannable = await this.getModeratable(msg.member, users);
		if (!bannable.length) return msg.responder.error('COMMAND_UNBAN_NOPERMS', users.length > 1);

		const moderator = msg.author;

		this.executeUnbans(bannable, reason, msg.guild, moderator);
		this.logActions(msg.guild, 'unban', bannable, { reason, moderator, msg });

		return msg.responder.success();
	}

	async executeUnbans(users, reason, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			guild.members.unban(user.id, `${moderator.tag} | ${reason || guild.language.get('COMMAND_UNBAN_NOREASON')}`).catch(() => null);
			this.updateSchedule(user);
		}
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
