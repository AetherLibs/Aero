const { Client } = require('@aero/klasa');

const { DRepClient } = require('@aero/drep');

const { XKCDClient } = require('@aero/xkcd');
const { CoronaClient } = require('@aero/corona');
const { CoronaGraphsClient } = require('@aero/corona-graphs');
const { StatusPageClient } = require('@aero/statuspage');

const { klasa, discord, aero } = require('../config');
const { AeroStatus, DiscordStatus } = require('./util/constants').url;
const Permissions = require('./Permissions');
Client.use(require('@aero/member-gateway'));
require('./extensions');
require('./settings');

const { hostname } = require('os');

class Aero extends Client {

	constructor({ sentry, aggregator, ...sharder }) {
		super({ ...klasa, ...discord, ...sharder });
		if (sentry) {
			const deps = require('~/package-lock').dependencies;
			this.sentry = sentry;
			this.sentry.setTag('shard', this.options.shards.join(', '));
			this.sentry.setTag('host', hostname());
			this.sentry.setTag('discord.js', deps['discord.js'].version);
			this.sentry.setTag('klasa', deps['@aero/klasa'].version);
			this.console.log('[Sentry] Connected.');
		}
		this.aggregator = aggregator;

		this.permissions = new Permissions(this);
		this.config = aero;
		this.drep = new DRepClient(process.env.DREP_TOKEN);
		this.xkcd = new XKCDClient();
		this.corona = new CoronaClient();
		this.coronagraphs = new CoronaGraphsClient(this.corona, this.config.chartgenURL);
		this.dstatus = new StatusPageClient(DiscordStatus);
		this.astatus = new StatusPageClient(AeroStatus);
		this.experiments = new Map();
	}

	async login() {
		this.console.log(`[Discord] Attempting to login on shards [${this.options.shards.join(', ')}].`);
		super.login();
		this.aggregator.login(this);
	}

}

module.exports = Aero;
