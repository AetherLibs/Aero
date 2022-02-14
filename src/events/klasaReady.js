const { Event } = require('@aero/klasa');
const { encode } = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;
const req = require('@aero/centra');

function updateWsPing(ping) {
	const epochInSeconds = Math.floor(new Date() / 1000);
	const data = {
		timestamp: epochInSeconds,
		value: ping
	};

	req('https://api.statuspage.io/v1/pages')
		.path(process.env.STATUS_ID)
		.path('/metrics')
		.path(process.env.STATUS_METRIC_WSPING)
		.path('data.json')
		.method('POST')
		.header('Authorization', `OAuth ${process.env.STATUS_TOKEN}`)
		.body({ data }, 'json')
		.send();
}

module.exports = class extends Event {

	async run() {
		if (this.client.config.cwEnabled) {
			await this.client.chatwatch.login()
				.then(() => this.client.console.log('[ChatWatch] Connected to Websocket.'))
				.catch(err => this.client.console.error('[ChatWatch] failed to log in', err));
		}
		this.client.user.setActivity(`${this.client.options.prefix}help`, { type: 'LISTENING' });
		if (process.env.BOOT_SINGLE === 'false') {
			this.client.console.log('[Aether] Sending ready event.');
			this.client.manager.ws.send(encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
		}
		if (this.client.config.stage === 'staging') {
			this.client.console.log(`[Status] Posting stats with initial ping of ${this.client.ws.ping}ms.`);
			this.client.setInterval(() => updateWsPing(this.client.ws.ping), 60 * 1000);
		}
		this.client.experiments = await req('https://rollouts.advaith.workers.dev/')
			.json()
			.then(res => res
				.filter(item => item?.data?.type === 'guild' && item?.data?.title && item?.data?.description && item?.data?.buckets)
				.map(({ data, rollout }) => {
					const experiment = {};

					experiment.name === data.title;

					experiment.buckets = new Map();
					for (const bucket of data.buckets)
						experiment.buckets.set(bucket, data.description[bucket]);


					experiment.hash = data.hash;
					experiment.id = data.id;

					experiment.overrides = new Map();
					const [rolloutHash, _, __, rolloutRanges, overrides] = rollout; /* eslint-disable-line no-unused-vars */
					for (const override of overrides) {
						const { b: bucket, k: ids } = override;
						if (experiment.overrides.has(bucket)) {
							const entry = experiment.overrides.get(bucket);
							for (const id of ids) entry.add(id);
						} else experiment.overrides.set(bucket, new Set(ids));
					}
					return experiment;
				})
				.reduce((acc, cur) => acc.set(cur.id, cur), new Map())
			)
			.catch(() => ({}));

		this.client.config.install_params /* eslint-disable-line camelcase */
			= await this.client.api.applications(this.client.user.id).rpc.get().then(res => res.install_params)
			?? { scopes: ['applications.commands', 'bot'], permissions: '8' };
	}

};
