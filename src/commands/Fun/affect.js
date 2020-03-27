const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'affect',
			avatarCount: 1
		}, ...args);
	}

};
