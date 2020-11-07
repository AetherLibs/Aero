const { Task } = require('@aero/klasa');

module.exports = class extends Task {

	async run({ users, guild }) {
		const _guild = this.client.guilds.cache.get(guild);
		if (!_guild) return false;
		users.forEach(user => {
			_guild.modCache.add(user);
			_guild.members.unban(user, _guild.language.get('COMMAND_BAN_TEMPBANRELEASED'));
		});
		return users.length > 1
			? _guild.log.tempbanEnd({ users })
			: _guild.log.tempbanEnd({ user: users[0] });
	}

};
