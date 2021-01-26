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
	supportServer: 'https://discord.gg/7yfaYjeN6B',
	inviteURL: 'https://get.aero.bot',
	repoURL: 'https://git.aero.bot',
	hasteURL: 'https://haste.aero.bot',
	memegenURL: 'https://memes.aero.bot',
	colorgenURL: 'https://color.aero.bot',
	chartgenURL: 'https://charts.aero.bot',
	pingURL: 'https://ping.aero.bot',
	langURL: 'https://language.aero.bot',
	shortURL: 'https://ddlc.me',
	lgbtURL: 'https://api.ravy.lgbt',
	dailyPoints: 50
};

module.exports.cwEnabled = !['true', true].includes(process.env.CHATWATCH_DISABLED);
