/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Argument, util: { regExpEsc } } = require('@aero/klasa');
const { GuildMember, User } = require('discord.js');

const USER_REGEXP = Argument.regex.userOrMember;

function resolveMember(query, guild) {
	if (query instanceof GuildMember) return query;
	if (query instanceof User) return guild.members.fetch(query.id);
	if (typeof query === 'string') {
		if (USER_REGEXP.test(query)) return guild.members.fetch(USER_REGEXP.exec(query)[1]).catch(() => null);
		if (/\w{1,32}#\d{4}/.test(query)) {
			const res = guild.members.cache.find(member => member.user.tag.toLowerCase() === query.toLowerCase());
			return res || null;
		}
	}
	return null;
}


module.exports = class extends Argument {

	async run(arg, possible, msg) {
		if (!arg) throw 'No member provided.';
		if (!msg.guild) throw 'This command can only be used inside a guild.';
		const resUser = await resolveMember(arg, msg.guild);
		if (resUser) return resUser;

		const results = [];
		const reg = new RegExp(regExpEsc(arg), 'i');
		for (const member of msg.guild.members.cache.values())
			if (reg.test(member.user.username)) results.push(member);


		let querySearch;
		if (results.length > 0) {
			const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
			const filtered = results.filter(member => regWord.test(member.user.username));
			querySearch = filtered.length > 0 ? filtered : results;
		} else
			querySearch = results;


		if (querySearch.length) return querySearch[0];
		throw `\`${possible.name}\` must be a valid name, id or user mention`;
	}

};
