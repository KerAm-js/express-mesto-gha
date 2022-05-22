const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const cardController = require('../controllers/card');
const { myRegex } = require('../utils/utils');

router.get('/', cardController.getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(myRegex)),
  }).unknown(true),
}), cardController.createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }).unknown(true),
}), cardController.deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }).unknown(true),
}), cardController.likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }).unknown(true),
}), cardController.dislikeCard);

module.exports = router;
