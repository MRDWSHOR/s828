const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
var request = require('request').defaults({ encoding: null });
const Chess = require('chess.js').Chess;



function why(channelId) {
  request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/chess.json`, json: true},function(er, f, chessGames){
    let b = chessGames[channelId]["board"];
    if (b.in_checkmate()) {return 0;};
    if (b.in_draw()) {return 1;};
    if (b.in_stalemate()) {return 1;};
    if (b.in_threefold_repetition()) {return 1;};
  })
};

function upload(c) {
  request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/cupload.json?new=${encodeURIComponent(JSON.stringify(c))}`, json: true},function(er, f, body){})
}

function aiMove(message) {
  request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/chess.json`, json: true},function(er, f, chessGames){
    
    let available = chessGames[message.channel.id]["board"].moves();
  let choice = Math.floor(Math.random() * (available.length));
  let chosenMove = available[choice];
  var move = chessGames[message.channel.id]["board"].move(chosenMove);
    chessGames[message.channel.id].fen = chessGames[message.channel.id]["board"].fen()
  if (chessGames[message.channel.id]["board"].game_over()) {
    let answer = why(message.channel.id);
    if (answer === 1) {
      let p1 = message.client.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>
                                                                         message.channel.send("Draw: " +  message.author.tag + " vs " + p.tag + "."));
      } else if (answer === 0) {
        let p1 = message.client.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>
                                                                           message.channel.send("Win: " +  message.author.tag + " won against " + p.tag + "."));
        }
    delete chessGames[message.channel.id];
  } else {
    chessGames[message.channel.id]["next"] = "p1";
    let b = chessGames[message.channel.id]["board"].fen().split(" ")[0];
    let url = "http://www.fen-to-image.com/image/36/single/coords/" + b;
    request(url, function(err, response, buffer) {
      message.channel.send({ files: [{ attachment: buffer, name: 'Chessboard.png' }] });
    })
  }
  })
}



module.exports = class ChessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chess',
			aliases: [],
			group: 'fun',
			memberName: 'chess',
			description: 'Play Chess (Use command `chess help` for details.)',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    let bot = message.client;
    let sender = message.author;
    request({url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/chess.json`, json: true},function(er, f, chessGames){
    
    let args = (message.content.replace(prefix + "chess ", "")).split(' ');
    if (args.includes("help")) {
    
    let embed = new MessageEmbed()
        .setTitle("**Chess**")
        .setColor(0x170cfa)
        .setDescription("")
        .addField(prefix + "chess", "Start or join a game")
        .addField(prefix + "chess help", "Shows help on chess commands")
        .addField(prefix + "chess ai", "Play against an easy AI")
        .addField(prefix + "chess resign", "Resign from a game")
        .addField(prefix + "chess moves", "Shows a list of available moves")
        .addField(prefix + "chess turn", "Shows who's turn it is.")
        .addField(prefix + "chess board", "Shows the current game board.")
        .addField(prefix + "chess [move]", "Play your turn. (Ex, `" + prefix + "chess e4`)")
      message.channel.send({embed})
      return
    }
    
      if (chessGames[message.channel.id] === undefined) {
        if (!message.guild.me.permissionsIn(message.channel).has("ATTACH_FILES")) return message.channel.send("I don't have enoughe permissions to play chess.\nAsk a mod to give me the permissions to `Attach Files`.")
        message.channel.send("New chess game: `" + sender.username + "`. In `" + message.channel.name + "`. Use `" + prefix + "chess` to join. \n(Use `" + prefix + "chess ai` to play against me.)");
        chessGames[message.channel.id] = {p1: sender.id, p2: undefined, next: "p1", board: new Chess(), fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"};
        
      } 
    else if (chessGames[message.channel.id]["p2"] === undefined && chessGames[message.channel.id]["p1"] === sender.id && args.includes("ai")) {
      request("http://www.fen-to-image.com/image/36/single/coords/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", function(err, response, buffer) {
        message.channel.send("`" +  sender.username + "` is playing against `SankOBot`", { files: [{ attachment: buffer, name: 'Chessboard.png' }] })
      })
      chessGames[message.channel.id]["p2"] = "ai";
    }
    else if (chessGames[message.channel.id]["p2"] === undefined) {
        if (chessGames[message.channel.id]["p1"] !== sender.id) {
          let p1 = bot.users.fetch(chessGames[message.channel.id]["p1"]).then (p => {
            request("http://www.fen-to-image.com/image/36/single/coords/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", function(err, response, buffer) {
              message.channel.send("`" + sender.username + "` joined a chess game with `" + p.username + "`", { files: [{ attachment: buffer, name: 'Chessboard.png' }] })
            })
          })
          chessGames[message.channel.id]["p2"] = sender.id;
        } else {
          if (args.includes("resign")) {
            message.channel.send("Cancelled game.")
            delete chessGames[message.channel.id]
          } else {
            message.channel.send("Wait for someone to join your game with `" + prefix + "chess`");
          }
        }
      } else {
          chessGames[message.channel.id]["board"] = new Chess(chessGames[message.channel.id].fen)
          if (args.includes("board")) {
            let b = chessGames[message.channel.id]["board"].fen().split(" ")[0];
            let url = "http://www.fen-to-image.com/image/36/single/coords/" + b;
            request(url, function(err, response, buffer) {
              message.channel.send({ files: [{ attachment: buffer, name: 'Chessboard.png' }] })
            })
          } else if (args.includes("resign") || args.includes("quit")) {
              if (sender.id === chessGames[message.channel.id]["p1"]) {
                if (chessGames[message.channel.id]["p2"] === "ai") {
                  message.channel.send("`" + sender.username + "` has resigned. "); 
                  delete chessGames[message.channel.id];
                } else {
                  let p2 = bot.users.fetch(chessGames[message.channel.id]["p2"]).then (p => {
                  message.channel.send("`" + sender.username + "` has resigned. `" + p.username + "` has won.")});
                  delete chessGames[message.channel.id];
                }
              } else if (sender.id === chessGames[message.channel.id]["p2"]) {
                let p1 = bot.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>{
                message.channel.send("`" + sender.username + "` has resigned. `" + p.username + "` has won.")});
                delete chessGames[message.channel.id];
              };
          } else if (args.includes("moves")) {
            let available = chessGames[message.channel.id]["board"].moves()
            message.channel.send("Available moves:```fix\r\n" + available.join("\r\n") + "```")
          } else if (args.includes("turn")) {  
            if (chessGames[message.channel.id]["next"] === "p1") {
              let p1 = bot.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>
              message.channel.send("It is " +  p.username + "'s turn."))
            } else {
              let p2 = bot.users.fetch(chessGames[message.channel.id]["p2"]).then (p =>
              message.channel.send("It is `" +  p.username + "`'s turn."))}
          } else if (chessGames[message.channel.id]["next"] === "p1" && chessGames[message.channel.id]["p1"] === sender.id) {
            if (args.length > 2 || args.length === 0) {
              message.channel.send("Check syntax: `" + prefix + "chess [move]` (Ex, `" + prefix + "chess e4`)");
            } else {
              if (args.includes("move")) {
                return message.channel.send("Check syntax: `" + prefix + "chess [move]` (Ex, `" + prefix + "chess e4`)")}
              if (args.length === 1) {
                var move = chessGames[message.channel.id]["board"].move(args[0]);
              } else {
                var move = chessGames[message.channel.id]["board"].move({from:args[0], to:args[1]});
              };
              chessGames[message.channel.id].fen = chessGames[message.channel.id]["board"].fen()
              if (move === null ) {
                message.channel.send("Invalid move: `" + args.join(" ") + "`.")
              } else {
                if (chessGames[message.channel.id]["board"].game_over()) {
                  let answer = why(message.channel.id)
                  if (answer === 1) {
                    if (chessGames[message.channel.id]["p2"] === "ai") {message.channel.send("Draw: `" +  sender.username + "` vs `SankOBot`.")} else {
                      let p2 = bot.users.fetch(chessGames[message.channel.id]["p2"]).then (p =>
                      message.channel.send("Draw: `" +  sender.username + "` vs `" + p.username+ "`."))
                    }
                  } else if (answer === 0) {
                    if (chessGames[message.channel.id]["p2"] === "ai") {message.channel.send("Win: `" +  sender.username + "` won against `SankOBot`.")} else {
                      let p2 = bot.users.fetch(chessGames[message.channel.id]["p2"]).then (p =>
                      message.channel.send("Win: `" +  sender.username + "` won against `" + p.username+ "`."))
                    }
                  }
                  delete chessGames[message.channel.id];
                } else {
                  chessGames[message.channel.id]["next"] = "p2";
                  let b = chessGames[message.channel.id]["board"].fen().split(" ")[0];
                  let url = "http://www.fen-to-image.com/image/36/single/coords/" + b;
                  if (chessGames[message.channel.id]["p2"] === "ai") {
                    aiMove(message)
                  } else {
                    request(url, function(err, response, buffer) {
                      message.channel.send({ files: [{ attachment: buffer, name: 'Chessboard.png' }] })
                    })
                  }
                }
              }
            }
          } else if (chessGames[message.channel.id]["next"] === "p2" && chessGames[message.channel.id]["p2"] === sender.id) {
            if (args.length > 2 || args.length === 0) {
              message.channel.send("Check syntax: `" + prefix + "chess [move]` (Ex, `" + prefix + "chess e4`)");
            } else {
              if (args.includes("move")) {
                return message.channel.send("Check syntax: `" + prefix + "chess [move]` (Ex, `" + prefix + "chess e4`)")}
              if (args.length === 1) {
                var move = chessGames[message.channel.id]["board"].move(args[0]);
              } else {
                var move = chessGames[message.channel.id]["board"].move({from:args[0], to:args[1]});
              };
              chessGames[message.channel.id].fen = chessGames[message.channel.id]["board"].fen()
              if (move === null ) {
                message.channel.send("Invalid move: `" + args.join(" ") + "`.")
              } else {
                if (chessGames[message.channel.id]["board"].game_over()) {
                  let answer = why(message.channel.id)
                  if (answer === 1) {
                    let p1 = bot.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>
                    message.channel.send("Draw: " +  sender.tag + " vs " + p.tag + "."))
                  } else if (answer === 0) {
                    let p1 = bot.users.fetch(chessGames[message.channel.id]["p1"]).then (p =>
                    message.channel.send("Win: " +  sender.tag + " won against " + p.tag + "."))
                  }
                  delete chessGames[message.channel.id];
                } else {
                  chessGames[message.channel.id]["next"] = "p1";
                  let b = chessGames[message.channel.id]["board"].fen().split(" ")[0];
                  let url = "http://www.fen-to-image.com/image/36/single/coords/" + b;
                  request(url, function(err, response, buffer) {
                    message.channel.send({ files: [{ attachment: buffer, name: 'Chessboard.png' }] })
                  })
                }
              }
            }
        }
    }
        
        upload(chessGames)
    })
  }
}
