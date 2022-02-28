const { BaseCluster } = require('kurasuta');

module.exports = class extends BaseCluster {

	launch() {
		this.client.console.log(`[Kurasuta] Launching cluster ${this.id}.`);
		this.client.login();
	}

};
