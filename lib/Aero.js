const { Client } = require('@aero/klasa');

const { KSoftClient } = require('@aero/ksoft');
const { DRepClient } = require('@aero/drep');
const { DBioClient } = require('@aero/dbio');
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

	constructor(manager, sentry) {
		super({ ...klasa, ...discord });

		this.manager = manager;
		if (sentry) {
			this.sentry = sentry;
			this.sentry.setTag('shard', this.manager.id);
			this.sentry.setTag('host', hostname());
			this.sentry.setTag('discord.js', require('discord.js/package')._from.split('#')[1]);
			this.sentry.setTag('klasa', require('klasa/package')._from.split('#')[1]);
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
	}

	login({ shardCount }) {
		this.console.log(`[Discord] Attempting to login on shard ${this.manager.id}/${shardCount}.`);
		this.options.shards = [this.manager.id];
		this.options.shardCount = shardCount;
		super.login();
	}

}

module.exports = Aero;
