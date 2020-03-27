const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'armor',
			text: true
		}, ...args);
	}

};
