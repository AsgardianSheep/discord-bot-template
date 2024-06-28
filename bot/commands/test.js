const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Test go brr",
        ["options"]: [
            {
                ["name"]: "option1",
                ["description"]: "Option one",
                ["type"]: discord.ApplicationCommandOptionType.String,
                ["required"]: true
            },
            {
                ["name"]: "option2",
                ["description"]: "Option two",
                ["type"]: discord.ApplicationCommandOptionType.String
            }
        ]
    },
    ["execute"]: (client,sqliteDatabase,interaction) => {         
        if (!interaction.options.get("option2")) {
            interaction.reply(interaction.options.get("option1").value);
        } else {
            interaction.reply(`${interaction.options.get("option1").value} ${interaction.options.get("option2").value}`);
        }
    }
};