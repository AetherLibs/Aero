const { Permissions: { FLAGS } } = require('discord.js');
const { Command } = require('klasa');
const { error, success } = require('../../../lib/util/constants').emojis;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['perms', 'permissions'],
			runIn: ['text'],
			usage: '[allow|deny|show|remove|clear] [member:member|roleid:role|rolename:rolename|everyone] [permission:string]',
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
			return message.send(this.buildOverview(tree));
		}

		if (['allow', 'deny', 'remove'].includes(action) && (!target || !permission)) throw message.language.get('COMMAND_PERMS_MISSING');
		await this.client.permissions.handle({
			action,
			message,
			permission,
			target
		});
		return message.responder.success(message.language.get(`COMMAND_PERMS_SUCCESS_${action.toUpperCase()}`, permission, target));
	}

	buildOverview(tree) {
		const out = [];
		for (const category in tree) {
			if (category === 'admin') continue;
			out.push(`${typeof tree[category]['*'] === 'boolean'
				? tree[category]['*']
					? success
					: error
				: success
				} ${category}`);
			let i = 0;
			const keys = Object.keys(tree[category]).length;
			for (const key in tree[category]) {
				i++;
				if (tree[category]['*'] === tree[category][key]) continue;
				out.push(`  ${i === keys ? '└──' : '├──'}${tree[category][key]
					? success
					: error
					} ${key}`);
			}
		}
		return out.join('\n');
	}

};
