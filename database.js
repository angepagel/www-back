const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

const database = pgp(config);


function getAllUsers(req, res, next) {
  database.any("SELECT id, username FROM users")
    .then(data => {
      res.json({
        data: data,
        message: 'Retrieved all users'
      })
    })
    .catch(
      error => console.error(error)
    );
}


function getPost(req, res, next) {
  let postID = parseInt(req.params.id);

  database.one("SELECT id, category, title, image, img_credit, body, date, TO_CHAR(date, 'dd Month yyyy') as datestr FROM posts WHERE id = $1", [postID])
    .then(data => {
      res.json({
        data: data,
        message: 'Retrieved one blog post'
      })
    })
    .catch(
      error => console.error(error)
    );
}


function getAllPosts(req, res, next) {
  database.any("SELECT id, category, title, image, img_credit, body, date, TO_CHAR(date, 'dd Month yyyy') as datestr FROM posts ORDER BY date DESC")
    .then(data => {
      res.json({
        data: data,
        message: 'Retrieved all blog posts'
      })
    })
    .catch(
      error => console.error(error)
    );
}


function getLatestPost(req, res, next) {
  database.one("SELECT id, category, title, image, img_credit, body, date, TO_CHAR(date, 'dd Month yyyy') as datestr FROM posts ORDER BY date DESC LIMIT 1")
    .then(data => {
      res.json({
        data: data,
        message: 'Retrieved latest blog post'
      })
    })
    .catch(
      error => console.error(error)
    );
}


function createPost(req, res, next) {
  const { category, title, body, image, img_credit } = req.body;

  database.none("INSERT INTO posts (author, category, title, body, image, img_credit, date) VALUES (1, $1, $2, $3, $4, $5, NOW())", [category, title, body, image, img_credit])
    .then(() => {
      res.json({
        apicode: 'post_created'
      })
    })
    .catch(
      error => console.error(error)
    );
}


function updatePost(req, res, next) {
  const postID = parseInt(req.params.id);
  const { category, title, body, image, img_credit } = req.body;

  database.none("UPDATE posts SET category=$1, title=$2, body=$3, image=$4, img_credit=$5 WHERE id=$6", [category, title, body, image, img_credit, postID])
    .then(() => {
      res.json({
        apicode: 'post_updated'
      })
    })
    .catch(
      error => console.error(error)
    );
}

function deletePost(req, res, next) {
  const postID = parseInt(req.params.id);

  database.none("DELETE FROM posts WHERE id=$1", [postID])
    .then(() => {
      res.json({
        apicode: 'post_deleted'
      })
    })
    .catch(
      error => console.error(error)
    );
}

async function userExists(username) {
  let user = null;

  try {
    user = await database.oneOrNone("SELECT id, username, password FROM users WHERE username LIKE $1", [username]);
  }
  catch(error) {
    console.error(error);
  }

  return user;
}

async function authenticate(username, password) {
  let auth = false;

  try {
    const user = await userExists(username);

    if (user !== null) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        auth = true;
      }
    }
  }
  catch(error) {
    console.error(error);
  }

  return auth;
}

async function login(req, res, next) {

  try {
    const { username, password } = req.body;

    if (await authenticate(username, password)) {
      const token = jwt.sign(
        { username: username },
        process.env.JWT_SECRET,
        {
          algorithm: process.env.JWT_ALGORITHM,
          expiresIn: process.env.JWT_EXPIRATION
        }
      );
      res.json({
        apicode: 'successful_login',
        token: token
      })
    }
    else {
      res.json({
        apicode: 'bad_credentials'
      })
    }
  }
  catch(error) {
    console.error(error);
  }

}

function upload(req, res, next) {
  let urls = [];

  req.files.forEach(file => {
    urls.push(`${process.env.PROTOCOL}://${process.env.SERVER_NAME}:${process.env.PORT}/uploads/${file.originalname}`);
  })

  res.json({
    apicode: 'files_uploaded',
    urls: urls
  })
}

function getUploads(req, res, next) {
  const dirPath = path.join(__dirname, 'uploads');

  fs.readdir(dirPath, (err, files) => {
    res.json({
      data: files
    })
  });

}


module.exports = {
  getAllUsers: getAllUsers,
  getAllPosts: getAllPosts,
  getPost: getPost,
  getLatestPost: getLatestPost,
  createPost: createPost,
  updatePost: updatePost,
  deletePost: deletePost,
  login: login,
  upload: upload,
  getUploads: getUploads,
};
