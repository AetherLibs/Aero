const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	run(guild) {
		const defaultChannel = this.getMessageChannel(guild);
		if (defaultChannel) defaultChannel.send(guild.language.get('EVENT_JOIN_MESSAGE', this.client.user.username, guild.settings.get('prefix')));
		guild.createMuteRole();
	}

	getMessageChannel(guild) {
		const everyone = guild.roles.everyone;
		const everyoneChannel = guild.channels.cache.find(c => c.type === 'text' && everyone.permissionsIn(c).has([
			'SEND_MESSAGES', 'VIEW_CHANNEL'
		]));

		const me = guild.me;
		const meChannel = guild.channels.cache.find(c => c.type === 'text' && me.permissionsIn(c).has([
			'SEND_MESSAGES', 'VIEW_CHANNEL'
		]));

		return everyoneChannel || meChannel || false;
	}

};
