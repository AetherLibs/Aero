const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?(discord\.(gg)|discord(app)?\.com\/invite)\/(?<code>\w+)/ui;
		this.thirdPartyRegex = /(https?:\/\/)?(.*?@)?(www\.)?(discord|invite)\.(gg|li|me|io)\/(?<code>\w+)/ui;
		this.botInviteRegex = /(https?:\/\/)?discord\.com\/oauth2\/authorize/;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.invites') || msg.exempt) return;
		const match = this.inviteRegex.exec(msg.content);
		if (match) {
			const invite = await msg.client.fetchInvite(match.groups.code).catch(() => null);
			msg.invite = invite ?? 'invalid'; /* eslint-disable-line require-atomic-updates */
			msg.delete();
		} else if (this.thirdPartyRegex.test(msg.content) || this.botInviteRegex.test(msg.content)) {
			msg.invite = 'invalid';
			msg.delete();
		}
	}

};
