const prometheus = require('prom-client');
const cluster = require('cluster');

class Aggregator {

	constructor(stageShorthand, metricsEnabled) {
		this.workers = [];

		this.stageShorthand = stageShorthand;
		this.metricsEnabled = metricsEnabled;
		this.readyShards = new Set();
		this.shardCount = null;

		if (metricsEnabled) this.initPrometheus();

		cluster.on('message', (worker, msg) => {
			switch (msg?.type) {
				case 'BAN':
					this.registerGlobalBan(msg.data.provider);
					break;
				case 'COMMAND':
					this.registerCommand(msg.data.name, msg.data.guildId, msg.data.userId);
					break;
				case 'READY':
					this.readyShards.add(msg.data.shardId);
					if (!this.shardCount) this.shardCount = msg.data.shardCount;
					break;
				default:
					return;
			}
		});
	}

	login(worker) {
		this.workers.push(worker);
	}

	get ready() {
		return this.readyShards.size === this.shardCount;
	}

	async averagePing() {
		return new Promise((resolve) => {
			const workerIds = new Set(this.workers.map(worker => worker.id));

			let sum = 0;
			const count = workerIds.size;

			for (const worker of this.workers) worker.send({ type: 'PING' });

			const listener = (worker, msg) => {
				if (msg?.type !== 'PONG') return;

				sum += msg.data;

				workerIds.delete(worker.id);

				if (workerIds.size === 0) {
					cluster.off('message', listener);
					resolve(Math.round(sum / count));
				}
			};

			cluster.on('message', listener);
		});
	}

	async sumGuilds() {
		return new Promise((resolve) => {
			const workerIds = new Set(this.workers.map(worker => worker.id));

			let sum = 0;

			for (const worker of this.workers) worker.send({ type: 'GUILDS' });

			const listener = (worker, msg) => {
				if (msg?.type !== 'GUILDS') return;

				sum += msg.data;

				workerIds.delete(worker.id);

				if (workerIds.size === 0) {
					cluster.off('message', listener);
					resolve(sum);
				}
			};

			cluster.on('message', listener);
		});
	}

	async sumUsers() {
		return new Promise((resolve) => {
			const workerIds = new Set(this.workers.map(worker => worker.id));

			let sum = 0;

			for (const worker of this.workers) worker.send({ type: 'USERS' });

			const listener = (worker, msg) => {
				if (msg?.type !== 'USERS') return;

				sum += msg.data;

				workerIds.delete(worker.id);

				if (workerIds.size === 0) {
					cluster.off('message', listener);
					resolve(sum);
				}
			};

			cluster.on('message', listener);
		});
	}

	initPrometheus() {
		const register = new prometheus.Registry();
		prometheus.collectDefaultMetrics({ register });

		register.setDefaultLabels({
			app: `aero-${this.stageShorthand}`
		});

		const aggregator = this; /* eslint-disable-line consistent-this */

		const guildCount = new prometheus.Gauge({
			name: 'aero_guilds_size',
			help: 'guild count of current shard',
			async collect() {
				this.set(await aggregator.sumGuilds());
			}
		});
		const userCount = new prometheus.Gauge({
			name: 'aero_users_cache_size',
			help: 'amount of cached users',
			async collect() {
				this.set(await aggregator.sumUsers());
			}
		});
		const commandCount = new prometheus.Counter({
			name: 'aero_commands',
			help: 'commands ran',
			labelNames: ['name', 'guildId', 'userId']
		});
		const globalBanCount = new prometheus.Counter({
			name: 'aero_gbans',
			help: 'global bans enforced',
			labelNames: ['provider']
		});

		register.registerMetric(guildCount);
		register.registerMetric(userCount);
		register.registerMetric(commandCount);
		register.registerMetric(globalBanCount);

		this.prometheus = prometheus;
		this.commandCounter = commandCount;
		this.gbanCounter = globalBanCount;
		this.register = register;
	}

	registerGlobalBan(provider) {
		this.gbanCounter.inc({ provider });
	}

	registerCommand(name, guildId, userId) {
		this.commandCounter.inc({ name, guildId, userId });
	}

}

module.exports = Aggregator;
