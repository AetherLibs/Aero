const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_UNREMIND_DESCRIPTION'),
			usage: '<id:string>',
			aliases: ['deletereminder']
		});
	}

	async run(msg, [id]) {
		const task = this.client.schedule.tasks
			.find(task => task.id === id && task.taskName === 'reminder');

		if (!task) return msg.responder.error('COMMAND_UNREMIND_NOEXIST');
		if (task.data.user !== msg.author.id) return msg.responder.error('COMMAND_UNREMIND_NOOWNER');

		await this.client.schedule.delete(id);

		return msg.responder.success();	
	}

};
