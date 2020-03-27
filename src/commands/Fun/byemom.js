const MemeGenerationCommand = require('../../../lib/structures/MemeGenerationCommand');

module.exports = class extends MemeGenerationCommand {

	constructor(...args) {
		super({
			name: 'byemom',
			avatarCount: 1,
			usernameCount: 1,
			text: true
		}, ...args);
	}

};
