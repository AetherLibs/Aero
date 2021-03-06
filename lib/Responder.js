const { emojis, reactions } = require('./util/constants');

class Responder {

	constructor(message) {
		this.message = message;
	}

	success(key, ...args) {
		if (!key) return this.message.react(reactions.success);
		return this.message.send(`${emojis.success} ${this.message.language.get(key, ...args)}`);
	}

	error(key, ...args) {
		if (!key) return this.message.react(reactions.error);
		return this.message.send(`${emojis.error} ${this.message.language.get(key, ...args)}`);
	}

	info(key, ...args) {
		return this.message.send(this.message.language.get(key, ...args));
	}

	newError(key, ...args) {
		return this.message.channel.send(`${emojis.error} ${this.message.language.get(key, ...args)}`);
	}

	lock() { this.message.react(reactions.lock); }

	unlock() { this.message.react(reactions.unlock); }

}

module.exports = Responder;
