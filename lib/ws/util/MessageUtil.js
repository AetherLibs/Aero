/*
 * Co-Authored-By: Rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Rxsto](https://rxs.to) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */ 
const Message = require('../Message');

class MessageUtil {

	static encode(message) {
		return JSON.stringify(message);
	}

	static decode(message) {
		const parsed = JSON.parse(message);
		return new Message(parsed.t, parsed.d);
	}

}

module.exports = MessageUtil;
