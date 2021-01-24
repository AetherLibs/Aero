const LGBTImageCommand = require('~/lib/structures/LGBTImageCommand');

module.exports = class extends LGBTImageCommand {


	constructor(...args) {
		super('lesbian', ...args, { aliases: ['lesbean'] });
	}

};
