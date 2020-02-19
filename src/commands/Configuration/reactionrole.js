/*
 * Author: William Johnstone <william@endevrr.com>
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com). (c) [The Aero Team](https://aero.bot) 2020
 */
const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text', 'news'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['rero', 'reactionroles'],
			quotedStringSupport: true,
			description: language => language.get('COMMAND_REACTIONROLE_DESCRIPTION'),
			usage: '<add|remove> [channel:channel] <messageid:string{17,18}> <emote:emoji> [role:rolename]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [action, channel = msg.channel, messageID, emote, role]) {
		const reactionRole = {
			messageID,
			emoteID: emote.id,
			roleID: role && role.id
		};
		const filter = (item) => item.messageID === reactionRole.messageID
			&& item.emoteID === reactionRole.emoteID;

		const reactionRoles = msg.guild.settings.get('mod.roles.reactionRoles');

		await msg.guild.settings.sync();

		if (action === 'add') {
			if (!role) return msg.responder.error('COMMAND_REACTIONROLE_ROLE_UNSPECIFIED');
			await channel.messages.fetch(messageID).then(message => {
				const equalReactionRoles = reactionRoles.filter(item => filter(item));

				if (equalReactionRoles.length > 0) return msg.responder.error('COMMAND_REACTIONROLE_ROLE_EXIST');
				msg.guild.settings.update('mod.roles.reactionRoles', reactionRole, { arrayAction: 'add' });
				message.react(emote.id);
				return msg.responder.success('COMMAND_REACTIONROLE_ROLE_ADDED');
			}).catch(() => msg.responder.error('COMMAND_REACTIONROLE_NOMSG', messageID));
		} else if (action === 'remove') {
			const newReactionRoles = reactionRoles.filter(item => !filter(item));
			msg.guild.settings.update('mod.roles.reactionRoles', newReactionRoles, { arrayAction: 'overwrite' });
			msg.responder.success('COMMAND_REACTIONROLE_ROLE_REMOVED');
		}

		return true;
	}

};
