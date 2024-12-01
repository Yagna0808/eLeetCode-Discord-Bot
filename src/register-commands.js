require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Says hello',
        options: [
        ],
    },
    {
        name: 'solved',
        description: 'It provides a summary of a users problem- solving statistics on LeetCode',
        options: [
            {
                name: 'username',
                description: 'Write Your Username Here',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: 'daily_problem',
        description: 'To get a daily problem',
        options: [
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();