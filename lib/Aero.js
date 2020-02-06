const { Client } = require('klasa');
const { KSoftClient } = require('@aero/ksoft');
const { DRepClient } = require('@aero/drep');
const { ChatWatchClient } = require('@aero/chatwatch');
const { DBioClient } = require('@aero/dbio');
const { XKCDClient } = require('@aero/xkcd');

const { klasa, discord, aero } = require('../config');
const Permissions = require('./Permissions');
Client.use(require('klasa-member-gateway'));
require('./extensions');
require('./settings');

class Aero extends Client {

	constructor(manager) {
		super({ ...klasa, ...discord });
		this.manager = manager;
		this.permissions = new Permissions(this);
		this.config = aero;

		this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN);
		this.chatwatch = new ChatWatchClient(process.env.CHATWATCH_TOKEN, { logger: this.console, retryCount: Infinity });
		this.drep = new DRepClient(process.env.DREP_TOKEN);
		this.dbio = new DBioClient();
		this.xkcd = new XKCDClient();
	}

	login({ shardCount }) {
		this.console.log(`[Discord] Attempting to login on shard ${this.manager.id}/${shardCount}.`);
		this.options.shards = [this.manager.id];
		this.options.shardCount = shardCount;
		super.login();
	}

}

module.exports = Aero;
