const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(role) {
		if (!role.guild.available) return false;
		const id = role.guild.settings.get('mod.roles.mute');
		if (role.id === id) return role.guild.settings.reset('mod.roles.mute');
		return false;
	}

};
