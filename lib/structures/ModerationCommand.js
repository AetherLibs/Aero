const { Command } = require('klasa');

class ModerationCommand extends Command {

	comparePermissions(executor, target) {
		if (executor.guild.owner.id === executor.id) return executor.id !== target.id;
		return executor.roles.highest.position > target.roles.highest.position;
	}

	logActions(guild, action, users, options) {
		if (users.length > 1) options.users = users;
		else options.user = users[0];
		guild.log[action](options);
	}

}

module.exports = ModerationCommand;