const Event = require('../../lib/structures/LemonEvent');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg, { lemonChannel }) {
		const lemons = this.generateReacts(msg.guild.settings.get('lemonboard.trigger'));
		const embed = this.buildEmbed(msg, msg.guild, msg.channel.id, msg.id, lemons);
		const lemonMessage = await lemonChannel.send({ embed });
		await lemonMessage.react('🍋');

		const filter = lemonedMessage => lemonedMessage.id === msg.id && lemonedMessage.channel === msg.channel.id;
		console.log('aaa');
		const lemonedMessages = await msg.guild.settings.get('lemonboard.messages');
		const lemonedMessage = lemonedMessages.find(filter);
		lemonedMessage.starMessage = lemonMessage.id;
		const updatedArray = [...lemonedMessages.filter(item => !filter(item)), lemonedMessage];
		await msg.guild.settings.update('lemonboard.messages', updatedArray, { arrayAction: 'overwrite' });

		return true;
	}

};
