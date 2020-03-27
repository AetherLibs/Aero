const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 2;
		const textValidatorResponse = 'COMMAND_BALLOON_VALIDATOR';
		super({
			name: 'balloon',
			text: true,
			textValidator,
			textValidatorResponse
		}, ...args);
	}

};
