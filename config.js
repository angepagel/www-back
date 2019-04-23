require('dotenv').config();

const config = {};

config.PORT = process.env.PORT || 5000;
config.HOST = process.env.HOST || '127.0.0.1';

config.DB_HOST = process.env.DB_HOST || '127.0.0.1';
config.DB_PORT = process.env.DB_PORT || 5432;
config.DB_NAME = process.env.DB_NAME || '';
config.DB_USER = process.env.DB_USER || '';
config.DB_PASSWORD = process.env.DB_PASSWORD || '';

config.JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'
config.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '3m';
config.JWT_SECRET = process.env.JWT_SECRET || '123';

module.exports = config;
