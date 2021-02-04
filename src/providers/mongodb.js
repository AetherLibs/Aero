/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */ 
const { Provider, util: { mergeDefault, mergeObjects, isObject } } = require('@aero/klasa');
const { MongoClient: Mongo } = require('mongodb');
const { inspect } = require('util');

module.exports = class extends Provider {

	constructor(...args) {
		super(...args, { description: 'Allows use of MongoDB functionality throughout Klasa' });
		this.db = null;
	}

	async init() {
		const connection = mergeDefault({
			host: 'localhost',
			port: 27017,
			db: 'klasa',
			options: {}
		}, this.client.options.providers.mongodb);

		// If full connection string is provided, use that, otherwise fall back to individual parameters
		const connectionString = this.client.options.providers.mongodb.connectionString || `mongodb://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.db}`;
		const mongoClient = await Mongo.connect(connectionString,
			mergeObjects(connection.options, { useNewUrlParser: true, useUnifiedTopology: true }));
		this.client.console.log('[Mongo] Connected.');
		this.db = mongoClient.db(connection.db);
	}

	/* Table methods */

	get exec() {
		return this.db;
	}

	hasTable(table) {
		return this.db.listCollections().toArray()
			.then(collections => collections.some(col => col.name === table));
	}

	createTable(table) {
		return this.db.createCollection(table);
	}

	deleteTable(table) {
		return this.db.dropCollection(table);
	}

	/* Document methods */

	getAll(table, filter = []) {
		this.client.console.log(`[Mongo] get `, { table, filter });
		if (filter.length) {
			return this.db.collection(table).find({ id: { $in: filter } }, { _id: 0 })
				.toArray();
		}
		return this.db.collection(table).find({}, { _id: 0 })
			.toArray();
	}

	getKeys(table) {
		return this.db.collection(table).find({}, { id: 1, _id: 0 })
			.toArray();
	}

	get(table, id) {
		this.client.console.log(`[Mongo] get `, { table, id });
		const res = this.db.collection(table).findOne(resolveQuery(id));
		return res;
	}

	has(table, id) {
		return this.get(table, id).then(Boolean);
	}

	getRandom(table) {
		return this.db.collection(table).aggregate({ $sample: { size: 1 } });
	}

	create(table, id, doc = {}) {
		const content = mergeObjects(this.parseUpdateInput(doc), resolveQuery(id));
		this.client.console.log(`[Mongo] create `, { table, id }, content);
		return this.db.collection(table).insertOne(content);
	}

	delete(table, id) {
		const query = resolveQuery(id);
		this.client.console.log(`[Mongo] delete `, { table, id, query });
		return this.db.collection(table).deleteOne();
	}

	update(table, id, doc) {
		const update = parseEngineInput(doc);
		if (!Object.keys(update).length) return {};
		const query = resolveQuery(id);
		if (!doc.stats) this.client.console.log(`[Mongo] update `, { table, id }, query, inspect(update, false, 10, true));
		const res = this.db.collection(table).updateOne(query, { $set: update });

		return res;
	}

	replace(table, id, doc) {
		const query = resolveQuery(id);
		const update = this.parseUpdateInput(doc);
		this.client.console.log(`[Mongo] replace `, { table, id }, query, inspect(update, false, 10, true));
		return this.db.collection(table).replaceOne(query, update);
	}

};

// eslint-disable-next-line no-extra-parens
const resolveQuery = query => isObject(query) ? query : { id: query };

function upsert(object, propertyPath, value) {
	const spread = propertyPath.startsWith('...');
	if (spread && typeof value !== 'object') throw new Error("Spread operator '...', can only be used with objects");

	function rec(objectTail, propertyPathTail, spread) { /* eslint-disable-line no-shadow */
		const propPaths = propertyPathTail.split('.');
		const head = propPaths[0];
		let tail = propPaths.splice(1);
		tail = tail.join('.');

		if (typeof objectTail[head] !== 'object') {
			objectTail[head] = {};
		}

		if (tail) {
			objectTail[head] = rec(objectTail[head], tail, spread);
			return objectTail;
		} else if (!head) {
			return value;
		} else {
			objectTail[head] = spread ? Object.assign({}, objectTail[head], value) : value;
			return objectTail;
		}
	}

	return rec(object, spread ? propertyPath.slice(3) : propertyPath, spread);
}

function parseEngineInput(updated) {
	const output = {};

	for (const item of updated) {
		if (item.previous === item.next) continue;
		const value = item.next;
		const { path } = item.entry;
		if (path.split('.').length === 1) {
			output[path] = value;
		} else {
			upsert(output, path, value);
		}
	}

	return output;
}
