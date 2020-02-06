const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const Reconnector = require('./ws/Reconnector');
const express = require('express');
const { hostname } = require('os');

module.exports = class Manager {

	constructor() {
		this.id = process.env.NODE_ENV === 'production' ? Number(hostname().split('-').pop()) : 0;
		this.client = new Aero(this);
		if (process.env.BOOT_SINGLE === 'false') {
			this.ws = new Websocket(this);
			this.reconnector = new Reconnector(this);
			this.api = express();
			this.api.listen(process.env.PROBES_API_PORT, () => this.client.console.log(`[Kubernetes] Probes API is listening on ${process.env.PROBES_API_PORT}`));
		}
		this.listen();
	}

	init() {
		if (process.env.BOOT_SINGLE !== 'false') return;
		this.ws.init();

		this.ws.on('open', () => {
			this.client.console.log('[Sharder] WS opened.');
			this.reconnector.handleOpen();
		});

		this.ws.on('close', (code, reason) => {
			this.client.console.warn('[Sharder] WS closed.');
			this.reconnector.handleClose(code, reason);
		});

		this.ws.on('error', error => {
			this.client.console.error('[Sharder] WS errored.');
			this.reconnector.handleError(error);
		});
	}

	listen() {
		if (process.env.BOOT_SINGLE !== 'false') {
			return this.client.login({ shardCount: 1 });
		}

		this.api.get('/health', (req, res) => {
			res.status(200).end();
		});

		this.api.get('/ready', (req, res) => {
			if (this.client.ready || true) {
				res.status(200).end();
			} else {
				res.status(400).end();
			}
		});

		this.api.get('/shutdown', (req, res) => {
			this.client.console.log('[Kubernetes] Received shutdown.');
			res.status(200).end();
		});
		return this.api;
	}

	launch(data) {
		this.client.console.log('[Sharder] Attempting to login.');
		this.client.login(data);
	}

};
