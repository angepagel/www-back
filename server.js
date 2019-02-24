const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

app.use(cors());

app.listen(process.env.PORT);

module.exports = app;
