const { Command } = require('@aero/klasa');
const { discordBadges: emojis, emojis: { infinity } } = require('~/lib/util/constants');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
			permissionLevel: 10,
			usage: '[user:username]',
			aliases: ['av']
		});
	}

	async run(msg) {
		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);
		const [badges, bots, nitros] = await this.getBadgeCounts(msg, loading);
		const boosters = await this.client.api.guilds(msg.guild.id).get().then(res => res.premium_subscription_count);

		/* eslint-disable indent */
		const description = [
			badges[0] > 0 && `${emojis.staff} ${badges[0]} x Discord employee`,
			badges[1] > 0 && `${emojis.partner} ${badges[1]} x Partnered Server Owner`,
			badges[2] > 0 && `${emojis.hypesquadEvents} ${badges[2]} x HypeSquad Events`,
			nitros > 0 && `${emojis.nitro} ${nitros} x Nitro ${(boosters > 0) || (badges[9] > 0)
				? `(${boosters > 0
					? `${emojis.boosting1} ${boosters} Boosters`
					: ''
				}${(boosters > 0) && (badges[9] > 0)
					? ', '
					: ''
				}${badges[9] > 0
					? `${emojis.earlySupporter} ${badges[9]} Early Supporters)`
					: ''
				}`
				: ''}`,
			badges[3] > 0 && `${emojis.bughunter1} ${badges[3]} x Bug Hunter Level 1`,
			badges[14] > 0 && `${emojis.bughunter2} ${badges[14]} x Bug Hunter Level 2`,
			badges[6] > 0 && `${emojis.hypesquadBravery} ${badges[6]} x House Bravery`,
			badges[7] > 0 && `${emojis.hypesquadBrilliance} ${badges[7]} x House Brilliance`,
			badges[8] > 0 && `${emojis.hypesquadBalance} ${badges[8]} x House Balance`,
			badges[17] > 0 && `${emojis.verifiedDeveloper} ${badges[17]} x Early Verified Bot Developer`,
			bots > 0 && `${emojis.bot} ${bots} x Bot${badges[16] > 0 ? ` (${emojis.verifiedBot} ${badges[16]} Verified Bots)` : ''}`
		].filter(i => !!i).join('\n');
		/* eslint-enable indent */

		await msg.send(description);

		return loading.delete();
	}

	async getBadgeCounts(msg, loading) {
		const max = msg.guild.memberCount;
		let count = 0;
		let members = [];
		let after = '0';
		let bots = 0;
		let nitros = 0;

		while (count < max) {
			count += 100;
			const chunk = await this.client.api.guilds(msg.guild.id).members.get({ query: { limit: 100, after } });
			after = chunk[chunk.length - 1].user.id;
			members = members.concat(chunk);
			console.log(after, '   ', members.length, '    ', chunk.length);
			if (count < max && (count % 300) === 0) loading.edit(`${infinity} this might take a few seconds (${((count / max) * 100).toFixed(1)}%)`);
		}

		const flags = Array(18).fill(0);

		for (const member of members) {
			/* eslint-disable-next-line no-bitwise */
			for (let i = 0; i < 18; i++) if ((member.user.public_flags & (1 << i)) === 1 << i) flags[i]++;
			if (member.user.bot) bots++;
			if (member.user.avatar.startsWith('a_') || ['0001', '1337', '9999', '6969', '0420', '1234'].includes(member.user.discriminator)) nitros++;
		}

		return [flags, bots, nitros];
	}

};
