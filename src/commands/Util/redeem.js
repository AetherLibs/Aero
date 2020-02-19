const { Command } = require('klasa');
const { badges } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REDEEMKEY_DESCRIPTION'),
			usage: '<key:string>',
			aliases: ['redeemKey'],
			guarded: true,
			cooldown: 10
		});
	}

	async run(msg, [key]) {
		key = key.replace(/-/g, '');

		const found = this.client.settings.get('keys').find(item => item.key === key);

		if (!found) return msg.responder.error('COMMAND_REDEEMKEY_NOEXIST');

		const newKeys = this.client.settings.get('keys').filter(item => item.key !== key);
		await this.client.settings.sync();
		this.client.settings.update('keys', newKeys, { arrayAction: 'overwrite' });
		msg.author.settings.update('badges', msg.author.settings.get('badges') | (1 << found.id)); /* eslint-disable-line no-bitwise */

		return msg.responder.success('COMMAND_REDEEM_SUCCESS', badges[found.id].icon, badges[found.id].title);
	}

};
