const Client = require('ws');
const EventHandler = require('./event/EventHandler');
const MessageUtil = require('./util/MessageUtil');
const Message = require('./Message');
const { IDENTIFY_CLIENT } = require('./util/constants').types;

class Websocket extends Client {

	constructor(client) {
		super(`${process.env.WS_URL}`);
		this.client = client;
		this.handler = new EventHandler(client);
		this.on('open', () => {
			if (this.client.client.ready) {
				this.send(MessageUtil.encode(new Message(IDENTIFY_CLIENT, { id: this.client.id, ready: true })));
			} else {
				this.send(MessageUtil.encode(new Message(IDENTIFY_CLIENT, { id: this.client.id })));
			}
			this.client.client.console.log('[Aether] Sending identify event.');
		});
	}

	init() {
		this.handler.init();

		this.on('message', message => {
			this.handler.handle(message);
		});
	}

}

module.exports = Websocket;
