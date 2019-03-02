const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
      res.status(200)
        .json({
          data: data,
          message: 'Retrieved all users'
        })
    })
    .catch(
      error => console.log(error)
    );
}


function getPost(req, res, next) {
  let postID = parseInt(req.params.id);

  database.one(`SELECT id, category, title, image, body, TO_CHAR(date, 'dd Month yyyy') as date FROM posts WHERE id = ${postID}`)
    .then(data => {
      res.status(200)
        .json({
          data: data,
          message: 'Retrieved one blog post'
        })
    })
    .catch(
      error => console.log(error)
    );
}


function getAllPosts(req, res, next) {
  database.any("SELECT id, category, title, image, body, TO_CHAR(date, 'dd Month yyyy') as date FROM posts")
    .then(data => {
      res.status(200)
        .json({
          data: data,
          message: 'Retrieved all blog posts'
        })
    })
    .catch(
      error => console.log(error)
    );
}


function createPost(req, res, next) {
  const { category, title, body, image } = req.body;

  database.none(`INSERT INTO posts (author, category, title, body, image, date) VALUES (1, '${category}', '${title}', '${body}', '${image}', NOW())`)
    .then(() => {
      res.status(200)
        .json({
          message: 'Created one post'
        })
    })
    .catch(
      error => console.log(error)
    );
}


function updatePost(req, res, next) {
  const postID = parseInt(req.params.id);
  const { category, title, body, image } = req.body;

  database.none(`UPDATE posts SET category='${category}', title='${title}', body='${body}', image='${image}' WHERE id='${postID}'`)
    .then(() => {
      res.status(200)
        .json({
          message: 'Updated one post'
        })
    })
    .catch(
      error => console.log(error)
    );
}


async function userExists(username) {
  let user = null;

  try {
    user = await database.oneOrNone(`SELECT id, username, password FROM users WHERE username LIKE '${username}'`);
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


module.exports = {
  getAllUsers: getAllUsers,
  getAllPosts: getAllPosts,
  getPost: getPost,
  createPost: createPost,
  updatePost: updatePost,
  login: login
};
