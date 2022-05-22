const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const userController = require('../controllers/user');
const { myRegex } = require('../utils/utils');

router.get('/', userController.getUsers);

router.get('/me', userController.getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }).unknown(true),
}), userController.getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(myRegex)),
    email: Joi.string().email(),
    password: Joi.string().min(8),
  }).unknown(true),
}), userController.updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(myRegex)),
  }).unknown(true),
}), userController.updateAvatar);

module.exports = router;
