const Discord = require('discord.js');
const config = require('../../config.json');
const git = require("simple-git");
const {execSync} = require('child_process');
module.exports = {
    name: 'pull',
    category: 'moderation',
    description: 'Beano will pull changes from the Github repo.',
    usage: `${config.prefix}pull`,
    run: async (client, message, args) => {
        if(message.author.id !== config.neesh){
            return;
        }
        await message.reply("Pulling git changes and restarting bot.");
        client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("Pulling changes...");
        git().pull('origin', 'master', {}, async (err, result) => {
            if (result.summary.changes === 0 && result.summary.insertions === 0 && result.summary.deletions === 0) {
                await client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("The bot is up to date.");
            } else {
                await client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("**Changes: **" + result.summary.changes + "\n" +
                    "**Insertions: **" + result.summary.insertions + "\n" +
                    "**Deletions: **" + result.summary.deletions);
                if (result.insertions.hasOwnProperty("package.json") || result.insertions.hasOwnProperty("package-lock.json")) {
                    await client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("It seems the bot dependencies have changed, performing dependency update...");
                    await execSync('npm install');
                    await client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("Dependency update complete!");
                }
                await client.guilds.cache.get(config.AC).channels.cache.get(config.logs).send("Restarting...");
                process.exit(0);
            }
        });
    },
};