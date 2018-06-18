const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const Duels = require('../../arrays/duel.js');

module.exports = class DuelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'duel',
			aliases: ['fight', 'attack'],
			group: 'fun',
			memberName: 'duel',
			description: 'Challenge someone to a duel',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    if (message.mentions.members.size !== 1) {
      return message.channel.send("Mention **1** person to duel. (Ex. %duel <@" + message.author.id + ">)")
  }
    let person1 = message.member;
    let person2 = message.mentions.members.first();
    if (person2 === person1) return message.channel.send("You cannot duel yourself.")
    if (person2.user.bot) {
      //against bot
      let duels = Duels.duel;
        let counter = 3;
        let fight = "";
        let points1 = 0;
        let points2 = 0;
        while (counter > 0) {
          counter -= 1
          let choice = Math.floor((Math.random() * 2) + 1);
          let chosen, notChosen;
          if (choice == 1) {chosen = person1; notChosen = person2; points1+= 1;}
          else {chosen = person2; notChosen = person1; points2 += 1}
          let randomOne = Math.floor(Math.random() * (duels.length - 1));
          //put into
          fight = fight + (duels[randomOne].replace("[a]", "`" + chosen.displayName + "`").replace("[b]", "`" + notChosen.displayName + "`")) + "\n";
          duels.splice(randomOne, 1)
        }
        message.channel.send(fight)
        if (points1 > points2) {message.channel.send("Winner: " + person1.displayName)}
        else if (points2 > points1) {message.channel.send("Winner: " + person2.displayName)}
        else {message.channel.send("Draw!")}
      //end of duel against bot
    } else {
    //Let's get permission from person2
    message.channel.send(`<@${person2.user.id}>. You have ` + "`15` seconds to accept the duel. (`" + prefix + "accept`)")
    let filter = m => (m.member == person2);
    message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
      .then(collected =>
            {
      if (
        collected.first().content !== prefix + "accept" &&
        collected.first().content !== prefix + "yes" &&
        collected.first().content !== "yes" &&
        collected.first().content !== "y" &&
        collected.first().content !== "accept"
      )
        return message.channel.send("Duel declined by `" + person2.displayName + "`.")
      else {
        let duels = Duels.duel;
        let counter = 3;
        let fight = "";
        let points1 = 0;
        let points2 = 0;
        while (counter > 0) {
          counter -= 1
          let choice = Math.floor((Math.random() * 2) + 1);
          let chosen, notChosen;
          if (choice == 1) {chosen = person1; notChosen = person2; points1+= 1;}
          else {chosen = person2; notChosen = person1; points2 += 1}
          let randomOne = Math.floor(Math.random() * (duels.length - 1));
          //put into
          fight = fight + (duels[randomOne].replace("[a]", "`" + chosen.displayName + "`").replace("[b]", "`" + notChosen.displayName + "`")) + "\n";
          duels.splice(randomOne, 1)
        }
        message.channel.send(fight)
        if (points1 > points2) {message.channel.send("Winner: " + person1.displayName)}
        else if (points2 > points1) {message.channel.send("Winner: " + person2.displayName)}
        else {message.channel.send("Draw!")}
      }
    })
      .catch(collected => {console.log(collected); message.channel.send("Duel cancelled. `" + person2.displayName + "` didn't respond in time.")})
  }
  }
}
