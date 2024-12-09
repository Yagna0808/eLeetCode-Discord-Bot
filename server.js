// Import Express
const express = require('express');

// Create an Express app
const app = express();

// Define the port
const PORT = 80;

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
