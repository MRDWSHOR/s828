
const Discord = require('discord.js');
const client = new Discord.Client();
const TicTacToe = require("./tictactoe.js")
var games = [];

async function msg_challenge(message){
    let prefix = message.content.toLowerCase().split('ttt')[0]
    let p1 = message.author

    for (var g = 0; g < games.length; g++){
        if (games[g].players.includes(p1)){
            message.channel.send('You are already in a game.')
            return
        }
    }

    message.channel.send(`\`${message.member.displayName}\` has created a tic tac toe game. To join this game, use \`${prefix}ttt join\`.`)
    
    let filter = m => m.content.startsWith(prefix + "ttt join")
    let msg = message.channel.awaitMessages(filter, {max: 1})
      .then(collected => {
        let mesg = collected.first()
        let p2 = mesg.author
    
        if (p2 == p1){
          message.channel.send('Can\'t play against yourself.')
          return
        }
        for (var g = 0; g < games.length; g++){
          if (games[g].players.includes(p2)){
            message.channel.send('You are already in a game.')
            return
          }
        }
      
        if (msg == null){
          message.channel.send("The tictactoe game has been cancelled.")}
      else{
        let game = new TicTacToe([p1, p2])
        game.start(client, message).then( a=> {games.push(game)})
      }
        
      })
    .catch(collected => {message.channel.send("Error with TicTacToe game. Report this error to SankOBot Help server: ```fix\n" + collected + "```http://discord.gg/GTFAzCy")})
}

async function msg_move(message){
    let prefix = message.content.toLowerCase().split('ttt')[0]
    for (var i = 0; i < games.length; i++){
        let g = games[i]
        if (message.author == g.get_whose_turn()){
            await g.make_move(client, message, prefix)

            if (g.is_over()){
                delete games[i]
            }
            break
    }
    }
}

async function msg_redraw(message){
    for (var g = 0; g < games.length; g++){
        if (message.author in g.players){
            print('Redrawing ' + String(g))
            await g.draw(client, message)
            break
        }
    }
}

async function msg_quit(message){
    for (var i = 0; i < games.length; i++){
        if (message.author in games[i].players){
            print('Killing game ' + String(games[i]))
            message.channel.send('Destroyed game: ' + String(games[i]))
            delete games[i]
            return
        }
    await message.channel.send('You are not in any game.')
    }
}
async function msg_games(message){
    if (games.length == 0){
        await message.channel.send('No games currently on.')
        return
    }
    
    let t = 'Printing all games out of ' + String(games.length) + ':\n'
    for (var g = 0; g < games.length; g++){
        t += '- ' + String(g)
    }
    await message.channel.send(t)
}



module.exports = {
  msg_challenge: function(m) {msg_challenge(m)},
  msg_move: function(m) {msg_move(m)},
  msg_redraw: function(m) {msg_redraw(m)},
  msg_games: function(m) {msg_games(m)},
  msg_quit: function(m) {msg_quit(m)}
}

client.login(process.env.TOKEN);