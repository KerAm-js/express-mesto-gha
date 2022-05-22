const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const userController = require('../controllers/user');

router.get('/', userController.getUsers);

router.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(www\.)?([\da-z\.\-]+)\.([a-z\.]{2,6})(\/[\da-z\-\._~:\/?#\[\]@!$&'\(\)*+,;=])*#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), userController.getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }).unknown(true),
}), userController.getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(www\.)?([\da-z\.\-]+)\.([a-z\.]{2,6})(\/[\da-z\-\._~:\/?#\[\]@!$&'\(\)*+,;=])*#?/),
    email: Joi.string().email(),
    password: Joi.string().min(8),
  }).unknown(true),
}), userController.updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }).unknown(true),
}), userController.updateAvatar);

module.exports = router;
