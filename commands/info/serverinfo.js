const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

function splitMessage(str, n) {
  var chunks = [];

  for (var i = 0, charsLength = str.length; i < charsLength; i += n) {
    chunks.push(str.substring(i, i + n));
  }
  return chunks
}
function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};


module.exports = class ServerinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'serverinfo',
			aliases: ['guildinfo', 'server-info', 'guild-info'],
			group: 'info',
			memberName: 'serverinfo',
			description: 'Get information about the server.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) return message.channel.send('This command is only available in a server.')
    else prefix = message.guild.commandPrefix 
    let bot = message.client
    
    let embed = new MessageEmbed();
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    let region = {
          "brazil": "Brazil",
          "eu-central": "Central Europe",
          "singapore": "Singapore",
          "us-central": "U.S. Central",
          "sydney": "Sydney",
          "us-east": "U.S. East",
          "us-south": "U.S. South",
          "us-west": "U.S. West",
          "eu-west": "Western Europe",
          "vip-us-east": "VIP U.S. East",
          "london": "London",
          "amsterdam": "Amsterdam",
          "hongkong": "Hong Kong"
      };
    
    var reg;
    if (region[message.guild.region] == undefined) { reg = message.guild.region.capitalize() }
    else {reg = region[message.guild.region]}
    
    embed.setAuthor(message.guild.name, message.guild.iconURL ? message.guild.iconURL : bot.user.displayAvatarURL)
      .setThumbnail(message.guild.iconURL() ? message.guild.iconURL() : bot.user.displayAvatarURL())
      .addField("Created", `${message.guild.createdAt.toString().substr(0, 15)},\n${checkDays(message.guild.createdAt)}`, true)
      .addField("ID", message.guild.id, true)
      .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
      .addField("Region", reg, true)
      .addField("Members", message.guild.memberCount, true)
      .addField("Roles", message.guild.roles.size, true)
      .addField("Channels", message.guild.channels.size, true)
      .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
      .setColor(0xffee00)
    var emojis;
    if (message.guild.emojis.size === 0) {
      embed.addField("Emojis", "None", true)
    } else {
        emojis = message.channel.guild.emojis.array()
    let ems;
    let emojis2 = []
    for (var i = 0; i < emojis.length; i++) {
      emojis2.push(String(emojis[i].toString()))
    }
    if (String(emojis2).length >= 1024) {
      ems = (splitMessage(String(emojis2), 1000))
    }
    else
      ems = [emojis2]
      
    if (ems.length > 0) {
      for (var i = 0; i < ems.length; i++) {
        if (ems[i] == undefined) {} else {
          let emlist = String(ems[i]).replace("[ ", "").replace(" ]", "").split(",")
            if (!String(ems[i]).startsWith("<")) {
                let l = String(ems[i-1]).replace("[ ", "").replace(" ]", "").split(",").length - 1
                ems[i] = String(String(ems[i-1]).replace("[ ", "").replace(" ]", "").split(",")[l]) + String(ems[i])
                let v = String(ems[i-1]).replace("[ ", "").replace(" ]", "").split(",")
                v.pop()
                ems[i-1] = String(v)
            }
        }
      }
    }
      for (var i = 0; i < ems.length; i++) {
        var e;
        try{
          e = ems[i].replace("[", "").replace("]", "")} catch(err) {
          e = ems[0][i].replace("[", "").replace("]", "")
        }
        if (i === 0) {if (e === '') {} else embed.addField("Emojis", e, true)}
        else {if (e === '') {} else embed.addField("__ __", e, true)}
      }
  }
  message.channel.send(embed)
  }
}
