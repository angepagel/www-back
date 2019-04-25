const config = require('./config');
const services = require('./services');
const database = require('./database');
const path = require('path');
const fs = require('fs');


async function getPost(req, res, next) {
  const id = parseInt(req.params.id);

  try {
    const post = await database.getPost(id);
    res.json({ data: post });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function getAllPosts(req, res, next) {
  try {
    const posts = await database.getAllPosts();
    res.json({ data: posts });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function getLatestPost(req, res, next) {
  try {
    const posts = await database.getAllPosts();
    res.json({ data: posts[0] });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function createPost(req, res, next) {
  const { category, title, body, image, img_credit } = req.body;

  try {
    await database.createPost(category, title, body, image, img_credit);
    res.json({ apicode: 'post_created' });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function updatePost(req, res, next) {
  const id = parseInt(req.params.id);
  const { category, title, body, image, img_credit } = req.body;

  try {
    await database.updatePost(id, category, title, body, image, img_credit);
    res.json({ apicode: 'post_updated' });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function deletePost(req, res, next) {
  const id = parseInt(req.params.id);

  try {
    await database.deletePost(id);
    res.json({ apicode: 'post_deleted' });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    if (await services.authenticate(username, password)) {
      const token = services.generateToken(username);
      res.json({
        apicode: 'successful_login',
        token: token
      });
    }
    else res.json({ apicode: 'bad_credentials' });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

function upload(req, res, next) {
  let urls = [];

  try {
    req.files.forEach(file => urls.push(`http://${config.HOST}:${config.PORT}/uploads/${file.originalname}`))
    res.json({
      apicode: 'files_uploaded',
      urls: urls
    });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

function getUploads(req, res, next) {
  const dirPath = path.join(__dirname, 'uploads');

  try {
    fs.readdir(dirPath, (error, fileNames) => {
      if (error) throw error;

      let files = [];
      fileNames.map((fileName) => {
        const mtime = fs.statSync(`${dirPath}/${fileName}`).mtime.getTime();
        const date = new Date(mtime);
        files.push({
          fileName: fileName,
          date: date
        })
      });

      res.json({ data: files });
    });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}

function deleteUpload(req, res, next) {
  const { fileName } = req.body;

  try {
    fs.unlinkSync(`./uploads/${fileName}`);
    res.json({ apicode: 'file_deleted' });
  }
  catch(error) {
    console.error(error.message);
    next(error);
  }
}


module.exports = {
  getAllPosts,
  getPost,
  getLatestPost,
  createPost,
  updatePost,
  deletePost,
  login,
  upload,
  getUploads,
  deleteUpload
}
