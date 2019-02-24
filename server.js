const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const database = require('./database');
const app = express();

app.use(cors());

app.listen(process.env.PORT);

app.get('/api/users', database.getAllUsers);

module.exports = app;
