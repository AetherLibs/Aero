const { Client } = require('@aero/klasa');

const { KSoftClient } = require('@aero/ksoft');
const { DRepClient } = require('@aero/drep');
const { DBioClient } = require('@aero/dbio');
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

const { hostname } = require('os');

class Aero extends Client {

	constructor({ sentry }, manager) {
		super({ ...klasa, ...discord });

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
		this.dbio = new DBioClient();
		this.xkcd = new XKCDClient();
		this.corona = new CoronaClient();
		this.coronagraphs = new CoronaGraphsClient(this.corona, this.config.chartgenURL);
		this.dstatus = new StatusPageClient(DiscordStatus);
		this.astatus = new StatusPageClient(AeroStatus);
		this.riverside = new RiversideClient(process.env.RIVERSIDE_TOKEN);
	}

	login() {
		this.console.log(`[Discord] Attempting to login on shards [${this.options.shards.join(', ')}].`);
		super.login();
	}

}

module.exports = Aero;
