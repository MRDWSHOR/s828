const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

module.exports = class CsgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'csgo',
			aliases: ['counterstrike', 'counter-strike', 'counter-strike-global-offensive'],
			group: 'game',
			memberName: 'csgo',
			description: 'Get CSGO stats for a user',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
          function er() {
            return message.channel.send(`Check the syntax: \`${prefix}csgo [account name]\`. To get this name, go to your steam profile look at the url. It should be something like this:
\`\`\`https://steamcommunity.com/id/ACCOUNT-NAME/\`\`\` Use this account name.`)
          }
          let args = message.content.split(' ')
          args.shift()
          if (args.length !== 1)  return er();
          let name = args.join("_")
          let toReq = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.SteamKey}&vanityurl=${name}`
          request({url: toReq, json:true}, function (error, response, body) {
            if (! body.response.steamid) return er()
            else {
              let steamid = body.response.steamid;
              let newurl = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${process.env.SteamKey}&steamid=${steamid}`;
              request({url: newurl, json:true}, function (error, response, body) {
                if (!body.playerstats) {
                  return message.channel.send("No CSGO stats found for the user `" + name + "`.")
                }
                let stats = body.playerstats.stats;
                let embed = new MessageEmbed()
                .setTitle("CS:GO stats for **" + name + "**")
                .setColor(0xeda338)
                let gungamewins = 0, gungameplays = 0
                for (let i=0;i<stats.length;i++) {
                  let name = stats[i].name
                  let val = stats[i].value
                  if (name == "total_kills") embed.addField("Total Kills", val, true)
                  if (name == "total_deaths") embed.addField("Total Deaths", val, true)
                  if (name == "total_time_played") embed.addField("Time played", val, true)
                  if (name == "total_planted_bombs") embed.addField("Bombs planted", val, true)
                  if (name == "total_defused_bombs") embed.addField("Bombs defused", val, true)
                  if (name == "total_wins") embed.addField("Total Wins", val, true)
                  if (name == "total_damage_done") embed.addField("Total damage", val, true)
                  if (name == "total_money_earned") embed.addField("Total money earned", val, true)
                  if (name == "last_match_damage") embed.addField("Last Match damage", val, true)
                  if (name == "total_gun_game_rounds_won") gungamewins = val
                  if (name == "total_gun_game_rounds_played") gungameplays = val
                }
                embed.addField("Gun game wins", gungamewins + " / " + gungameplays)
                message.channel.send(embed)
              })
            }
          })
        }
}
