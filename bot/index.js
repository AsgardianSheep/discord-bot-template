const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const sqlite = require("sqlite3");
const token = "";
const userId = "";

const client = new discord.Client({
	intents: [
		discord.IntentsBitField.Flags.Guilds,
		discord.IntentsBitField.Flags.GuildMembers,
		discord.IntentsBitField.Flags.GuildMessages,
		discord.IntentsBitField.Flags.MessageContent,
		discord.IntentsBitField.Flags.GuildPresences,
		discord.IntentsBitField.Flags.GuildModeration
	]
});

let commands = [];

for (const file of fs.readdirSync(`${__dirname}/commands`)) {
	commands.push(require(`${__dirname}/commands/${file}`).command);
}

new discord.REST({version: 10}).setToken(token).put(
	discord.Routes.applicationCommands(userId),
	{
		body: commands
	}
);

function sqliteDatabase(fileDirectory,databaseName) {
	const databasePath = `${__dirname}/database${fileDirectory.replace(__dirname,"")}/${databaseName}.db`;
	
	if (!fs.existsSync(databasePath.replaceAll(`/${databaseName}.db`,""))) {
		fs.mkdirSync(path.dirname(databasePath),{recursive: true});
	}
    
	let database = new sqlite.Database(databasePath);
	
	database.arrayToRows = (array) => {
		let values = "";
		
		for (const row of array) {
			let rowString = "";
			
			for (const element of row) {
				if (typeof(element) === "string") {
					rowString += `'${element.replaceAll("'","<u0027>")}',`;
				} else {
					rowString += `${element},`;
				}
			}
			
			values += `(${rowString.slice(0,-1)}),`;
		}
		
		return values.slice(0,-1);
	};
	
	database.formatJsonInRows = (rows) => {
		let formattedRows = rows;
		
		const formatRow = (dictionary) => {
			for (const key of Object.keys(dictionary)) {
				if (typeof(dictionary[key]) === "string") {
					if (!dictionary[key].match("^[0-9]+$")) {
						try {
							dictionary[key] = JSON.parse(dictionary[key].replaceAll("<u0027>","'"));
						} catch {}
					}
				}
			}
		};
		
		if (Array.isArray(formattedRows)) {
			for (const dictionary of formattedRows) {
				formatRow(dictionary);
			}
		} else {
			formatRow(formattedRows);
		}
		
		return formattedRows;
	};

	database.jsonToValue = (json) => {
		return `'${JSON.stringify(json).replaceAll("'","<u0027>")}'`;
	}
	
	return database;
}

for (const file of fs.readdirSync(`${__dirname}/onEvent`)) {
	require(`${__dirname}/onEvent/${file}`)(client,sqliteDatabase);
}

client.on(discord.Events.InteractionCreate,(interaction) => {
	if (interaction.isChatInputCommand()) {
		require(`${__dirname}/commands/${interaction.commandName}`).execute(client,sqliteDatabase,interaction);
	}
});

client.on(discord.Events.ClientReady,() => {
	function setStatus() {
		client.user.setActivity(`Used in ${Array.from(client.guilds.cache.entries()).length} servers`,{type: discord.ActivityType.Custom});
	}
	
	setStatus();
	setInterval(setStatus,10000);
});

client.login(token);