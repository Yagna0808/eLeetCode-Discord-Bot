const { Client, Events, GatewayIntentBits, SlashCommandBuilder ,EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
require("dotenv").config();


client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!!`);
    client.user.setActivity("Ready To Code");

    // const ping = new SlashCommandBuilder()
    //     .setName('pings')
    //     .setDescription('This is a ping command!');
    
    // client.application.commands.create(ping);
})

client.on("messageCreate", function (msg) {
    console.log(msg.content);

    if (msg.content === "ping") {
        msg.reply("pong!");
        console.log("pong-ed " + msg.author.username);
    }
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'hey') {
        interaction.reply('Hello!!');
    }

    if (interaction.commandName === 'solved') {
        let uName = interaction.options.get('username').value;
        // console.log(uName)
        if (!uName) {
            await interaction.reply('Please provide a valid username.');
            return;
        }
        const apiUrl = `https://alfa-leetcode-api.onrender.com/${uName}/solved`;
        const apiUrlUser = `https://alfa-leetcode-api.onrender.com/${uName}`;

        console.log(apiUrl)
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            const response_user = await fetch(apiUrlUser);
            if (!response_user.ok) {
                throw new Error(`API error: ${response_user.statusText}`);
            }

            const data = await response.json();
            const dataUser = await response_user.json();

            console.log(data)
            console.log(dataUser)
            // console.log(data.solvedProblem)

            const totalSolved = data.solvedProblem;
            const totalProblems = 3373;
            const easySolved = data.easySolved;
            const easyTotal = 840;
            const mediumSolved = data.mediumSolved;
            const mediumTotal = 1762;
            const hardSolved = data.hardSolved;
            const hardTotal = 771;
            const avatar_link = dataUser.avatar;
            console.log(totalSolved, easySolved, mediumSolved,hardSolved,avatar_link)
            
            const embed = new EmbedBuilder()
                .setColor('#00FF7F') // A pleasant green color
                .setTitle('Your Problem Solving Stats')
                .setDescription('Here is an overview of your problem-solving progress:')
                .addFields(
                    { name: '💡 **Total Solved**', value: `**${totalSolved}** / ${totalProblems}`, inline: false },
                    { name: '🟢 **Easy**', value: `**${easySolved}** / ${easyTotal}`, inline: true },
                    { name: '🟠 **Medium**', value: `**${mediumSolved}** / ${mediumTotal}`, inline: true },
                    { name: '🔴 **Hard**', value: `**${hardSolved}** / ${hardTotal}`, inline: true }
                )
                .setFooter({ text: 'Keep up the great work! 💪', iconURL: 'https://64.media.tumblr.com/eb9198d0964f22c050097e32b9155732/3c2a84734d55fd33-db/s1280x1920/7368de1ba606627f0a17477b98cd4f1f271118fe.png' }) // Add an optional footer
                .setThumbnail(avatar_link) // Replace with a suitable image URL
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(
                'Failed to fetch data. Please try again later or check the username.'
            );
        }
    }

    if (interaction.commandName === 'daily_problem') {
        const apiUrl = `https://alfa-leetcode-api.onrender.com/daily`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data)
            const questionLink = data.questionLink || 'Link not available';
            console.log(`The question link is: ${questionLink}`);

            await interaction.reply(
                `🌟 **Daily LeetCode Question** 🌟\n\n` +
                `🔗 **[${data.questionTitle}](${data.questionLink})**\n` +
                `📅 **Date**: ${data.date}\n` +
                `⚙️ **Difficulty**: ${data.difficulty}\n\n` +
                `Solve this exciting problem and enhance your coding skills!`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply(
                'Failed to fetch data. Please try again later or check the username.'
            );
        }
    }
});

client.login(process.env.TOKEN);