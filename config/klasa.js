const { prefix, stage, owners } = require('./aero');
const db = {
	production: 'aero',
	staging: 'aero-staging',
	development: 'aero-dev'
}[stage];

const { MONGO_URI: uri, MONGO_USER: user, MONGO_PASS: pass, MONGO_HOST: host, MONGO_PORT: port } = process.env;

module.exports = {
	commandEditing: true,
	commandLogging: true,
	console: { useColor: true },
	consoleEvents: {
		debug: stage === 'development',
		verbose: stage === 'development'
	},
	createPiecesFolders: false,
	disabledCorePieces: ['providers', 'languages', 'commands'],
	owners,
	prefix,
	providers: {
		default: 'mongodb',
		mongodb: {
			connectionString: uri ?? `mongodb://${user}:${pass}@${host}:${port}/`,
			db,
			options: {
				forceServerObjectId: true
			}
		}
	},
	typing: false,
	readyMessage: 'Ready.'
};
