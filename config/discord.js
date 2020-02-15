/* eslint-disable no-bitwise */
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = require('../lib/util/constants').intents;

module.exports = {
	disableEveryone: true,
	fetchAllMembers: false,
	ws: {
		intents: GUILDS | GUILD_MEMBERS | GUILD_BANS | GUILD_MESSAGES | GUILD_MESSAGE_REACTIONS
	}
};
