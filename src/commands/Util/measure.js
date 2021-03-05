const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const { MessageEmbed } = require('discord.js');
const BASE_URL = 'https://lighthouse-dot-webdotdevsite.appspot.com//lh/newaudit';
const { infinity, success, error, minus } = require('~/lib/util/constants').emojis;

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_MEASURE_DESCRIPTION'),
			usage: '<url:url>',
			permissionLevel: 7
		});
	}

	async run(msg, [url]) {
		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);

		const res = await req(BASE_URL)
			.method('POST')
			.body({ url, replace: true, save: false }, 'json')
			.json();

		const { lhrSlim, lhr } = res;

		const embed = new MessageEmbed()
			.setTitle(`Performance audit for ${url}`)
			.addField('Scores', lhrSlim.map(i => `${scoreToEmoji(i.score)} ${i.title}: ${Math.round(i.score * 100)}`).join('\n'))
			.addField('Metrics', lhrToMetrics(lhr).map(audit => `${scoreToEmoji(audit.score)} ${audit.title}: ${audit.displayValue}`).join('\n'));

		await msg.send({ embed });

		return loading.delete();
	}

};

function lhrToMetrics(lhr) {
	return lhr.categories.performance.auditRefs
		.filter(ref => ref.group === 'metrics')
		.map(metric => metric.id)
		.map(id => lhr.audits[id]);
}

function scoreToEmoji(score) {
	if (score >= 0.9) return success;
	if (score >= 0.5) return minus;
	return error;
}
