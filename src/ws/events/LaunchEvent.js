/*
 * Co-Authored-By: Rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Rxsto](https://rxs.to) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const Event = require('../../../lib/ws/event/Event');
const { LAUNCH_CLIENT } = require('../../../lib/ws/util/constants').types;

class LaunchEvent extends Event {

	constructor(client) {
		super(client, LAUNCH_CLIENT);
	}

	run(data) {
		this.client.client.console.log('[Aether] Received launch event.');
		this.client.launch(data);
	}

}

module.exports = LaunchEvent;
