require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});

const Manager = require('../lib/Manager');
const version = process.env.npm_package_gitHead || 'dev';

let sentry;

if (version !== 'dev') {
	sentry = require('@sentry/node');

	sentry.init({
		dsn: process.env.SENTRY_TOKEN,
		release: `aero@${version}`
	});
}

new Manager(sentry).init();
