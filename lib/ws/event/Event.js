/*
 * Co-Authored-By: Rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Rxsto](https://rxs.to) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
class Event {

	constructor(client, name) {
		this.client = client;
		this.name = name;
	}

	run() {
		throw new SyntaxError('This should be overwritten in the actual event!');
	}

}

module.exports = Event;
