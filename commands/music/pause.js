const { MessageEmbed } = require("discord.js");
const config = require("C:/Users/kkanc/Beano/config.json");

module.exports = {
  name: "pause",
  category: "Music", 
  description: "Beano pauses the music",
  usage: "pause",
  run: async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "You must Join a voice channel before using this command!"
    );
  let queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: There are no songs playing in this server")
        .setColor(config.embedColor)
    );
  if (queue.playing == false)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: The song is already paused")
        .setColor(config.embedColor)
    );
  queue.connection.dispatcher.pause();
  message.react("⏸");
  queue.playing = false;
  return message.channel.send(
    new MessageEmbed()
    .setDescription("**Paused the music :white_check_mark: **")
    .setColor(config.embedColor)
  );
}
}
