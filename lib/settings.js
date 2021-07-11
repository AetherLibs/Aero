const { Client } = require('@aero/klasa');
const { NONE } = require('./util/constants').punishments;

Client.defaultGuildSchema
	.add('tags', 'any', { array: true, configurable: false })
	.add('regexTags', 'any', { array: true, default: [], configurable: false })
	.add('social', folder => folder
		.add('enabled', 'Boolean', { default: false })
		.add('levelupMessages', 'Boolean', { default: true })
	)
	.add('welcome', folder => folder
		.add('channel', 'TextChannel')
		.add('message', 'String')
	)
	.add('logs', folder => folder
		.add('moderation', subfolder => subfolder
			.add('channel', 'TextChannel')
			.add('webhook', 'String')
		)
		.add('messages', subfolder => subfolder
			.add('channel', 'TextChannel')
			.add('webhook', 'String')
		)
		.add('members', subfolder => subfolder
			.add('channel', 'TextChannel')
			.add('webhook', 'String')
		)
	)
	.add('mod', folder => folder
		.add('roles', subfolder => subfolder
			.add('mute', 'Role')
			.add('auto', 'Role', { array: true })
			.add('reactionRoles', 'any', { array: true, default: [] })
			.add('bots', 'Role')
		)
		.add('anti', subfolder => subfolder
			.add('duplicates', 'Boolean')
			.add('invites', 'Boolean')
			.add('gifts', 'Boolean')
			.add('copypastas', 'Boolean')
			.add('hoisting', 'Boolean')
			.add('unmentionable', 'Boolean')
			.add('toxicity', 'Boolean')
			.add('scams', 'Boolean')
			.add('crossposting', 'Boolean')
			.add('massmention', 'Boolean')
		)
		.add('mentionThreshold', 'Integer', { default: 5 })
		.add('punishments', subfolder => subfolder
			.add('duplicates', 'Integer', { default: NONE })
			.add('invites', 'Integer', { default: NONE })
			.add('copypastas', 'Integer', { default: NONE })
			.add('toxicity', 'Integer', { default: NONE })
		)
		.add('ignored', subfolder => subfolder
			.add('users', 'User', { array: true })
			.add('roles', 'Role', { array: true })
			.add('channels', 'TextChannel', { array: true })
		)
		.add('strikes', subfolder => subfolder
			.add('punishments', subsubfolder => subsubfolder
				.add('thresholds', subsubsubfolder => subsubsubfolder
					.add('mute', 'Integer', { default: -1 })
					.add('ban', 'Integer', { default: -1 })
					.add('tempmute', 'Integer', { default: -1 })
					.add('tempban', 'Integer', { default: -1 })
				)
				.add('durations', subsubsubfolder => subsubsubfolder
					.add('mute', 'Integer', { default: -1 })
					.add('ban', 'Integer', { default: -1 })
				)
			)
		)
	)
	.add('raid', folder => folder
		.add('channel', 'TextChannel'))
	.add('stats', folder => folder
		.add('messages', 'Integer', { default: 0 })
		.add('toxicity', 'Float', { default: 0 })
	)
	.add('starboard', folder => folder
		.add('channel', 'TextChannel')
		.add('messages', 'any', { array: true, default: [] })
		.add('trigger', 'Integer', { default: 3 })
		.add('blacklist', 'String', { array: true, default: [] })
	)
	.add('autopublish', 'NewsChannel', { array: true, default: [] })
	.add('autocarbon', 'Boolean', { default: false });

Client.defaultMemberSchema
	.add('points', 'Integer', { default: 0 })
	.add('balance', 'Integer', { default: 0 })
	.add('lastDailyTimestamp', 'Integer', { default: 0 })
	.add('level', 'Integer', { default: 1 })
	.add('warnings', 'any', { array: true, default: [] })
	.add('notes', 'any', { array: true, default: [] })
	.add('persistRoles', 'String', { array: true, default: [] })
	.add('persistNick', 'String')
	.add('stats', folder => folder
		.add('messages', 'Integer', { default: 0 })
		.add('toxicity', 'Float', { default: 0 })
	);

Client.defaultUserSchema
	.add('stats', folder => folder
		.add('messages', 'Integer', { default: 0 })
		.add('toxicity', 'Float', { default: 0 })
		.add('reputation', subfolder => subfolder
			.add('total', 'Integer', { default: 0 })
			.add('individual', 'User', { array: true, default: [] })
		)
	)
	.add('lastReputationTimestamp', 'Integer', { default: 0 })
	.add('badges', 'Integer', { default: 0 });

Client.defaultClientSchema
	.add('keys', 'any', { default: [], array: true });
