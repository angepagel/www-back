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
app.get('/api/posts/:id', database.getPost);
app.post('/api/posts', database.createPost);
app.post('/api/posts/:id', database.updatePost);
app.delete('/api/posts/:id', database.deletePost);
app.post('/api/login', database.login);

module.exports = app;
