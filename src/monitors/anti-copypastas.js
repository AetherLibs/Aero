const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');

const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
		this.copypastas = this.readCopypastas();
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.copypastas') || msg.exempt) return;
		for (const copypasta of this.copypastas) {
			if (msg.content.includes(copypasta)) msg.delete();
		}
	}

	readCopypastas() {
		const copypastas = [];
		const dir = join(process.cwd(), 'config', 'copypastas');
		const names = readdirSync(dir);
		for (const name of names) {
			copypastas.push(readFileSync(join(dir, name)).toString().replace(/\r/g, ''));
		}
		this.client.console.log(`[AntiSpam] Loaded ${copypastas.length} copypastas.`);
		return copypastas;
	}

};
