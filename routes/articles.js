const articlesRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { createArticle, getArticles, deleteArticle } = require('../controllers/article');

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неккоректно заполненно поле');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неккоректно заполненно поле');
    }),
  }),
}), createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
