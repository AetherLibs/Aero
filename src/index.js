const { join } = require('path');
require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});
require('@aero/require').config(process.cwd(), true);

// const Manager = require('../lib/Manager');
const { ShardingManager } = require('kurasuta');
const Aero = require('~/lib/Aero');

const { stage: version, ipcSocket } = require('../config/aero');

let sentry;

if (version !== 'development') {
	sentry = require('@sentry/node');

	sentry.init({
		dsn: process.env.SENTRY_TOKEN,
		release: `aero@${version}`
	});
}

// new Manager(sentry).init();
const sharder = new ShardingManager(join(__dirname, 'launch'), {
	client: Aero,
	clientOptions: {
		sentry
	},
	ipcSocket,
	token: process.env.DISCORD_TOKEN
});

sharder.on('debug', (m) => console.log(m));

sharder.spawn();
