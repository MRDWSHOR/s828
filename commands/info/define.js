const Command = require('../../structures/Command');
var request = require('request').defaults({ encoding: null });

module.exports = class DefineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'define',
			aliases: ['definition', 'word'],
			group: 'info',
			memberName: 'define',
			description: 'Define a word',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
  let splitMsg = message.content.split(' ')
  if (splitMsg.length < 2) {
    message.channel.send('Please check the syntax: `' + prefix + 'define [word]`. Phrases are not defineable (only single words)')
  } else if (splitMsg.length > 2) {
    
    message.channel.send('Please check the syntax: `' + prefix + 'define [word]`. Phrases are not defineable (only single words)')
  } else {
    let word = splitMsg[1]
    let url = "https://owlbot.info/api/v2/dictionary/" + String(word) + "?format=json"
    let msgContent = ""
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         let importedJSON = JSON.parse(body);
        let originalMeaning = importedJSON;
        for (var i = 0; i < importedJSON.length; i++) {
              msgContent = msgContent + "**" + (importedJSON[i]['type'].replace("'", "")) + "**\n"
              msgContent = msgContent + '```fix\n'
              msgContent = msgContent + importedJSON[i]['definition'].replace("'", "") + "\n```\n"
            //msgContent = msgContent + "*" + importedJSON[i]['example'].replace("'", "") + "\n```\n"
        }
        
      }
      if (msgContent === "") {
        msgContent = "Could not define the word `" + word + "`."
      }
      message.channel.send(msgContent)
    })
    
    
  }
  };
}
