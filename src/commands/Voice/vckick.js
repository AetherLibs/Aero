const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      aliases: ['vck'],
      description: 'Voice kicks the mentioned member.',
      requiredPermissions: ['EMBED_LINKS', 'MOVE_MEMBERS', 'MANAGE_CHANNELS'],
      usage: '<user:username>'
    });
  }
  async run(msg, [user = msg.mentions.members.first() || msg.guild.members.get(msg.content.split(" ").slice(1))]) {
    if (!msg.member.hasPermission("MOVE_MEMBERS"))
      return msg.responder.error(msg.language.get('COMMAND_VOICEKICK_NOPERMS'));
    if (!user)
      return msg.responder.error(msg.language.get('COMMAND_VOICEKICK_NOPERMS', user.length > 1));
    if (!user.voiceChannel)
      msg.responder.error(msg.language.get('COMMAND_VOICEKICK_NOVOICE'));
    user.setVoiceChannel(null);
    const embed = new MessageEmbed()
      .setColor("0xc8da00")
      .setDescription(msg.language.get('COMMAND_VOICEKICK_VOICEKICKED'))
      .setFooter(msg.language.get('COMMAND_VOICEKICK_MODERATOR', msg.author.tag), msg.author.avatarURL());
    msg.channel.send(embed).catch(() => null);;
  }
};