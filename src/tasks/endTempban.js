const { Task } = require('klasa');

module.exports = class extends Task {

	async run({ users, guild }) {
		const _guild = this.client.guilds.get(guild);
		if (!_guild) return;
		users.forEach(user => {
			_guild.modCache.add(user);
			_guild.members.unban(user, _guild.language.get('COMMAND_BAN_TEMPBANRELEASED'));
		});
		users.length > 1
			? _guild.log.tempbanEnd({ users })
			: _guild.log.tempBanEnd({ user: users[0] });
	}

};