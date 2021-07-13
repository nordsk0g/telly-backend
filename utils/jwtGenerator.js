require('dotenv').config();
const jwt = require("jsonwebtoken");

function jwtGenerator(user_id) {
    const payload = {
        id: user_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: '72hr'})
}

module.exports = jwtGenerator;