const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class StatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			aliases: ['statistic', 'statistics'],
			group: 'info',
			memberName: 'stats',
			description: 'Get stats about the bot',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let bot = message.client
    let url = `http://${process.env.PROJECT_DOMAIN}.glitch.me/commands.json`
    request({url: url,json: true}, function (error, response, commands) {
      
      let embed = new MessageEmbed()
      .setTitle("Stats")
      .setDescription("SankOBot\n[Website](https://www.sankobot.me/)")
      .setColor(0xffee00)
      .setTimestamp()
      .addField("Owner", "GuruAnkrad#0597")
      .addField("Guilds", bot.guilds.size, true)
      .addField("Users", bot.users.size, true)
      .addField("Channels", bot.channels.size, true)
      .addField("Emojis", bot.emojis.size, true)
      .addField("Ping", parseInt(bot.ping), true)
      .addField("Memory", `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}mb`, true)
      .addField("Commands", commands.length, true)
      .addField("Voice Channels", bot.voiceConnections.size, true)
      .addField("Average guild member count", Math.round(bot.users.size / bot.guilds.size), true)
      .setFooter("SankOBot", bot.user.displayAvatarURL())
      message.channel.send(embed)
    })
  }
  
}
