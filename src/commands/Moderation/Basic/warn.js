const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');
const { VERY_NEGATIVE } = require('../../../../lib/util/constants').color;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['w'],
			description: language => language.get('COMMAND_WARN_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [members, reason = msg.language.get('COMMAND_WARN_NOREASON')]) {
		const warnable = await this.getModeratable(msg.member, members, true);
		if (!warnable.length) return msg.responder.error('COMMAND_WARN_NOPERMS', members.length > 1);

		await Promise.all(warnable.map(member => member.settings.sync()));

		for (const member of warnable) {
			member.settings.update('warnings', { reason, moderator: msg.member.id, active: true }, { arrayAction: 'add' });

			const embed = new MessageEmbed()
				.setAuthor(msg.guild.name, msg.guild.iconURL())
				.setDescription(msg.language.get('COMMAND_WARN_WARNED', reason))
				.setFooter(msg.language.get('COMMAND_WARN_MODERATOR', msg.author.tag), msg.author.avatarURL())
				.setColor(VERY_NEGATIVE);
			member.user.send(embed).catch(() => null);
		}

		msg.responder.success();
		return this.logActions(msg.guild, 'warn', members, { reason, moderator: msg.author });
	}


};
