const Event = require('../../lib/structures/StarEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg, { starChannel }) {
		const stars = this.generateStars(msg.guild.settings.get('starboard.trigger'));
		const embed = this.buildEmbed(msg, msg.guild, msg.channel.id, msg.id, stars);
		const starMessage = await starChannel.send({ embed });
		await starMessage.react('⭐');

		const filter = starredMessage => starredMessage.id === msg.id && starredMessage.channel === msg.channel.id;
		const starredMessages = await msg.guild.settings.get('starboard.messages');
		const starredMessage = starredMessages.find(filter);
		starredMessage.starMessage = starMessage.id;
		const updatedArray = [...starredMessages.filter(item => !filter(item)), starredMessage];
		await msg.guild.settings.update('starboard.messages', updatedArray, { arrayAction: 'overwrite' });

		return true;
	}

};
