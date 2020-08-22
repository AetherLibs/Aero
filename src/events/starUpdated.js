const Event = require('../../lib/structures/StarEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg, { votes, starMessage }) {
		const stars = this.generateStars(votes.length);
		const embed = this.buildEmbed(msg, msg.guild, msg.channel.id, msg.id, stars);

		starMessage.edit({ embed });
	}

};
