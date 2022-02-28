const { Command } = require('@aero/klasa');
const { constants: { TIME } } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PURGEDATA_DESCRIPTION')
		});

		this.userFieldsToKeep = new Set(['_id', 'id', 'lastReputationTimestamp', 'lastDataTimestamp', 'lastDataPurgeTimestamp']);
		this.memberFieldsToKeep = new Set(['_id', 'id', 'lastDailyTimestamp', 'warnings', 'notes', 'persistRoles', 'persistNick']);
	}

	async run(msg) {
		if (Date.now() - msg.author.settings.get('lastDataPurgeTimestamp') < TIME.DAY * 7)
			return msg.responder.error('COMMAND_PURGEDATA_COOLDOWN', `<t:${Math.ceil((msg.author.settings.get('lastDataPurgeTimestamp') + TIME.DAY * 7) / 1000)}:R>`);


		// purge user Data
		const userData = await this.client.providers.default.db.collection('users').findOne({ id: msg.author.id });
		let unset = {};
		let fields = 0;
		for (const key in userData) {
			if (this.userFieldsToKeep.has(key)) continue;
			unset[key] = 1;
			fields++;
		}
		if (fields) await this.client.providers.default.db.collection('users').updateOne({ id: msg.author.id }, { $unset: unset });

		// purge member Data
		const memberData = await this.client.providers.default.db.collection('members').find({ id: new RegExp(`\\d+\\.${msg.author.id}`) }).toArray();
		const promises = [];
		for (const data of memberData) {
			fields = 0;
			unset = {};
			for (const key in data) {
				if (this.memberFieldsToKeep.has(key)) continue;
				unset[key] = 1;
				fields++;
			}
			if (fields) promises.push(this.client.providers.default.db.collection('members').updateOne({ id: data.id }, { $unset: unset }));
		}

		await Promise.all(promises);

		await msg.author.settings.update('lastDataPurgeTimestamp', new Date().getTime());

		return msg.responder.success('COMMAND_PURGEDATA_SUCCESS');
	}

};
