const discord = require("discord.js");

module.exports = (client,sqliteDatabase,utilities) => {
    client.on(discord.Events.ClientReady,() => {
        console.log("Funni event go brr");
    });
};