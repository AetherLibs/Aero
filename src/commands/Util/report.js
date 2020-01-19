const { Command } = require('klasa');
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
	}

	async run(msg, [user, reason, proof]) {
		if (!user) {
			user = await this.ask(msg, this.validateUser, this.parseUser, {
				question: msg.language.get('COMMAND_REPORT_ARG_USER_QUESTION'),
				timeout: msg.language.get('COMMAND_REPORT_ARG_USER_TIMEOUT'),
				invalid: msg.language.get('COMMAND_REPORT_ARG_USER_INVALID')
			}).catch((reason) => {
				msg.responder.error(reason, true);
				return null
			});
			if (!user) return;
		}

		if (!reason) {
			reason = await this.ask(msg, this.validateReason, this.parseReason, {
				question: msg.language.get('COMMAND_REPORT_ARG_REASON_QUESTION'),
				timeout: msg.language.get('COMMAND_REPORT_ARG_REASON_TIMEOUT'),
				invalid: msg.language.get('COMMAND_REPORT_ARG_REASON_INVALID')
			}).catch((reason) => {
				msg.responder.error(reason, true);
				return null
			});
			if (!reason) return;
		}

		if (!proof) {
			if (!this.validateProof(msg)) {
				proof = await this.ask(msg, this.validateProof, this.parseProof, {
					question: msg.language.get('COMMAND_REPORT_ARG_PROOF_QUESTION'),
					timeout: msg.language.get('COMMAND_REPORT_ARG_PROOF_TIMEOUT'),
					invalid: msg.language.get('COMMAND_REPORT_ARG_PROOF_INVALID')
				}).catch((reason) => {
					msg.responder.error(reason, true);
					return null
				});
				if (!proof) return;
			} else {
				proof = this.parseProof(msg);
			}
		} else {
			if (!this.validateProof(msg)) throw msg.language.get('COMMAND_REPORT_ARG_PROOF_INVALID');
			proof = this.parseProof(msg);
		}

		proof = await this.getImgurLink(proof);

		const ban = new Ban()
			.setUser(user.id, user.username, user.discriminator)
			.setModerator(msg.author.id)
			.setReason(reason, proof);

		const res = await this.client.ksoft.bans.add(ban);
		if (!res.success) return msg.responder.error(res.message);
		return msg.responder.success(msg.language.get('COMMAND_REPORT_SUCCESS'));
	}

	async ask(msg, validator, parser, { question, timeout, invalid }) {
		await msg.channel.send(question);
		const authorFilter = message => message.author.id === msg.author.id;
		const collector = msg.channel.createMessageCollector(authorFilter, { idle: 60 * 1000, time: 3 * 60 * 1000 });

		return new Promise((resolve, reject) => {
			collector.on('collect', async message => {
				if (await validator(message)) collector.stop('success');
				if (cancel.test(message.content)) collector.stop('cancelled');
				else msg.responder.error(invalid, true);
			});
			collector.on('end', (collected, reason) => {
				if (reason === 'success') {
					resolve(parser(collected.first()));
				} else if (reason === 'cancelled') {
					reject(msg.language.get('COMMAND_REPORT_CANCELLED'));
				} else {
					reject(timeout);
				}
			})
		})
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
		return msg.content;
	}

	validateProof(msg) {
		if (album.test(msg.content) || image.test(msg.content) || cdn.test(msg.content)) return true;
		return msg.attachments.filter(item => item.height).size > 0;
	}

	parseUser(msg) {
		return msg.mentions.users.size
			? msg.mentions.users.first()
			: this.client.users.get(msg.content);
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
				.send()
				.then(data => data.json);
			if (!res.success || !res.data[0]) throw 'Failed fetching from imgur.';
			return res.data[0].link;
		}
		const res = await req(ImgurAPI, 'POST')
			.header('Authorization', `Client-ID ${process.env.IMGUR_TOKEN}`)
			.path('/image')
			.body({ image: url })
			.send()
			.then(data => data.json);
		if (!res.success) throw 'Failed uploading to imgur.';
		return res.data.link;

	}

};
