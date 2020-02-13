require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});
const sentry = require('@sentry/node');

sentry.init({
	dsn: process.env.SENTRY_TOKEN,
	release: `aero@${process.env.npm_package_gitHead || 'dev'}`
});

const Manager = require('../lib/Manager');

new Manager(sentry).init();
