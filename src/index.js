require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});
const Sentry = require('@sentry/node');

Sentry.init({
	dsn: process.env.SENTRY_TOKEN,
	release: `aero@${process.env.npm_package_gitHead}`
});
const Manager = require('../lib/Manager');

new Manager().init();
