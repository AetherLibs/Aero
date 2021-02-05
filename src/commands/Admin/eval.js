/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Command, Stopwatch, Type, util } = require('@aero/klasa');
const { inspect } = require('util');
const req = require('@aero/centra'); /* eslint-disable-line no-unused-vars */

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_EVAL_EXTENDEDHELP'),
			usage: '<expression:str>',
			usageDelim: null
		});
	}

	async run(message, [code]) {
		const { success, result, time, type } = await this.eval(message, code);
		const footer = util.codeBlock('ts', type);
		const output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
			time, util.codeBlock('js', result), footer);
		if ('silent' in message.flagArgs) return null;

		// Handle too-long-messages
		if (output.length > 2000) {
			const { key } = await req(this.client.config.hasteURL, 'POST')
				.path('documents')
				.json();

			return message.send(message.language.get('COMMAND_EVAL_SENDHASTE', time, `${this.client.config.hasteURL}/${key}`, footer));
		}

		// If it's a message that can be sent correctly, send it
		return message.send(output);
	}

	// Eval the input
	async eval(message, code) {
		// eslint-disable-next-line no-unused-vars
		const msg = message;
		const { flagArgs } = message;
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type;
		try {
			if (flagArgs.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (!type) type = new Type(error);
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			if (error && error.stack) this.client.emit('error', error.stack);
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flagArgs.depth ? parseInt(flagArgs.depth) || 0 : 0,
				showHidden: Boolean(flagArgs.showHidden)
			});
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(result) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

};
