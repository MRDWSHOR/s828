const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Nodesu = require('nodesu');
const api = new Nodesu.Client(process.env.OsuKey);

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			aliases: [],
			group: 'game',
			memberName: 'osu',
			description: 'Get OSU stats for a user',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
          let args = message.content.replace(prefix + "osu ", "")
          api.user
            .get(args)
            .then(user => {
            let details = {}
            if (!user) {
              return message.channel.send("User not found. Check the syntax: `" + prefix + "osu [username]`.")
            }
            details.id = user.user_id;
            details.name = user.username;
            details.count = user.playcount || "0";
            details.ranked = user.ranked_score || "0";
            details.total = user.total_score || "0";
            details.level = user.level || "0"
            details.acc = String(Math.floor(user.accuracy)) + "%" || "- N/A -"
            details.country = user.country
            details.countryrank = user.pp_country_rank
            details.ss = user.count_rank_ss || "0"
            details.s = user.count_rank_s || "0"
            details.a = user.count_rank_a || "0"
            
            let embed = new MessageEmbed()
            .setColor(0xc13d50)
            .setTitle("OSU Stats for **" + details.name + "**")
            .setDescription("[Profile](https://osu.ppy.sh/users/" + details.id + "/)")
            .addField("ID", details.id, true)
            .addField("Games played", details.count, true)
            .addField("Ranked Score", details.ranked, true)
            .addField("Total Score", details.total, true)
            .addField("Level", details.level, true)
            .addField("Accuracy", details.acc, true)
            .addField("Country", details.country, true)
            .addField("Country Ranking", "#" + details.countryrank, true)
            .addField("SS's", details.ss, true)
            .addField("S's", details.s, true)
            .addField("A's", details.a, true)
            message.channel.send(embed)
          })
        }
}
