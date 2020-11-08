const { Structures } = require('discord.js');
const { sleep } = require('@aero/klasa').util;
const Connect4 = require('../games/Connect4');
const connect4s = new Map();

Structures.extend('TextChannel', Channel => {
	class AeroChannel extends Channel {

		get connect4() {
			return connect4s.has(this.id) ? connect4s.get(this.id) : connect4s.set(this.id, new Connect4(this)).get(this.id);
		}

		async initMute(id) {
			if (!this.guild || !this.guild.roles.cache.has(id) || !this.manageable) return;
			await sleep(2000);
			this.updateOverwrite(id, {
				SEND_MESSAGES: false,
				ATTACH_FILES: false,
				ADD_REACTIONS: false
			}, this.guild.language.get('COMMAND_MUTE_ROLE_REASON'));
		}

	}

	return AeroChannel;
});
