const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const database = require('./database');
const app = express();

app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});

app.get('/api/users', database.getAllUsers);
app.get('/api/posts', database.getAllPosts);

module.exports = app;
