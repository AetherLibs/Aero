const { Inhibitor } = require('@aero/klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (command.deprecated) throw message.language.get('INHIBITOR_DEPRECATED', command.deprecated);
	}

};
