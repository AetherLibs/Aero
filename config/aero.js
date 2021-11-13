const { hostname } = require('os');
const { version } = require('../package');
const stage = process.env.AERO_ENV;
const [commitHash, ...commitMessage] = require('child_process').execSync('git log -1 --date-order --format=format:"%h - %s"').toString().split(' - ');

module.exports = {
	prefix: {
		production: 'a.',
		staging: 's.',
		development: 'd.'
	}[stage],
	ipcSocket: {
		production: 9991,
		staging: 9992,
		development: 9999
	}[stage],
	stage,
	commitHash,
	commitMessage: commitMessage.join(' - '),
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
	carbonURL: 'https://carbonara.aero.bot',
	shortURL: 'https://ddlc.me',
	lgbtURL: 'https://api.ravy.lgbt',
	dailyPoints: 50,
	ownerAccess: ['234390727113703424'],
	roleBulkThreshold: 3
};

module.exports.cwEnabled = !['true', true].includes(process.env.CHATWATCH_DISABLED);
