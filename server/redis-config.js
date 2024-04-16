const redis = require("redis");

const redisClient = redis.createClient(); //left empty to take default values
// {
//     host:'localhost',
//     port:6379,
// });

redisClient.connect((err) => {
    if (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1); // Exit on connection error
    } else {
        console.log('Connected to Redis successfully!');
    }
});

module.exports = redisClient;