const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'gay',
			avatarCount: 1
		}, ...args);
	}

};
