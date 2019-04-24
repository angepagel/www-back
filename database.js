const pgp = require('pg-promise')();
const config = require('./config');


const dbconfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD
}
const database = pgp(dbconfig);


function getPost(id) {
  return database.one("SELECT id, category, title, image, img_credit, body, date, TO_CHAR(date, 'dd Month yyyy') as datestr FROM posts WHERE id = $1", [id])
    .catch(
      error => console.error(error)
    );
}

function getAllPosts() {
  return database.any("SELECT id, category, title, image, img_credit, body, date, TO_CHAR(date, 'dd Month yyyy') as datestr FROM posts ORDER BY date DESC")
    .catch(
      error => console.error(error)
    );
}

function createPost(category, title, body, img_url, img_credit) {
  return database.none("INSERT INTO posts (author, category, title, body, image, img_credit, date) VALUES (1, $1, $2, $3, $4, $5, NOW())", [category, title, body, img_url, img_credit])
    .catch(
      error => console.error(error)
    );
}

function updatePost(id, category, title, body, img_url, img_credit) {
  database.none("UPDATE posts SET category=$1, title=$2, body=$3, image=$4, img_credit=$5 WHERE id=$6", [category, title, body, img_url, img_credit, id])
  .catch(
    error => console.error(error)
  );
}

function deletePost(id) {
  database.none("DELETE FROM posts WHERE id=$1", [id])
  .catch(
    error => console.error(error)
  );
}

function userExists(username) {
  return database.oneOrNone("SELECT id, username, password FROM users WHERE username LIKE $1", [username]);
}


module.exports = {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  userExists
}
