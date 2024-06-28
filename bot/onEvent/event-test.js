const discord = require("discord.js");

module.exports = (client,sqliteDatabase) => {
    client.on(discord.Events.ClientReady,(message) => {
        console.log("Funni event go brr");
    });
};