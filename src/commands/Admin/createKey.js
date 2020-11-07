const { Command } = require('@aero/klasa');
const { randomBytes } = require('crypto');
const { base32 } = require('../../../lib/util/util');
const { badges } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_CREATEKEY_DESCRIPTION'),
			usage: '<badgeID:integer>',
			aliases: ['crk'],
			guarded: true
		});
	}

	async run(msg, [id]) {
		const out = [];
		for (let i = 0; i < 3; i++) {
			const str = base32(randomBytes(3).readUIntLE(0, 3));
			out.push(str);
		}
		await msg.author.send(`Key for ${badges[id].icon} ${badges[id].title}: \`${out.join('-')}\``);
		await this.client.settings.sync();
		await this.client.settings.update('keys', { id, key: out.join('') });
		return msg.responder.success();
	}

};
