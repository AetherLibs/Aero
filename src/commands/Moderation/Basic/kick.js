const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['KICK_MEMBERS'],
			aliases: ['k', 'boot', '409'],
			description: language => language.get('COMMAND_KICK_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.KICK_MEMBERS;
	}

	async run(msg, [users, reason]) {
		const kickable = await this.getModeratable(msg.member, users, true);
		if (!kickable.length) return msg.responder.error('COMMAND_KICK_NOPERMS', users.length > 1);

		await this.executeKicks(kickable, reason, msg.guild, msg.author);
		await this.logActions(msg.guild, 'kick', kickable.map(member => member.user), { reason, moderator: msg.author, msg });

		return msg.responder.success();
	}

	async executeKicks(users, reason, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			user.kick(`${moderator.tag} | ${reason || guild.language.get('COMMAND_KICK_NOREASON')}`);
		}
	}


};
