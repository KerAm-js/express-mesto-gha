const Card = require('../models/card');
const { chooseError, isEntityFound } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(JSON.stringify(cards)))
    .catch((err) => res.status(500).send({ ...err }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => isEntityFound(res, card, 'Карточка не найдена'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'ValidationError', message: 'Некорректные данные карточки', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((result) => res.status(201).send(JSON.stringify(result)))
    .catch((err) => {
      const possibleErrors = [
        { name: 'ValidationError', message: 'Некорректные данные карточки', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, {
    $addToSet: {
      likes: cardId,
    },
  }, { new: true })
    .then((result) => isEntityFound(res, result, 'Карточка не найдена'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'CastError', message: 'Некорректный id карточки', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, {
    $pull: {
      likes: cardId,
    },
  }, { new: true })
    .then((result) => isEntityFound(res, result, 'Карточка не найдена'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'CastError', message: 'Некорректный id карточки', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};
