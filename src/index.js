const { Client, Events, GatewayIntentBits, SlashCommandBuilder ,EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
require("dotenv").config();

const fs = require('fs');
const questionsData = require('../questions_by_difficulty.json');
const problemsData = require('../Problems.json');

function getRandomQuestion(difficulty) {
    const difficultyKey = `${difficulty}Questions`; // e.g., 'easyQuestions', 'mediumQuestions'
    const questions = questionsData[difficultyKey];

    if (!questions || questions.length === 0) {
        console.log(`No questions found for difficulty: ${difficulty}`);
        return null;
    }

    // Select a random question ID
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

function getQuestionDetails(randomQuestionId) {
    const question = problemsData.problemsetQuestionList.find(
        (q) => q.questionFrontendId === randomQuestionId
    );

    if (!question) {
        console.log(`Question with ID ${randomQuestionId} not found.`);
        return null;
    }

    return question;
}



client.on(Events.ClientReady, (x) => {
    console.log(`${x.user.tag} is ready!!`);
    client.user.setActivity("Ready To Code");
})

client.on("messageCreate", function (msg) {
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

    if (interaction.commandName === 'gimme') {
        let diff = interaction.options.get('difficulty').value;
        if (!diff) {
            await interaction.reply('Please provide a valid difficulty.');
            return;
        }
        const randomQuestionId = getRandomQuestion(diff);
        const questionDetails = getQuestionDetails(randomQuestionId);
        try {
            console.log(questionDetails);
            const difficultyColors = {
                easy: '#00FF7F', // Green for Easy
                medium: '#FFA500', // Orange for Medium
                hard: '#FF4500', // Red for Hard
            };
            questionLink = 'https://leetcode.com/problems/' + questionDetails.titleSlug
            const embed = new EmbedBuilder()
                .setColor(difficultyColors[diff] || '#5865F2') // Default color for unknown difficulties
                .setTitle(`🌟 ${diff} LeetCode Question 🌟`)
                .setDescription(`Sharpen your coding skills by solving the problem!`)
                .addFields(
                    { name: '🔗 Problem', value: `[${questionDetails.title}](${questionLink})`, inline: false },
                    { name: '⚙️ Difficulty', value: `**${diff}**`, inline: true }
                )
                .setThumbnail('https://cdn.iconscout.com/icon/free/png-512/free-leetcode-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-2944960.png?f=webp&w=256') // Optional: LeetCode logo or another relevant image
                .setFooter({ text: 'Happy coding! 🚀', iconURL: 'https://example.com/footer-icon.png' }) // Replace with actual URL if needed
                .setTimestamp(); // Adds the current timestamp to the embed

            await interaction.reply({ embeds: [embed] });

        }
        catch (error) {
            console.error(error);
            await interaction.reply(
                'Failed to fetch data. Please try again later or check the username.'
            );
        }
    }

    if (interaction.commandName === 'solved') {
        let uName = interaction.options.get('username').value;
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

            const difficultyColors = {
                Easy: '#00FF7F', // Green for Easy
                Medium: '#FFA500', // Orange for Medium
                Hard: '#FF4500', // Red for Hard
            };
            const embed = new EmbedBuilder()
                .setColor(difficultyColors[data.difficulty] || '#5865F2') // Default color for unknown difficulties
                .setTitle('🌟 Daily LeetCode Question 🌟')
                .setDescription(`Sharpen your coding skills by solving today's problem!`)
                .addFields(
                    { name: '🔗 Problem', value: `[${data.questionTitle}](${data.questionLink})`, inline: false },
                    { name: '📅 Date', value: data.date, inline: true },
                    { name: '⚙️ Difficulty', value: `**${data.difficulty}**`, inline: true }
                )
                .setThumbnail('https://cdn.iconscout.com/icon/free/png-512/free-leetcode-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-2944960.png?f=webp&w=256') // Optional: LeetCode logo or another relevant image
                .setFooter({ text: 'Happy coding! 🚀', iconURL: 'https://example.com/footer-icon.png' }) // Replace with actual URL if needed
                .setTimestamp(); // Adds the current timestamp to the embed

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(
                'Failed to fetch data. Please try again later or check the username.'
            );
        }
    }

});

client.login(process.env.TOKEN);