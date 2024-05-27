const redis = require("redis");
const {redis_password,redis_url,redis_port} = require('./config');

const redisClient = redis.createClient({
    password: redis_password,
    socket: {
        host: redis_url,
        port: redis_port
    }
});

redisClient.connect((err) => {
    if (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1); // Exit on connection error
    } else {
        console.log('Connected to Redis successfully!');
    }
});

module.exports = redisClient;