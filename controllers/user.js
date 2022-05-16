const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const { chooseError, isEntityFound } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  if (!validator.default.isEmail(email)) {
    res.status(400).send({ message: 'Некорректные данные пользователя' });
    return;
  }

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((result) => res.status(201).send(result))
    .catch((err) => {
      const possibleErrors = [
        { name: 'ValidationError', message: 'Некорректные данные пользователя', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => isEntityFound(res, user, 'Пользователь не найден'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'CastError', message: 'Некорректный id пользователя', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((result) => isEntityFound(res, result, 'Пользователь не найден'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'ValidationError', message: 'Некорректные данные профиля', code: 400 },
        { name: 'CastError', message: 'Некорректный id пользователя', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((result) => isEntityFound(res, result, 'Пользователь не найден'))
    .catch((err) => {
      const possibleErrors = [
        { name: 'ValidationError', message: 'Некорректная ссылка на аватар', code: 400 },
        { name: 'CastError', message: 'Не корректный id пользователя', code: 400 },
      ];
      chooseError(res, err, possibleErrors);
    });
};
