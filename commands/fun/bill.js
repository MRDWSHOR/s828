const Command = require('../../structures/Command');
var request = require('request').defaults({ encoding: null });

module.exports = class BillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bill',
			aliases: ["billmeme", "bill-meme"],
			group: 'fun',
			memberName: 'bill',
			description: 'Get a bill meme for you or someone you tagged.',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let splitmsg = message.content.split(' ')
    if (splitmsg.length >= 2) {
      var toSend;
      if (message.mentions.users.size >= 1) {
        toSend = message.mentions.users.first().username;
        toSend = toSend.replace(/ /g, "%20" );
      }
      else {
        toSend = message.content.split(' ')
        toSend.shift()
        toSend = toSend.join(' ')
        toSend = toSend.replace(/ /g, "%20" );
      }
      let url = 'http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=' + toSend;
    message.channel.send("Loading your bill...").then (msg1=> {
      request({url: url,json: true}, function (error, response, buffer) {
        msg1.delete().catch(err => {})
        message.channel.send("__Bill__", { files: [{ attachment: buffer, name: 'Bill.jpg' }]}).catch(err => {
          if (err.name == 'DiscordAPIError') message.channel.send("__Bill__\n" + url);
          else message.channel.send("Error: `" + err.name + "`\n\n```fix\n" + err.message + "```Report this to the SankOBot Help Server (`%help`).")
        })
      });
    })
    } else {
      let ts = message.author.username
      ts = encodeURIComponent(ts)
      let url = 'http://belikebill.azurewebsites.net/billgen-API.php?default=1&name=' + ts;
      message.channel.send("Loading your bill...").then (msg1=> {
      request({url: url,json: true}, function (error, response, buffer) {
        msg1.delete().catch(err => {})
        message.channel.send("__Bill__", { files: [{ attachment: buffer, name: 'Bill.jpg' }]}).catch(err => {
          if (err.name == 'DiscordAPIError') message.channel.send("__Bill__\n" + url);
          else message.channel.send("Error: `" + err.name + "`\n\n```fix\n" + err.message + "```Report this to the SankOBot Help Server (`%help`).")
        })
      });
    })
    }
  };
}
