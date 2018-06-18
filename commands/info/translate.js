const Command = require('../../structures/Command');
var request = require('request').defaults({ encoding: null });

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: [],
			group: 'info',
			memberName: 'translate',
			description: 'Translate text',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    
    let args = message.content.split(' ')
    args.shift()
    let lang = args[0];
    args.shift();
    args = args.join(" ")
    if (lang.length != 2 || args.length < 2) {
      return message.channel.send("Check the syntax. Go to https://www.sankobot.me/translate/ and find the language you want to translate into. Then follow this syntax: `" + prefix + "translate [code] [text to translate]`. (Ex `" + prefix + "translate ru Hello. How are you?`)")
    }
    let url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + process.env.yandexKey + "&text=" + encodeURIComponent(args) + "&lang=" + lang.toLowerCase() + "&format=plain";
    request({url: url, json: true}, function (error, response, body) {
      if (body.code != 200) {
        if (body.code == 501) {
          return message.channel.send("Language code not found. Go to https://www.sankobot.me/sankobot/translate/ and find the language you want to translate into. Then follow this syntax: `" + prefix + "translate [code] [text to translate]`. (Ex `" + prefix + "translate ru Hello. How are you?`)")}
        else return message.channel.send("Unkown error. Report the code `" + body.code + "` to the SankOBot Help Server and mention the command you used.")
      }
      else {
        let translated = body.text[0]
        let sendText = "Translation (" + body.lang + "): ```fix\n" + args + "``` to ```fix\n" + translated + "```"
        message.channel.send(sendText)
      }
    })
  }
}
