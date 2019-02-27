const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

const database = pgp(config);


function getAllUsers(req, res, next) {
  database.any('SELECT id, username FROM users')
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all users'
        })
    })
    .catch(function(error) {
        return next(error);
    })
}

function getAllPosts(req, res, next) {
  database.any('SELECT id, category, title, image, body, date FROM posts')
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all blog posts'
        })
    })
    .catch(function(error) {
        return next(error);
    })
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

module.exports = {
  getAllUsers: getAllUsers,
  getAllPosts: getAllPosts
};
