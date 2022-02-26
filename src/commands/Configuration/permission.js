const { Permissions: { FLAGS } } = require('discord.js');
const { Command } = require('@aero/klasa');
const { granted, denied, unspecified } = require('../../../lib/util/constants').emojis.perms;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['perms', 'permissions'],
			runIn: ['text'],
			usage: '[allow|deny|show|clear] [everyone|member:membername|roleid:role|rolename:rolename] [permission:string]',
			usageDelim: ' ',
			description: language => language.get('COMMAND_PERMS_DESCRIPTION')
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async run(message, [action, target, permission]) {
		if (!action) return message.send(message.language.get('COMMAND_PERMS_HELP', message.guild.settings.get('prefix')));

		if (action === 'show') {
			if (!target) target = message.member;
			const tree = await this.client.permissions.handle({ action, message, target });
			return message.send(this.buildOverview(tree, target, message.language));
		}

		if (['allow', 'deny'].includes(action) && (!target || !permission)) throw message.language.get('COMMAND_PERMS_MISSING');

		if (action === 'clear') {
			if (target && permission) action = 'remove';
			else if (target) action = 'clear';
			else action = 'reset';
		}
		await this.client.permissions.handle({
			action,
			message,
			permission,
			target
		});
		return message.responder.success(`COMMAND_PERMS_SUCCESS_${action.toUpperCase()}`, permission, target?.name || target?.displayName || target);
	}

	buildOverview(tree, target, lang) {
		const out = [];
		const name = target === 'everyone'
			? 'everyone'
			: target.name || target.displayName;

		out.push(lang.get('COMMAND_PERMS_SHOW', name));
		out.push('');

		if (typeof tree['*']?.value === 'boolean')
			out.push(`${tree['*'].value ? granted : denied} all commands (*) ${tree['*'].cause}`);
		else {
			for (const category in tree) {
				if (category === 'admin') continue;
				out.push(this.buildField(tree[category]['*'], category));
				let i = 0;
				const keys = Object.keys(tree[category]).length;
				for (const key in tree[category]) {
					i++;
					if (tree[category]['*']?.value === tree[category][key]?.value) continue;
					out.push(`  ${i === keys ? '└──' : '├──'}${this.buildField(tree[category][key], key)}`);
				}
			}
		}
		return out.join('\n');
	}

	buildField(entry, key) {
		if (typeof entry?.value === 'boolean')
			return `${entry.value ? granted : denied} **${key}** (${entry.value ? 'granted' : 'denied'} by ${entry.cause})`;
		else
			return `${unspecified} ${key}`;
	}

};
