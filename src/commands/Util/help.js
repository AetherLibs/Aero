const { Command, util: { isFunction } } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');
const { code } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands', 'h'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS'],
			usage: '(Command:command|usage)'
		});

		this.createCustomResolver('command', (arg, possible, msg) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, msg);
		});
	}

	async run(msg, [command]) {
		const embed = new MessageEmbed()
			.setColor(msg.guild ? msg.guild.me.displayColor : 'RANDOM');

		if (command) {
			if (command === 'usage') {
				return msg.sendEmbed(embed
					.setDescription(msg.language.get('COMMAND_HELP_USAGE', msg.guild.settings.get('prefix')).join('\n'))
				);
			}

			const restrictions = [];

			if (command.permissionLevel >= 9)
				restrictions.push(msg.language.get('COMMAND_HELP_OWNERONLY'));
			else if (command.permissionLevel >= 7)
				restrictions.push(msg.language.get('COMMAND_HELP_OWNERGUILDONLY'));

			if (!command.runIn.includes('dm')) restrictions.push(msg.language.get('COMMAND_HELP_SERVERONLY'));

			embed
				.addField(`${command.name} ${command.aliases.length ? `(${command.aliases.join(', ')})` : ''}`,
					isFunction(command.description)
						? command.description(msg.language)
						: command.description)
				.addField(`• Usage${restrictions.length ? ` (${restrictions.join(', ')})` : ''}`, this.buildUsage(command, msg.guild.settings.get('prefix')))
				.addField('• Permission Node', code`${command.category.toLowerCase()}.${command.name}`);

			if (command.examples?.length) embed.addField('• Examples', this.buildExamples(command, msg.guild.settings.get('prefix'), command.examples));

			return msg.sendEmbed(embed);
		}

		const categories = this.buildHelp();
		for (const category in categories)
			embed.addField(category, categories[category].sort().map(cmd => code`${cmd}`).join(', '));

		embed.setDescription(`[Terms](https://aero.bot/terms) | [Privacy](https://aero.bot/privacy)`);
		embed.setFooter(msg.language.get('COMMAND_HELP_FOOTER', msg.guild.settings.get('prefix')));
		return msg.sendEmbed(embed);
	}

	buildHelp() {
		return this.client.commands
			.filter(command => command.permissionLevel < 9)
			.reduce((categories, command) => {
				if (!(command.category in categories)) categories[command.category] = [command.name];
				else categories[command.category].push(command.name);
				return categories;
			}, {});
	}

	buildUsage(command, prefix) {
		const usage = command.usage.parsedUsage;

		return `${prefix}${command.name}${usage.map(tag => {
			const brackets = tag.required > 1
				? '{}'
				: '[]';
			const options = tag.possibles.map(possible => possible.name).join(' | ');
			return `  ${brackets[0]} ${options} ${brackets[1]}`;
		}).join('')}`;
	}

	buildExamples(command, prefix, examples) {
		return examples.map(example => `${prefix}${command.name} ${example}`).join('\n');
	}

};
