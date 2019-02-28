const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const database = require('./database');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});

app.get('/api/users', database.getAllUsers);
app.get('/api/posts', database.getAllPosts);
app.post('/api/login', database.login);

module.exports = app;
