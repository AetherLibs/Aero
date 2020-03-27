const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'bongocat',
			aliases: ['bongo'],
			avatarCount: 1
		}, ...args);
	}

};
