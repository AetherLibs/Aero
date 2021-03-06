/*
 * Co-Authored-By: Klasa Community Plugins (https://github.com/KlasaCommunityPlugins)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 KlasaCommunityPlugins, MIT License
 */
const { Command, util } = require('@aero/klasa');
const { trimString } = require('../../../lib/util/util');
const { Util: djsUtil, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TAGREGEX_DESCRIPTION'),
			runIn: ['text'],
			subcommands: true,
			usage: '<add|remove|view|list:default> [tag:string] [content:string] [...]',
			usageDelim: ' ',
			permissionLevel: 10,
			aliases: ['rt', 'rtag', 'rtag']
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async add(msg, [tag, ...content]) {
		if (!tag || !content.length) throw msg.language.get('COMMAND_TAG_EMPTY');
		if (msg.guild.settings.get('regexTags').find(tuple => tuple[0].toString().toLowerCase() === tag.toLowerCase())) throw msg.language.get('COMMAND_TAG_EXISTS');
		content = content.join(this.usageDelim);
		try {
			tag = new RegExp(tag, 'i');
		} catch (err) {
			throw msg.language.get('COMMAND_TAGREGEX_BADREGEX', err.message);
		}
		await msg.guild.settings.sync();
		await msg.guild.settings.update('regexTags', [...msg.guild.settings.get('regexTags'), [tag, content]], { arrayAction: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_ADDED', tag, djsUtil.escapeMarkdown(content)));
	}

	async remove(msg, [tag]) {
		const tags = msg.guild.settings.get('regexTags');
		const filtered = tags.filter(([name]) => name.toString().toLowerCase() !== tag.toLowerCase());
		if (tags.length === filtered.length) throw msg.language.get('COMMAND_TAG_NOEXIST', tag);
		await msg.guild.settings.sync();
		await msg.guild.settings.update('regexTags', filtered, { arrayAction: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_REMOVED', tag));
	}

	view(msg, [tag]) {
		if (!tag) throw msg.language.get('COMMAND_TAG_UNSPECIFIED');
		const emote = msg.guild.settings.get('regexTags').find(([name]) => name === tag.toLowerCase());
		if (!emote) throw msg.language.get('COMMAND_TAG_NOEXIST', tag);
		return msg.send(util.codeBlock('', emote[1]));
	}

	list(msg) {
		if (!msg.guild.settings.get('regexTags').length) throw msg.language.get('COMMAND_TAGREGEX_NOTAGS', msg.guild.settings.get('prefix'));
		const tags = msg.guild.settings.get('regexTags');
		const output = [msg.language.get('COMMAND_TAG_LIST', msg.guild.name, tags.length), '```asciidoc'];
		for (const [index, [tag, value]] of tags.entries())
			output.push(`${index + 1}. ${tag} :: ${trimString(value, 30)}`);

		output.push('```');
		return msg.send(output.join('\n'));
	}

};
