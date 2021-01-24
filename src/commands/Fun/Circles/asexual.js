const LGBTImageCommand = require('~/lib/structures/LGBTImageCommand');

module.exports = class extends LGBTImageCommand {


	constructor(...args) {
		super('asexual', ...args, { aliases: ['ace'] });
	}

};
