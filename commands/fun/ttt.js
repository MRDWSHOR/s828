const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const TTT = require('../../ttt.js');

module.exports = class TttCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ttt',
			aliases: [],
			group: 'fun',
			memberName: 'ttt',
			description: 'Play Tic Tac Toe (Use command `ttt help` for details.)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let msg = message.content.toLowerCase()
    
    if (msg === prefix + 'ttt') {TTT.msg_challenge(message)}
    if (msg.startsWith(prefix + 'ttt move')) {TTT.msg_move(message)}
    if (msg.startsWith(prefix + 'ttt board')) {TTT.msg_redraw(message)}
    if (msg.startsWith(prefix + 'ttt quit')) {TTT.msg_quit(message)}
    if (msg.startsWith(prefix + 'ttt games')) {TTT.msg_games(message)}
    if (msg.startsWith(prefix + 'ttt help')) {
    let embed = new MessageEmbed()
        .setTitle("**TicTacToe**")
        .setColor(0xe50404)
        .setDescription("")
        .addField(prefix + "ttt", "Start a game of tictactoe.")
        .addField(prefix + "ttt help", "Shows help on tic-tca-toe commands")
        .addField(prefix + "ttt join", "Join a game of tictactoe.")
        .addField(prefix + "ttt move [x]", "Play your turn ([x] is a number `1-9`.)")
        .addField(prefix + "ttt resign", "Resign from the game of tictactoe.")
        .addField(prefix + "ttt board", "Shows the tictactoe board.")
        .addField(prefix + "ttt games", "Shows a list of tictactoe boards.")
    message.channel.send({embed})
    }
  }
}
