/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Inhibitor } = require('@aero/klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (message.guild && command.requireSocial && !message.guild.settings.get('social.enabled'))
			throw `The economy system isn't enabled in this server. Use \`${message.guild.settings.get('prefix')}social toggle\` to enable it.`;
	}

};
