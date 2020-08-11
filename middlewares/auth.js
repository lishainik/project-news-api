const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.replace('jwt=Bearer%20', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      throw new AuthorizationError('Необходима авторизация');
    }
    req.user = payload;
  } else {
    throw new AuthorizationError('Необходима авторизация');
  }
  next();
};
