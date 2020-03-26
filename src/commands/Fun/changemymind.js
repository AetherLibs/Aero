const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'changemymind',
			aliases: ['cmm'],
			text: true
		}, ...args);
	}

};
