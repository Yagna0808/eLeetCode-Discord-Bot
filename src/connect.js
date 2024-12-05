const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI
const uri = process.env.MONGODB

// Define the schema
const guildSchema = new mongoose.Schema({
    guildUsers: {
        type: Map,
        of: [String], // Values are arrays of strings (usernames)
        default: new Map(), // Initialize as an empty Map
    },
});

// Create the model
const Guild = mongoose.model('Guild', guildSchema);

// MongoDB connection
async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, { dbName: 'eLeetCode-Discord-Bot' });
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

// Insert or update a guild's data
async function upsertGuildData() {
    try {
        const guildId = '808608660170735667'; // Your guildId
        const usernames = ['yagna08', 'Deval135', 'prujul14']; // Usernames for the guild

        // Find the document that holds the Map
        let guild = await Guild.findOne();

        if (!guild) {
            // If no document exists, create one
            guild = new Guild();
        }

        // Add or update the guildId with its usernames
        guild.guildUsers.set(guildId, usernames);

        // Save the updated document
        await guild.save();
        console.log('Guild data inserted/updated successfully!');
    } catch (error) {
        console.error('Error inserting/updating guild data:', error.message);
    }
}

// Run the operations
async function main() {
    await connectToMongoDB();
    await upsertGuildData();
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
}

main();
