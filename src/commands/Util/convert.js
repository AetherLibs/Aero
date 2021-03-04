const { Command } = require('@aero/klasa');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_CONVERT_DESCRIPTION'),
			usage: '<amount:number> <from:string> <to:string>',
			usageDelim: ' '
		});
	}

	async run(msg, [amount, from, to]) {
		return this.client.ksoft.kumo.convert(amount, from, to)
			.then(({ pretty }) => {
				const input = `${amount.toFixed(2)} ${from.toUpperCase()}`;

				return msg.responder.success('COMMAND_CONVERT_SUCCESS', input, pretty);
			})
			.catch(err => { throw err.message; });
	}

};
