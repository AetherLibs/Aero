const { GuildMemberManager } = require('discord.js');

class AeroGuildMemberManager extends GuildMemberManager {

	add(data, cache = false) {
		return super.add(data, cache);
	}

}

module.exports = AeroGuildMemberManager;
