const { Command, Timestamp } = require('klasa');
const req = require('@aero/centra');

const { infinity } = require('../../../lib/util/constants').emojis;

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_BIO_DESCRIPTION'),
			usage: '[user:username|slug:string]',
			usageDelim: ' '
		});

		this.timestamp = new Timestamp('d MMMM YYYY');
	}

	async run(msg, [user = msg.author]) {
		const bio = await this.client.dbio.details(user.id || user).catch(() => null);

		if (!bio) return msg.responder.error('COMMAND_BIO_NOBIO', user === msg.author);

		if (typeof user === 'string') user = await this.client.users.fetch(bio.id);

		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);

		const res = await req(this.client.config.colorgenURL)
			.path('profile')
			.query({
				avatarURL: user.avatarURL({ format: 'png' }),
				bannerURL: bio.bannerURL || '',
				username: user.username,
				description: bio.description || 'no description',
				birthday: bio.birthday ? this.timestamp.display(bio.birthday) : 'no birthday set',
				location: bio.location || 'no location',
				occupation: bio.occupation || 'no occupation',
				status: bio.status || 'no status',
				bioURL: `dsc.bio/${bio.slug}`,
				gender: typeof bio._gender === 'number' ? bio._gender : -1
			}).raw();

		await msg.channel.sendFile(res, 'bio.png');

		return loading.delete();
	}

};
