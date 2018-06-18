const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class CsgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortnite',
			aliases: ['ftn'],
			group: 'game',
			memberName: 'fortnite',
			description: 'Get fortnite stats for a user',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
          if (message.content.split(" ").length <= 3) {
            return message.channel.send("Error. Check the sytax: `" + prefix + "fortnite [pc | xbox | psn] [username]`")
          }
          let playerName = message.content.split(' ')
          playerName.shift()
          playerName.shift()
          playerName = playerName.join(' ')
          let requestv5 = require('request')
          
          let platform = "pc"
          if (message.content.split(' ')[1] === "xbox") platform = "xbl"
          if (message.content.split(' ')[1] === "ps") platform = "psn"
          if (message.content.split(' ')[1] === "psn") platform = "psn"
          
          let options1 = {
            method: "GET",
            url: `https://api.fortnitetracker.com/v1/profile/${platform}/${playerName}`,
            headers: {
              'User-Agent': 'nodejs request',
              'TRN-Api-Key': process.env.FortniteKey
            },
            'json': true
          }
          
          let options2 = {
            method: "GET",
            url: `https://fortnite.y3n.co/v2/player/${playerName}`,
            headers: {
              'User-Agent': 'nodejs request',
              'X-Key': process.env.FortniteSecondKey
            },
            'json': true
          }
          requestv5(options1, function (error, response, body) {
            requestv5(options2, function (error2, response2, body2) {
              if (body.error || error || error2|| !body2) {
                return message.channel.send("User not found. Check the synatx: `" + prefix + "`")
              }
              let stats = body.lifeTimeStats
              let embed = new MessageEmbed()
                .setTitle("Fortnite stats for **" + body.epicUserHandle + "**")
                .setColor(0xac00e6)
              for (let i = 0; i < stats.length; i++) {
                if (stats[i].key !== "Top 6s" && stats[i].key !== "Top 12s" && stats[i].key !== "Top 25s" && 
                    stats[i].key !== "K/d" && stats[i].key !== "Kills" && stats[i].key !== "Top 3s" && 
                    stats[i].key !== "Top 5s" && stats[i].key !== "Top 3s"
                   ) embed.addField(stats[i].key, stats[i].value, true)
                else if (stats[i].key === "Kills") {
                  embed.addField("Total Kills", stats[i].value, true)
                }
              }
              
              if (platform === "pc") {
                let solo = body2.br.stats[platform].solo
                let solokills = solo.kills
                let solowins = solo.wins + " / " + solo.matchesPlayed

                let duo = body2.br.stats[platform].duo
                let duokills = duo.kills
                let duowins = duo.wins + " / " + duo.matchesPlayed

                let squad = body2.br.stats[platform].squad
                let squadkills = squad.kills
                let squadwins = squad.wins + " / " + squad.matchesPlayed

                let all = body2.br.stats[platform].all
                let allkills = all.kills
                let allwins = all.wins + " / " + all.matchesPlayed
              
                embed.addField("Solo Kills", solokills, true)
                embed.addField("Solo Wins", solowins, true)
                embed.addField("Duo Kills", duokills, true)
                embed.addField("Duo Wins", duowins, true)
                embed.addField("Squad Kills", squadkills, true)
                embed.addField("Squad Wins", squadwins, true)
                embed.addField("Total Wins", allwins, true)
              }
              message.channel.send(embed)
            })
          })
        }
}
