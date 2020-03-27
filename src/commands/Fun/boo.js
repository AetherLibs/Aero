const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 2;
		const textValidatorResponse = 'COMMAND_BOO_VALIDATOR';
		super({
			name: 'boo',
			text: true,
			textValidator,
			textValidatorResponse
		}, ...args);
	}

};
