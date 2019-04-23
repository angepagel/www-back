const config = require('./config');
const database = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function authenticate(username, password) {
  let auth = false;

  try {
    const user = await database.userExists(username);

    if (user !== null) {
      const match = await bcrypt.compare(password, user.password);
      if (match) auth = true;
    }
  }
  catch(error) {
    console.error(error);
  }

  return auth;
}

async function generateToken(username) {
  const token = jwt.sign(
    { username: username },
    config.JWT_SECRET,
    {
      algorithm: config.JWT_ALGORITHM,
      expiresIn: config.JWT_EXPIRATION
    }
  );

  return token;
}


module.exports = {
  authenticate  : authenticate,
  generateToken : generateToken
}
