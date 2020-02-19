const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['m', 'silence', '403'],
			description: language => language.get('COMMAND_MUTE_DESCRIPTION'),
			usage: '<user  or  users:members> [duration:time] [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [users, duration, reason]) {
		const muteable = await this.getModeratable(msg.member, users, true);
		if (!muteable.length) return msg.responder.error('COMMAND_MUTE_NOPERMS', users.length > 1);

		const muterole = msg.guild.settings.get('mod.roles.mute') || await msg.guild.createMuteRole();

		await this.executeMutes(muteable, reason, msg.guild, msg.author, muterole, duration);
		await this.logActions(msg.guild, duration ? 'tempmute' : 'mute', muteable.map(member => member.user), { reason, moderator: msg.author, duration });

		return msg.responder.success();
	}

	async executeMutes(users, reason, guild, moderator, muterole, duration) {
		for (const member of users) {
			guild.modCache.add(member.id);
			member.mute(`${moderator.tag} | ${reason || guild.language.get('COMMAND_MUTE_NOREASON')}`, muterole);
			if (!duration) this.updateSchedule(member);
		}
		if (duration) this.client.schedule.create('endTempmute', duration, { data: { users: users.map(user => user.id), guild: guild.id } });
	}

	updateSchedule(user) {
		const unmuteTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempmute' && task.data.users.includes(user.id));
		if (!unmuteTask) return;
		const { time, data } = unmuteTask;
		this.client.schedule.delete(unmuteTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempmute', time, { data }); }
	}


};
