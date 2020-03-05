const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		const textValidator = text => text.split(',').length === 2;
		const textValidatorResponse = 'COMMAND_CRAB_VALIDATOR';
		super({
			name: 'crab',
			text: true,
			textValidator,
			textValidatorResponse,
			fileType: 'mp4',
			cooldown: 30
		}, ...args);
	}

};
