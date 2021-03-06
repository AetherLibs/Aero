/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Command, Store, Stopwatch } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<Store:store|Piece:piece|everything:default>'
		});
	}

	async run(message, [piece]) {
		if (piece === 'everything') return this.everything(message);
		if (piece instanceof Store) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			return message.sendLocale('COMMAND_RELOAD_ALL', [piece, timer.stop()]);
		}

		try {
			const itm = await piece.reload();
			const timer = new Stopwatch();
			return message.sendLocale('COMMAND_RELOAD', [itm.type, itm.name, timer.stop()]);
		} catch (err) {
			piece.store.set(piece);
			return message.sendLocale('COMMAND_RELOAD_FAILED', [piece.type, piece.name]);
		}
	}

	async everything(message) {
		const timer = new Stopwatch();
		await Promise.all(this.client.pieceStores.map(async (store) => {
			await store.loadAll();
			await store.init();
		}));
		return message.sendLocale('COMMAND_RELOAD_EVERYTHING', [timer.stop()]);
	}

};
