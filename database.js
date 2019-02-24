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


module.exports = {
  getAllUsers: getAllUsers,
};
