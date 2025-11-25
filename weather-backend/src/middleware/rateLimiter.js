const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15*60*1000, //15 min
    max:100,
    message: 'Too many requests from this IP, please try again later.'
})

module.exports = limiter;