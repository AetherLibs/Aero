const { Inhibitor } = require('@aero/klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (message.guild && command.requireSocial && !message.guild.settings.get('social.enabled')) {
			throw `The economy system isn't enabled in this server. Use \`${message.guild.settings.get('prefix')}social toggle\` to enable it.`;
		}
	}

};
