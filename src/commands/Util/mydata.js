const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const { constants: { TIME } } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_MYDATA_DESCRIPTION')
		});
	}

	async run(msg) {
		if (Date.now() - msg.author.settings.get('lastDataTimestamp') < TIME.DAY * 7) {
			return msg.responder.error('COMMAND_MYDATA_COOLDOWN', `<t:${Math.ceil((msg.author.settings.get('lastDataTimestamp') + TIME.DAY * 7) / 1000)}:R>`);
		}

		const { found, data: sentinelData } = await req(this.client.config.sentinelApiURL)
			.header('Authorization', process.env.SENTINEL_TOKEN)
			.path('/admin/datapackage')
			.query({ id: msg.author.id })
			.json();

		const data = {};

		if (found) data.sentinel = sentinelData;

		const userData = await this.client.providers.default.db.collection('users').findOne({ id: msg.author.id });
		if(userData) data.user = userData;

		const memberData = await this.client.providers.default.db.collection('members').find({ id: new RegExp(`\\d+\\.${msg.author.id}`) }).toArray();
		if(memberData) data.member = memberData;

		await msg.author.send({ files: [{ attachment: Buffer.from(JSON.stringify(data, null, 2), 'utf-8'), name: 'data.json' }]}).catch(() => null);

		await msg.author.settings.update('lastDataTimestamp', new Date().getTime());

		return msg.responder.success('COMMAND_MYDATA_SUCCESS');
	}

};
