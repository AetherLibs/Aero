class AggregatorClient {
	constructor(metricsEnabled) {
		this.client = null;
		this.metricsEnabled = metricsEnabled;

		process.on('message', (msg) => {
			switch(msg?.type) {
				case 'PING':
					process.send({ type: 'PONG', data: this.client.ws.ping });
					break;
				case 'GUILDS':
					process.send({ type: 'GUILDS', data: this.client.guilds.cache.size });
					break;
				case 'USERS':
					process.send({ type: 'USERS', data: this.client.users.cache.size });
					break;
				default:
					return;
			}
		})
	}

	registerGlobalBan(provider) {
		process.send({ type: 'BAN', data: { provider } });
	}

	registerCommand(name, guildId, userId) {
		process.send({ type: 'COMMAND', data: { name, guildId, userId } });
	}

	login(client) {
		this.client = client;
	}
}

module.exports = AggregatorClient;