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

		if (!found) return msg.responder.error(msg.language.get('COMMAND_REDEEMKEY_NOEXIST'));

		const newKeys = this.client.settings.get('keys').filter(item => item.key !== key);
		this.client.settings.update('keys', newKeys, { arrayAction: 'overwrite' });
		msg.author.settings.update('badges', msg.author.settings.get('badges') | (1 << found.id));

		return msg.responder.success(`Successfully redeemed ${badges[found.id].icon} ${badges[found.id].title}`);
	}

};
