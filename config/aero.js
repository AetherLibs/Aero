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
	supportServer: 'https://discord.gg/n6eZ3Z5',
	inviteURL: 'https://get.aero.bot',
	repoURL: 'https://git.aero.bot',
	hasteURL: 'https://haste.aero.bot',
	memegenURL: 'https://memes.aero.bot',
	colorgenURL: 'https://color.aero.bot',
	chartgenURL: 'https://charts.aero.bot',
	dailyPoints: 50
};
