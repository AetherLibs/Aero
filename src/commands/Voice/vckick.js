const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vck'],
			description: 'Voice kicks the mentioned member.',
			requiredPermissions: ['EMBED_LINKS','MOVE_MEMBERS','MANAGE_CHANNELS'],
		});
    }
async run(msg, [user = msg.mentions.members.first()||msg.guild.members.get(msg.content.split(" ").slice(1))]) {
    if (!msg.guild.me.hasPermission(["MANAGE_CHANNELS", "MOVE_MEMBERS"]))
      return msg.reply("Aero is missing the required permissions!");
      if (!msg.member.hasPermission("MOVE_MEMBERS"))
        return msg.channel.send("You are missing `Move_Members` Permission!");
    if (!user)
      return msg.reply("You need to mention or provide userID to kick from the voice channel.");
    if (!user.voiceChannel)
      return msg.reply("That user isn't in a voice channel.");
    user.setVoiceChannel(null);
    let embed = new MessageEmbed()
    .setColor("0xff0000")
    .setDescription(`Sucessfully Removed ${user.user.tag} from VC!`)
    .setFooter(`Moderator: ${msg.author}`);
    msg.channel.send(embed);
      }
    };