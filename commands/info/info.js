const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var namer = require('color-namer')

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['userinfo', 'user-info', "whois", ""],
			group: 'info',
			memberName: 'info',
			description: 'Get the user info of a mentioned user or yourself',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let persssun;
    persssun = message.mentions.members.first() || message.member
    let game;
    if (persssun.user.presence.game === null || persssun.user.presence.game === undefined ) { game = "Nothing"}
    else game = persssun.user.presence.game.name
    let created = new Date(persssun.user.createdAt);
    let c = created.getDate() + "-" + String(parseInt(created.getMonth()) + 1) + "-" + created.getFullYear();
    
    
    let joined = new Date(persssun.joinedAt );
    let j = joined.getDate() + "-" + String(parseInt(joined.getMonth()) + 1) + "-" + joined.getFullYear();
    
    let bot2 = persssun.user.bot;
    let b
    if (bot2) b = "Yes"
    else b = "No"
    let color = namer(persssun.displayHexColor).basic[0].name
    let embed = new MessageEmbed()
      .setTitle("Information for ***" + persssun.user.username + "***")
      .setThumbnail(persssun.user.displayAvatarURL)
      .setTimestamp()
      .setColor(0xffee00)
      .setFooter(message.client.user.username, message.client.user.displayAvatarURL)
      .addField("Nickname", persssun.displayName, true)
      .addField("Status", persssun.user.presence.status.capitalize(), true)
      .addField("Playing", game, true)
      .addField("Account created", c, true)
      .addField("Bot Account", b, true)
      .addField("User ID", persssun.user.id, true)
      .addField("Highest role", persssun.roles.highest.name, true)
      .addField("Joined __" + message.guild.name + "__", j, true)
      .addField("Display colour", String(color).capitalize() + " (" + persssun.displayHexColor + ")", true)
    message.channel.send(embed)
  }
}
