// derived from klasa-pieces, (c) 2017-2019 dirigeants / MIT license.
const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');
const req = require('@aero/http');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['MANAGE_MESSAGES'],
			runIn: ['text'],
			aliases: ['p', 'purge', 'clear', 'clean'],
			description: language => language.get('COMMAND_PRUNE_DESCRIPTION'),
			usage: '[limit:integer] [link|invite|bots|you|me|upload|user:user]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async run(msg, [limit = 1, filter = null]) {
		let messages = await msg.channel.messages.fetch({ limit: 100 });
		messages = messages.filter(mes => !mes.pinned);
		if (filter) {
			const user = typeof filter !== 'string' ? filter : null;
			const type = typeof filter === 'string' ? filter : 'user';
			messages = messages.filter(this.getFilter(msg, type, user));
		}
		if (messages.has(msg.id)) limit++;

		const hastedMessages = messages
			.map(message => `--- ${message.author.tag}, ${dayjs(message.createdAt).format('Do MMM YYYY HH:mm')} ---\n${message.content}\n`)
			.slice(0, limit);

		messages = messages.keyArray().slice(0, limit);
		if (!messages.includes(msg.id)) messages.push(msg.id);
		msg.channel.bulkDelete(messages, true)
			.then(async () => {
				const message = await msg.responder.success('COMMAND_PRUNE_RESPONSE', messages.length - 1);
				message.delete({ timeout: 1500 }).catch(() => null);
			})
			.catch(err => msg.responder.error('ERROR_SHORT', err.message));

		const { key } = await req(this.client.config.hasteURL)
			.post()
			.path('documents')
			.body(hastedMessages.join('\n'))
			.json();

		const haste = `${this.client.config.hasteURL}/${key}`;

		msg.guild.log.messagesPurged({ content: haste, channel: msg.channel, moderator: msg.author });
	}

	getFilter(msg, filter, user) {
		switch (filter) {
			case 'link': return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
			case 'invite': return mes => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
			case 'bots': return mes => mes.author.bot;
			case 'you': return mes => mes.author.id === this.client.user.id;
			case 'me': return mes => mes.author.id === msg.author.id;
			case 'upload': return mes => mes.attachments.size > 0;
			case 'user': return mes => mes.author.id === user.id;
			default: return () => true;
		}
	}

};
