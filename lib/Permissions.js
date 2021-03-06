/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
/* eslint-disable complexity, max-classes-per-file */
const { GuildMember, Role, Permissions: { FLAGS } } = require('discord.js');
const { util } = require('@aero/klasa');
const { objectIsEmpty } = require('./util/util');

const DIRECT = 0, ROLE = 1, EVERYONE = 2;

class Entry {

	constructor(value, cause) {
		this.value = value;
		this.cause = cause;
	}

}

class Permissions {

	constructor(client) {
		this.client = client;
		this.client.on('klasaReady', this.init.bind(this));
	}

	// modify edits permissions for the target. action can be "allow", "deny", "remove" or "clear"
	async handle({ action, target = 'everyone', message, permission = '*' }) {
		if (!Permissions.canModify(message.member, target) && action !== 'show') throw 'COMMAND_PERMS_ERR_TARGET';
		permission = this.validate(permission);
		let nodes = await this.provider.get('permNodes', message.guild.id);
		if (!nodes) {
			// do not unnecessarily create the nodes
			if (['clear', 'remove', 'show'].includes(action)) throw 'COMMAND_PERMS_ERR_CONFIG';

			// create the nodes so we can add to them
			await this.provider.create('permNodes', message.guild.id, Permissions.schema);
			nodes = { ...Permissions.schema };
		}
		if (target instanceof Role && target.id === message.guild.roles.everyone.id) target === 'everyone';

		const treeName = Permissions.getTree(target);

		switch (action) {
			/* eslint-disable no-fallthrough */
			case 'show':
				return this.buildTree(target, nodes, treeName, message.guild);
			case 'clear':
				if (treeName === 'everyone') nodes.everyone = {};
				else delete nodes[treeName][target.id];
				await this.provider.replace('permNodes', message.guild.id, nodes);
				break;
			case 'reset':
				await this.provider.delete('permNodes', message.guild.id);
				break;
			case 'remove':
			case 'allow':
			case 'deny': {
				const { category, command } = permission;

				// for remove, set the node to null so its removed while copying the object
				const value = action === 'remove' ? undefined : action === 'allow';
				if (treeName === 'everyone') {
					if (!command) nodes.everyone[category] = value;
					else util.makeObject(`everyone.${category}.${command}`, value, nodes);
				} else {
					/* eslint-disable no-lonely-if */
					if (!command) util.makeObject(`${treeName}.${target.id}.${category}`, value, nodes);
					else util.makeObject(`${treeName}.${target.id}.${category}.${command}`, value, nodes);
					/* eslint-enable no-lonely-if */
				}

				// removes fields set to undefined or {}
				if (action === 'remove') {
					nodes = Permissions.removeUndefined(nodes);
					for (const key in Permissions.schema) if (!nodes[key]) nodes[key] = {};
				}
				await this.provider.replace('permNodes', message.guild.id, nodes);
				break;
			}
			/* eslint-enable no-fallthrough */

			// no default
		}
		return nodes;
	}

	/*
	 * canUse returns whether the invoker can use the supplied command. it checks permission nodes
	 * with the heirarchy order: users, roles, everyone. if permission nodes are not configured, it
	 * defaults to the default permissions of the command
	 */
	async canUse(msg, command) {
		// owners bypass permission nodes
		if (msg.author.id === msg.guild.ownerID) return true;
		const permNodes = await this.provider.get('permNodes', msg.guild.id);

		// default to the required permissions of the command if nodes are not configured
		if (!permNodes) {
			return command.defaultPermissions
				? msg.member.permissions.has(command.defaultPermissions)
				: true;
		}

		const roles = msg.member.roles.cache.sort((a, b) => b.position - a.position).array().slice(0, -1);

		const trees = [
			permNodes.users[msg.author.id] || {},
			...roles.map(role => permNodes.roles[role.id] || {}),
			// permNodes.roles[msg.member.roles.highest.id] || {},
			permNodes.everyone
		];
		for (const tree of trees) {
			const result = this.checkTree(command, tree);
			if (result !== 'none') return result;
		}
		return command.defaultPermissions ? msg.member.permissions.has(command.defaultPermissions) : true;
	}

	/*
	 * checkTree checks for permission nodes in the tree. it checks <category>.<command>,
	 * <category>.* and *, in that order. checkTree returns true, false and "none" to distinguish
	 * unconfigured nodes and nodes set to false.
	 */
	checkTree(command, tree) {
		const category = command.category.toLowerCase();

		// category nodes take priority over *
		if (category in tree) {
			const categoryNode = tree[category];
			// category.command takes precedence over category.*
			if (command.name in categoryNode) return categoryNode[command.name];
			else if ('*' in categoryNode) return categoryNode['*'];
		} else if ('*' in tree)
			return tree['*'];

		return 'none';
	}

	// canModify returns whether a member can modify permission nodes for the target.
	static canModify(member, target) {
		// owners can modify permission nodes for everyone
		if (member.id === member.guild.ownerID) return true;

		// members can modify permission nodes of members with lower roles than them
		if (target instanceof GuildMember) {
			// members cannot modify permission nodes of the owner
			if (target.id === member.guild.ownerID) return false;
			return member.roles.highest.position > target.roles.highest.position;
		} else if (target instanceof Role) {
			// members can modify permission nodes of roles lower than them
			return member.roles.highest.position > target.position;
		} else if (target === 'everyone') {
			// only administrators can modify permissions for everyone
			return member.permissions.has(FLAGS.ADMINISTRATOR);
		}
		return false;
	}

	// getTree returns the name of the tree
	static getTree(target) {
		if (target instanceof GuildMember) return 'users';
		else if (target instanceof Role) return 'roles';
		return 'everyone';
	}

	// validate parses a raw permission into { category, command }
	validate(permission) {
		if (permission === '*') return { category: '*', command: null };
		const [category, command] = permission.split('.');
		if (!command) throw 'COMMAND_PERMS_ERR_USAGE_NOCOMMAND';
		if (!this.categories.has(category)) throw 'COMMAND_PERMS_ERR_USAGE_INVALIDCATEGORY';
		if (command !== '*' && !this.client.commands.has(command)) throw 'COMMAND_PERMS_ERR_USAGE_INVALIDCOMMAND';
		return { category, command: this.client.commands.get(command) || command };
	}

	// removes undefined, null, and {} from Permission DB entries
	static removeUndefined(obj) {
		/* eslint-disable no-unused-expressions */
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'object') {
				obj[key] = Permissions.removeUndefined(obj[key]);
				objectIsEmpty(obj[key]) && delete obj[key];
			} else
				[undefined, null].includes(obj[key]) && delete obj[key];
		});

		return obj;
		/* eslint-enable no-unused-expressions */
	}

	// builds an object resembling a target's usable permissions
	buildTree(target, nodes, treeName, guild) {
		/* eslint-disable no-unused-expressions, no-fallthrough */
		const tree = Object.fromEntries([...this.categories.keys()].map(i => [i, {}]));
		switch (treeName) {
			case 'users':
				util.mergeObjects(tree, nodes.users[target.id]);
				Permissions.makeEntries(tree, guild, DIRECT, target.id);
			case 'roles':
				if (treeName === 'roles') {
					util.mergeObjects(tree, nodes.roles[target.id]);
					Permissions.makeEntries(tree, guild, DIRECT);
				} else {
					for (const role of target.roles.cache.filter(_role => nodes.roles[_role.id]).values()) {
						this.mergePermissions(tree, nodes.roles[role.id]);
						Permissions.makeEntries(tree, guild, ROLE, role.id);
					}
				}
			case 'everyone':
				if (treeName === 'everyone') {
					util.mergeObjects(tree, nodes.everyone);
					Permissions.makeEntries(tree, guild, DIRECT);
				} else {
					this.mergePermissions(tree, nodes.everyone);
					Permissions.makeEntries(tree, guild, EVERYONE);
				}
				break;
		}
		/* eslint-enable no-unused-expressions, no-fallthrough */
		return tree;
	}

	// merges two permission entries in place
	mergePermissions(target, source) {
		if (typeof target['*'] === 'boolean') return target;
		for (const key in target) {
			if (typeof target[key]['*'] === 'boolean') break;
			target[key] = util.mergeObjects(source[key], target[key]);
		}
		return target;
	}

	static makeEntries(obj, guild, type, id) {
		/* eslint-disable no-unused-expressions */
		Object.keys(obj).forEach(key => {
			if (obj[key] instanceof Entry) {
				// noop
			}
			else if (obj[key] === null)
				delete obj[key];
			else if (typeof obj[key] === 'object')
				obj[key] = Permissions.makeEntries(obj[key], guild, type, id);
			else if (typeof obj[key] === 'boolean')
				obj[key] = new Entry(obj[key], Permissions.getDescriptor(type, id, guild));
		});

		return obj;
		/* eslint-enable no-unused-expressions */
	}

	static getDescriptor(type, id, guild) {
		switch (type) {
			case DIRECT:
				return 'direct override';
			case ROLE:
				return `role ${guild.roles.cache.get(id)}`;
			case EVERYONE:
				return 'override on everyone';
			default:
				throw 'unknown type';
		}
	}

	get provider() {
		return this.client.providers.default;
	}

	init() {
		this.categories = new Set(this.client.commands.map(command => command.category.toLowerCase()));
	}

}

Permissions.schema = {
	users: {},
	roles: {},
	everyone: {}
};

module.exports = Permissions;
