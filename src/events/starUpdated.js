const Event = require('../../lib/structures/StarEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg, { votes, starMessage }) {
		const stars = this.generateReacts(votes.length);
		const embed = this.buildEmbed(msg, msg.guild, msg.channel.id, msg.id, stars);

		if (!starMessage || !starMessage.edit) return;

		starMessage.edit({ embed });
	}

};
