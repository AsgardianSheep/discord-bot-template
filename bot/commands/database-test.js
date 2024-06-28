const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Database test go brr",
        ["options"]: [
            {
                ["name"]: "operation",
                ["description"]: "The action to preform",
                ["type"]: discord.ApplicationCommandOptionType.String,
                ["required"]: true,
                ["choices"]: [
                    {
                        ["name"]: "create",
                        ["value"]: "create"
                    },
                    {
                        ["name"]: "update",
                        ["value"]: "update"
                    },
                    {
                        ["name"]: "get",
                        ["value"]: "get"
                    }
                ]
            },
            {
                ["name"]: "id",
                ["description"]: "Row id",
                ["type"]: discord.ApplicationCommandOptionType.Integer
            },
            {
                ["name"]: "text",
                ["description"]: "Message to save",
                ["type"]: discord.ApplicationCommandOptionType.String
            }
        ]
    },
    ["execute"]: (client,sqliteDatabase,interaction) => {
        const tableName = "test";
        const testDatabase = sqliteDatabase(__dirname,path.basename(__filename).split(".")[0]);
        
        testDatabase.serialize(() => {
            testDatabase.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INT,text TEXT)`);
            
            const returnRows = () => {
                testDatabase.all(`SELECT * FROM ${tableName}`,(error,result) => {
                    interaction.reply(JSON.stringify(result,null,5));
                });
            };
            
            if (interaction.options.get("operation").value === "create") {
                if ((interaction.options.get("id").value && interaction.options.get("text").value) !== null) {
                    const rows = [
                        [
                            interaction.options.get("id").value,
                            interaction.options.get("text").value
                        ]
                    ];
                    
                    testDatabase.run(`INSERT INTO ${tableName} VALUES ${testDatabase.arrayToRows(rows)}`);
                    returnRows();
                }
            }
            
            if (interaction.options.get("operation").value === "update") {
                if ((interaction.options.get("id").value && interaction.options.get("text").value) !== null) {
                    testDatabase.run(`UPDATE ${tableName} SET text='${interaction.options.get("text").value}' WHERE id=${interaction.options.get("id").value}`);
                    returnRows();
                }
            }
            
            if (interaction.options.get("operation").value === "get") {
                returnRows();
            }
        });
    }
};