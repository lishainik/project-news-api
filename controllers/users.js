const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(() => {
      throw new Error('Ошибка чтения базы данных');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (password === undefined || password.length === 0) {
    throw new BadRequestError('Пароль не должен быть пустым');
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, email, password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Ошибка валидации запроса');
          } else if (err.name === 'MongoError' && err.code === 11000) {
            throw new ConflictError('Данный email уже зарегистрирован');
          } else {
            throw new Error('Ошибка валидации');
          }
        }))
      .catch(next);
  }
};
