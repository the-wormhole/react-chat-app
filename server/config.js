const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  redis_password: process.env.REDIS_PASS,
  redis_url: process.env.REDIS_URL,
  redis_port: process.env.REDIS_PORT
};