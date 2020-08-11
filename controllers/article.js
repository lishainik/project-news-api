const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const AuthorizationError = require('../errors/auth-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ article }))
    .catch(() => {
      throw new Error('Ошибка чтения базы данных');
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ article }))
    .catch((err) => {
      if (err) {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Ошибка валидации запроса');
        } else if (err) {
          throw new Error('Ошибка сервера');
        }
      }
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный формат ID');
      }
    })
    .then((article) => {
      if (article === null) {
        throw new NotFoundError('Такой статьи не существует');
      }
      return article;
    })
    .then((article) => {
      const ownerString = article.owner.toString();
      if (ownerString === req.user._id) {
        Article.findByIdAndRemove({ _id: article._id })
          .then(() => { res.send({ article }); });
      } else {
        throw new AuthorizationError('Запрещено удалять чужие статьи');
      }
    })
    .catch(next);
};
