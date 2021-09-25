const jwt = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token')

    // Check for token
    if(!token) return res.status(401).send('Access denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;
        next();
    } catch (err) {
        req.status(400).send('Invalid token')
    }
}

module.exports = auth;