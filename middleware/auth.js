const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth_token');
    if (!token) {
        return res.status(401).send('access rejected...')
    }
try{
    const decodeToken = jwt.verify(token, 'jwt_token')
    req.user = decodeToken;
    next()
} catch(e) {
    res.status(400).send('wrong token...')
}
}
