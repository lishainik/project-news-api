const usersRouter = require('express').Router();
const { getMe } = require('../controllers/users');

usersRouter.get('/users/me', getMe);

module.exports = usersRouter;
