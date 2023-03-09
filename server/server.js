const express = require('express');
const app = express();

const port = 3000;

// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});