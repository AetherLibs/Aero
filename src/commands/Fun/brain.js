const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 4;
		const textValidatorResponse = 'COMMAND_BRAIN_VALIDATOR';
		super({
			name: 'brain',
			text: true,
			textValidator,
			textValidatorResponse
		}, ...args);
	}

};
