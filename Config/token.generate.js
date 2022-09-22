const jwt = require('jsonwebtoken');

const generateWebToken = (id) => jwt.sign({id},process.env.secret,{
    expiresIn : '240d'
});

module.exports = generateWebToken;