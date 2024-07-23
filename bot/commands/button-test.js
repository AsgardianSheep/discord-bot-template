const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Button test go brr"
    },
    ["execute"]: (client,sqliteDatabase,interaction,utilities) => {
        const actionRow = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
            .setCustomId(`${path.basename(path.dirname(path.dirname(__filename)))}/${path.basename(__filename).split(".")[0]}/test`)
            .setLabel("Yes")
            .setStyle(discord.ButtonStyle.Primary)
        );
        
        interaction.channel.createMessageComponentCollector().on("collect",async (component) => {
            try {
                await component.deferUpdate();
                interaction.channel.send(component.customId);
            } catch {}
        });
        
        interaction.reply({
            ["components"]: [actionRow]
        });
    }
};