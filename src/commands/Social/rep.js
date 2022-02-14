/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command, Duration, constants: { TIME } } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REP_DESCRIPTION'),
			aliases: ['upvote'],
			runIn: ['text'],
			usage: '<user:username>'
		});

		this.requireSocial = true;
	}

	async run(msg, [user]) {
		if (user.id === msg.author.id) return msg.responder.error('COMMAND_REP_NOSELF');
		if (Date.now() - msg.author.settings.get('lastReputationTimestamp') < TIME.HOUR * 12)
			return msg.responder.error('COMMAND_REP_COOLDOWN', Duration.toNow(msg.author.settings.get('lastReputationTimestamp') + (TIME.HOUR * 12)));

		await msg.author.settings.sync();
		await msg.author.settings.update('lastReputationTimestamp', Date.now());

		const total = user.settings.get('stats.reputation.total');
		await user.settings.sync();
		await user.settings.update('stats.reputation.total', total + 1);

		const individual = user.settings.get('stats.reputation.individual');
		if (!individual.includes(msg.author.id)) user.settings.update('stats.reputation.individual', msg.author.id, { arrayAction: 'add' });

		return msg.responder.success('COMMAND_REP_REPLY', user.username);
	}

};
