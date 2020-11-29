const { Command } = require('@aero/klasa');
const { Ban } = require('@aero/ksoft');
const req = require('@aero/centra');
const { url: { ImgurAPI }, regexes: { imgur: { album, image }, discord: { cdn }, cancel } } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REPORT_DESCRIPTION'),
			usage: '[user:user] [reason:string] [proof:string]',
			usageDelim: ' ',
			quotedStringSupport: true
		});

		this.channels = new Set();
	}

	async run(msg, [user, reason, proof]) {
		if (this.channels.has(msg.channel.id)) return msg.responder.error('COMMAND_REPORT_ONGOING');
		this.channels.add(msg.channel.id);
		if (!user) {
			user = await this.ask(msg, this.validateUser.bind(this), this.parseUser.bind(this), {
				question: 'COMMAND_REPORT_ARG_USER_QUESTION',
				timeout: 'COMMAND_REPORT_ARG_USER_TIMEOUT',
				invalid: 'COMMAND_REPORT_ARG_USER_INVALID'
			}).catch((err) => {
				msg.responder.newError(err);
				this.channels.delete(msg.channel.id);
				return null;
			});
			if (!user) return false;
		}

		if (!reason) {
			reason = await this.ask(msg, this.validateReason, this.parseReason, {
				question: 'COMMAND_REPORT_ARG_REASON_QUESTION',
				timeout: 'COMMAND_REPORT_ARG_REASON_TIMEOUT',
				invalid: 'COMMAND_REPORT_ARG_REASON_INVALID'
			}).catch((err) => {
				msg.responder.newError(err);
				this.channels.delete(msg.channel.id);
				return null;
			});
			if (!reason) return false;
		}

		if (!proof) {
			if (!this.validateProof(msg)) {
				proof = await this.ask(msg, this.validateProof, this.parseProof, {
					question: 'COMMAND_REPORT_ARG_PROOF_QUESTION',
					timeout: 'COMMAND_REPORT_ARG_PROOF_TIMEOUT',
					invalid: 'COMMAND_REPORT_ARG_PROOF_INVALID'
				}).catch((err) => {
					msg.responder.newError(err);
					this.channels.delete(msg.channel.id);
					return null;
				});
				if (!proof) return false;
			} else {
				proof = this.parseProof(msg);
			}
		} else {
			if (!this.validateProof(msg)) throw msg.language.get('COMMAND_REPORT_ARG_PROOF_INVALID');
			proof = this.parseProof(msg);
		}
		try {
			proof = await this.getImgurLink(proof);
		} catch {
			this.channels.delete(msg.channel.id);
			return msg.responder.error('COMMAND_REPORT_ERRIMGUR');
		}
		const ban = new Ban()
			.setUser(user.id, user.username, user.discriminator)
			.setModerator(msg.author.id)
			.setReason(reason, proof);

		const res = await this.client.ksoft.bans.add(ban);
		this.channels.delete(msg.channel.id);
		if (!res.success) return msg.responder.error('COMMAND_REPORT_SUBMITERR', res.message);
		return msg.responder.success('COMMAND_REPORT_SUCCESS');
	}

	async ask(msg, validator, parser, { question, timeout, invalid }) {
		await msg.channel.send(msg.language.get(question));
		const authorFilter = message => message.author.id === msg.author.id;
		const collector = msg.channel.createMessageCollector(authorFilter, { idle: 60 * 1000, time: 3 * 60 * 1000 });

		return new Promise((resolve, reject) => {
			collector.on('collect', async message => {
				if (await validator(message)) collector.stop('success');
				else if (cancel.test(message.content)) collector.stop('cancelled');
				else msg.responder.newError(invalid);
			});
			collector.on('end', (collected, reason) => {
				if (reason === 'success') {
					resolve(parser(collected.first()));
				} else if (reason === 'cancelled') {
					reject('COMMAND_REPORT_CANCELLED');
				} else {
					reject(timeout);
				}
			});
		});
	}

	async validateUser(msg) {
		if (!msg.content) return false;
		if (msg.mentions.users.size > 0) return true;
		if (/^(\d{17,19})$/.test(msg.content)) {
			const user = await this.client.users.fetch(msg.content).catch(() => false);
			return !!user;
		}
		return false;
	}

	validateReason(msg) {
		return !cancel.test(msg.content);
	}

	validateProof(msg) {
		if (album.test(msg.content) || image.test(msg.content) || cdn.test(msg.content)) return true;
		return msg.attachments.filter(item => item.height).size > 0;
	}

	parseUser(msg) {
		return msg.mentions.users.size
			? msg.mentions.users.first()
			: msg.client.users.cache.get(msg.content);
	}

	parseReason(msg) {
		return msg.content;
	}

	parseProof(msg) {
		const attachments = msg.attachments.filter(item => item.height);
		return attachments.size > 0
			? attachments.first().attachment
			: msg.content;
	}

	async getImgurLink(url) {
		if (image.test(url)) return url;
		if (album.test(url)) {
			const res = await req(ImgurAPI)
				.header('Authorization', `Client-ID ${process.env.IMGUR_TOKEN}`)
				.path('album')
				.path(album.exec(url)[1])
				.path('images')
				.json();
			if (!res.success || !res.data[0]) throw 'Failed fetching from imgur.';
			return res.data[0].link;
		}
		const res = await req(ImgurAPI, 'POST')
			.header('Authorization', `Client-ID ${process.env.IMGUR_TOKEN}`)
			.path('/image')
			.body({ image: url })
			.json();
		if (!res.success) throw 'Failed uploading to imgur.';
		return res.data.link;
	}

};
