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
		const { everyone } = guild.roles;
		const everyoneChannel = guild.channels.cache.find(chan => chan.type === 'text' && everyone.permissionsIn(chan).has([
			'SEND_MESSAGES', 'VIEW_CHANNEL'
		]));

		const { me } = guild;
		if (!me) return false;
		const meChannel = guild.channels.cache.find(chan => chan.type === 'text' && me.permissionsIn(chan).has([
			'SEND_MESSAGES', 'VIEW_CHANNEL'
		]));

		return everyoneChannel || meChannel || false;
	}

};
