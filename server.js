const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const multer = require('multer');
const serveStatic = require('serve-static')
const dotenv = require('dotenv').config();
const database = require('./database');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/uploads', serveStatic(`${__dirname}/uploads`));

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});

app.get('/api/users', database.getAllUsers);
app.get('/api/posts', database.getAllPosts);
app.get('/api/posts/:id', database.getPost);
app.get('/api/latestpost', database.getLatestPost);
app.post('/api/posts', database.createPost);
app.post('/api/posts/:id', database.updatePost);
app.delete('/api/posts/:id', database.deletePost);
app.post('/api/login', database.login);
app.post('/api/upload', upload.array('files'), database.upload);

module.exports = app;
