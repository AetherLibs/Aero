const { Command } = require('klasa');

const { infinity } = require('../../../lib/util/constants').emojis;

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ncg'],
			bucket: 2,
			cooldown: 5,
			description: language => language.get('COMMAND_CORONAGRAPH_DESCRIPTION'),
			usage: '[country:str]'
		});
	}

	async run(msg, [country]) {
		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);

		const graph = await this.client.coronagraphs.graph(country).catch(() => null);

		if (graph)
			await msg.channel.sendFile(graph, 'plot.png');
		else
			await msg.responder.error('COMMAND_CORONAGRAPH_INVALID');

		return loading.delete();
	}

};
