const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
var Jimp = require("jimp");

module.exports = class ImageflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'imageflip',
			aliases: ["reverse", "imagereverse"],
			group: 'fun',
			memberName: 'imageflip',
			description: 'Flip an image',
			guarded: true
		});
	}

	async run(message) {
    let prefix
    if (!message.guild) prefix = "%"
    else prefix = message.guild.commandPrefix 
    try {message.delete()} catch(err) {}
    if (message.attachments.size >= 1) {
      if (message.attachments.size >= 2) {message.channel.send("Only attach one image.")} else {
        Jimp.read(message.attachments.first().url, function (err, image) {
          if (err) throw err;
          image.flip(true, false)
          image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) throw(err)
            message.channel.send("Your flipped image:", { files: [{ attachment: buffer, name: 'Flipped.png' }] })
          });
        });
      }
    } else {
      message.channel.send("Attach an image to flip.")
    }
  }
}
