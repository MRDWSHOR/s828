const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

module.exports = class TriviaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trivia',
			aliases: ["question"],
			group: 'fun',
			memberName: 'trivia',
			description: 'Can you answer the question in time?',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let url = "https://opentdb.com/api.php?amount=1&type=multiple";
    request({url: url,json: true}, function (error, response, body) {
      if (error) throw (error);
      var allAnswers = []
      allAnswers.push(body["results"][0]["correct_answer"])
      for (var i = 0; i < body["results"][0]["incorrect_answers"].length; i++) { 
        allAnswers.push(body["results"][0]["incorrect_answers"][i])
      }
      let q = body["results"][0]["question"].replace("&quot;", "**").replace("&quot;", "**").replace("&#039;", "'")
      let answers = shuffle(allAnswers)
      let embed = new MessageEmbed()
      .setTitle("Category: __`" + body["results"][0]["category"] + "`__")
      .setColor(0xffee00)
      .setDescription("Difficulty: **"+ String(body["results"][0]["difficulty"])+ "**\n")
      .addField(q, "a) " + answers[0] + "\nb) "  + answers[1] + "\nc) "  + answers[2] + "\nd) " + answers[3])
      .setTimestamp()
      .setFooter("SankOBot", message.client.user.displayAvatarURL)
      message.channel.send(embed)
      message.channel.send("You have `10` seconds to answer, with either `a`, `b`, `c`, or `d`.").then(mymsg => {
      
      //wait for reply
      let filter = m => m.author.id === message.author.id
      message.channel.awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
        .then( recieved => {
        let con = recieved.first().content;
        if (con.startsWith("a")) {
          if (answers[0] === body["results"][0]["correct_answer"]) {message.channel.send(":white_check_mark: Correct!")}
          else {message.channel.send(":negative_squared_cross_mark: Incorrect answer. The correct answer was `" + body["results"][0]["correct_answer"] + "`.")}
        } else if (con.startsWith("b")) {
          if (answers[1] === body["results"][0]["correct_answer"]) {message.channel.send(":white_check_mark: Correct!")}
          else {message.channel.send(":negative_squared_cross_mark: Incorrect answer. The correct answer was `" + body["results"][0]["correct_answer"] + "`.")}
        } else if (con.startsWith("c")) {
          if (answers[2] === body["results"][0]["correct_answer"]) {message.channel.send(":white_check_mark: Correct!")}
          else {message.channel.send(":negative_squared_cross_mark: Incorrect answer. The correct answer was `" + body["results"][0]["correct_answer"] + "`.")}
        } else if (con.startsWith("d")) {
          if (answers[3] === body["results"][0]["correct_answer"]) {message.channel.send(":white_check_mark: Correct!")}
          else {message.channel.send(":negative_squared_cross_mark: Incorrect answer. The correct answer was `" + body["results"][0]["correct_answer"] + "`.")}
        } else {
          message.channel.send("Aborted trivia...")
        }
        mymsg.delete()
      })
        .catch(collected => {mymsg.edit("You didn't answer in time");});
      })
    })
  }
}
