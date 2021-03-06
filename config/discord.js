/* eslint-disable no-bitwise, no-unused-vars */
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, GUILD_VOICE_STATES } = require('../lib/util/constants').intents;

module.exports = {
	allowedMentions: { parse: ['users'] },
	restTimeOffset: 0,
	retryLimit: 2,
	partials: ['REACTION', 'MESSAGE', 'CHANNEL'],
	ws: {
		intents: GUILDS | GUILD_MEMBERS | GUILD_BANS | GUILD_MESSAGES | GUILD_MESSAGE_REACTIONS | GUILD_VOICE_STATES
	}
};
