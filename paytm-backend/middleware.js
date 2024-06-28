
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')

function authMiddleware (req, res, next) {
    const token = req.headers.authorization

    if(!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({mess: `not Found 1 ${token}`})
    }

    const jwtToken = token.split(" ")[1]

    
    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET)
        if(decoded.userId) {
            console.log(decoded.userId);
            req.userId = decoded.userId
            next()
        } else {
            return res.status(403).json({mess: `not found 2 ${decoded}`})
        }
    } catch (error) {
        res.status(403).json({mess: `not found 3 ${jwtToken} ${error}`})
    }
}

module.exports = {
    authMiddleware
}