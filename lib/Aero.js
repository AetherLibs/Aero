const { Client } = require('@aero/klasa');

const { KSoftClient } = require('@aero/ksoft');
const { DRepClient } = require('@aero/drep');

const { XKCDClient } = require('@aero/xkcd');
const { CoronaClient } = require('@aero/corona');
const { CoronaGraphsClient } = require('@aero/corona-graphs');
const { StatusPageClient } = require('@aero/statuspage');
const { RiversideClient } = require('@aero/riverside');

const { klasa, discord, aero } = require('../config');
const { AeroStatus, DiscordStatus } = require('./util/constants').url;
const Permissions = require('./Permissions');
Client.use(require('@aero/member-gateway'));
require('./extensions');
require('./settings');

const prometheus = require('prom-client');
const ngrok = require('ngrok');
const express = require('express');
const app = express();

const { hostname } = require('os');

class Aero extends Client {

	constructor({ sentry, ...sharder }, manager) {
		super({ ...klasa, ...discord, ...sharder });

		if (process.env.BOOT_SINGLE === 'false') this.manager = manager;
		if (sentry) {
			const deps = require('~/package-lock').dependencies;
			this.sentry = sentry;
			this.sentry.setTag('shard', this.options.shards.join(', '));
			this.sentry.setTag('host', hostname());
			this.sentry.setTag('discord.js', deps['discord.js'].version);
			this.sentry.setTag('klasa', deps['@aero/klasa'].version);
			this.console.log('[Sentry] Connected.');
		}

		this.permissions = new Permissions(this);
		this.config = aero;

		this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN);
		if (this.config.cwEnabled) {
			const { ChatWatchClient } = require('@aero/chatwatch');
			this.chatwatch = new ChatWatchClient(process.env.CHATWATCH_TOKEN, { logger: this.console, retryCount: 5 });
		}
		this.drep = new DRepClient(process.env.DREP_TOKEN);
		this.xkcd = new XKCDClient();
		this.corona = new CoronaClient();
		this.coronagraphs = new CoronaGraphsClient(this.corona, this.config.chartgenURL);
		this.dstatus = new StatusPageClient(DiscordStatus);
		this.astatus = new StatusPageClient(AeroStatus);
		this.riverside = new RiversideClient(process.env.RIVERSIDE_TOKEN);
		this.experiments = new Map();
	}

	async login() {
		this.console.log(`[Discord] Attempting to login on shards [${this.options.shards.join(', ')}].`);
		super.login();

		this.console.log(`[express] ${process.env.REMOTE_TOKEN ? 'Using' : 'Not using'} token authentication`);
		app.use('/', (req, res, next) => {
			if (!process.env.REMOTE_TOKEN) return next();

			const header = req.get('Authorization');

			if (!header) return res.status(401).json({
				error: 'token_missing',
			});

			const [type, token] = header.split(' ').map(str => str?.toLowerCase());

			if (type !== 'bearer') return res.status(401).json({
				error: 'token_invalid_type',
			});

			if (token !== process.env.REMOTE_TOKEN) return res.status(401).json({
				error: 'token_invalid',
			});

			return next();
		});

		app.get('/', (req, res) => {
			return res.status(200).json({ ping: this.ws.ping })
		});

		if (this.config.metricsEnabled) {
			const client = this;
			const register = new prometheus.Registry();
			prometheus.collectDefaultMetrics({register});

			register.setDefaultLabels({
				app: `aero-${aero.stage}`,
				shard: client.shard.id
			})

			const guildCount = new prometheus.Gauge({
				name: 'aero_guilds_size',
				help: 'guild count of current shard',
				collect() {
					this.set(client.guilds.cache.size);
				},
				labelNames: ['app', 'shard']
			});
			const userCount = new prometheus.Gauge({
				name: 'aero_users_cache_size',
				help: 'amount of cached users',
				collect() {
					this.set(client.users.cache.size);
				},
				labelNames: ['app', 'shard']
			});
			const commandCount = new prometheus.Counter({
				name: 'aero_commands',
				help: 'commands ran',
				labelNames: ['app', 'shard', 'name', 'guildId', 'userId']
			});
			const globalBanCount = new prometheus.Counter({
				name: 'aero_gbans',
				help: 'global bans enforced',
				labelNames: ['app', 'shard', 'provider']
			});

			register.registerMetric(guildCount);
			register.registerMetric(userCount);
			register.registerMetric(commandCount);
			register.registerMetric(globalBanCount);

			this.prometheus = prometheus;
			this.commandCounter = commandCount;
			this.gbanCounter = globalBanCount;

			app.get('/metrics', async (req, res) => {
				try {
					res.set('Content-Type', register.contentType);
					res.end(await register.metrics());
				} catch (ex) {
					res.status(500).end(ex);
				}
			});
			this.console.log('[express] Registered metrics endpoint');
		}

		app.listen(this.config.accessPort);
		this.console.log(`[express] Listening on :${this.config.accessPort}`);

		const opts = {};
		if (process.env.NGROK_TOKEN) {
			opts.authtoken = process.env.NGROK_TOKEN;
			opts.region = this.config.ngrokRegion;
			opts.addr = this.config.accessPort;
			opts.subdomain = `${this.config.ngrokPrefix}-${this.config.stageShorthand}`;
		}
		const url = await ngrok.connect(opts);
		this.console.log(`[ngrok] proxying :${this.config.accessPort} <- ${url}`);
	}

}

module.exports = Aero;
