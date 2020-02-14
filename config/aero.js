const { hostname } = require('os');
const { version } = require('../package');
const stage = process.env.NODE_ENV === 'production'
	? hostname().includes('staging')
		? 'staging'
		: 'production'
	: 'development';

module.exports = {
	prefix: {
		production: 'a.',
		staging: 's.',
		development: 'd.'
	}[stage],
	stage,
	version,
	inviteURL: 'https://get.aero.bot',
	supportServer: 'https://discord.gg/n6eZ3Z5',
	repoURL: 'https://git.aero.bot/aero',
	hasteURL: 'https://haste.aero.bot',
	memegenURL: 'https://memes.aero.bot/api',
	colorgenURL: 'https://color.aero.bot',
	dailyPoints: 50
};
