const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorizationError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (password === undefined || password.length === 0) {
    throw new AuthorizationError('Пароль не должен быть пустым');
  } else {
    User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new AuthorizationError('Неправильные почта или пароль');
            }
            return user;
          })
          .then(() => {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
            res.cookie('jwt', `Bearer ${token}`, { maxAge: 3600000 * 24 * 7, httpOnly: true });
            res.status(200).send({ message: 'Успешный логин' });
          });
      })
      .catch(next);
  }
};

module.exports.logOut = (req, res) => {
  res
    .cookie('jwt', '', { maxAge: 1, httpOnly: true })
    .send({ logOut: 'success' })
    .end();
};
