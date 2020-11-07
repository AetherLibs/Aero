const ModerationCommand = require('./ModerationCommand');
const { GuildMember } = require('discord.js');

class MultiModerationCommand extends ModerationCommand {

	async getModeratable(executor, targets, memberOnly) {
		const ids = new Set();
		targets.forEach(async target => {
			if (!(target instanceof GuildMember)) { await executor.guild.members.fetch(target.id).catch(() => null); }
		});
		return targets
			.filter(target => {
				const member = executor.guild.members.cache.get(target.id);
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				if (!member) return !memberOnly;
				return this.comparePermissions(executor, member);
			});
	}

}

module.exports = MultiModerationCommand;
