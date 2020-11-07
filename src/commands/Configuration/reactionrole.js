/*
 * Co-Authored-By: William Johnstone <william@endevrr.com>
 * Co-Authored-By: Ravy <ravy@aero.bot>
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2020
 */
const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');
const GuildReactionCollector = require('../../../lib/extensions/GuildReactionCollector');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text', 'news'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['rero'],
			quotedStringSupport: true,
			description: language => language.get('COMMAND_REACTIONROLE_DESCRIPTION'),
			usage: '<add|remove> [messageid:string{17,18}] <role:rolename>',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [action, messageID, role]) {
		if (messageID && !role && action === 'add') role = msg.guild.roles.get(messageID);

		const reactionRole = {
			messageID,
			roleID: role && role.id
		};
		const filter = (item) => item.messageID === reactionRole.messageID
			&& item.roleID === reactionRole.roleID;

		const reactionRoles = msg.guild.settings.get('mod.roles.reactionRoles');

		await msg.guild.settings.sync();

		if (action === 'add') {
			const { emoji, message: partialMessage } = await this.queryEmoji(msg);
			const message = await this.client.channels.get(partialMessage.channel.id).messages.fetch(partialMessage.id);
			reactionRole.messageID = message.id;

			const equalReactionRoles = reactionRoles.filter(item => filter(item));
			if (equalReactionRoles.length > 0) return msg.responder.error('COMMAND_REACTIONROLE_ROLE_EXIST');

			return message.react(`${emoji.name}${emoji.id ? `:${emoji.id}` : ''}`)
				.then(() => {
					reactionRole.emoji = emoji.id ? emoji.id : emoji.name;
					msg.guild.settings.update('mod.roles.reactionRoles', reactionRole, { arrayAction: 'add' });
					msg.responder.success('COMMAND_REACTIONROLE_ROLE_ADDED');
				})
				.catch(() => {
					throw 'COMMAND_REACTIONROLE_INVALID_EMOJI';
				});
		} else if (action === 'remove') {
			if (!messageID) throw 'COMMAND_REACTIONROLE_MESSAGE_UNSPECIFIED';
			const newReactionRoles = reactionRoles.filter(item => !filter(item));
			msg.guild.settings.update('mod.roles.reactionRoles', newReactionRoles, { arrayAction: 'overwrite' });
			msg.responder.success('COMMAND_REACTIONROLE_ROLE_REMOVED');
		}

		return true;
	}

	async queryEmoji(msg) {
		await msg.send(msg.language.get('COMMAND_REACTIONROLE_QUERY_EMOJI'));
		return new Promise((resolve, reject) => {
			const filter = (_, user) => user.id === msg.author.id;

			const collector = new GuildReactionCollector(msg, filter, { time: 30000, max: 1 });
			collector.on('end', collected => {
				if (collected.size > 0) {
					resolve(collected.first());
				} else {
					reject('COMMAND_REACTIONROLE_NOEMOJI');
				}
			});
		});
	}

};
