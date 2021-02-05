/*
 * Co-Authored-By: Rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Rxsto](https://rxs.to) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

class EventStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
	}

	init() {
		const events = readdirSync(join(process.cwd(), '/src/ws/events'));
		for (const event of events) {
			const Event = require(join(process.cwd(), '/src/ws/events/', event));
			const instance = new Event(this.client);
			this.set(instance.name, instance);
		}
	}

}

module.exports = EventStore;
