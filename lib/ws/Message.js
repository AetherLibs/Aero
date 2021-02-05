/*
 * Co-Authored-By: Rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Rxsto](https://rxs.to) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
class Message {

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	toJSON() {
		return {
			t: this.type, /* eslint-disable-line id-length */
			d: this.data /* eslint-disable-line id-length */
		};
	}

}

module.exports = Message;
