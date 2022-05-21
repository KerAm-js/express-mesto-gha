const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const { chooseError, isEntityFound } = require('../utils/utils');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!validator.default.isEmail(email)) {
    res.status(400).send({ message: 'Некорректные данные пользователя' });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Некорректные данные пользователя'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: 3600 * 24 * 7 });
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .status(200)
        .send({ message: 'Вы успешно авторизировались' });
    })
    .catch((e) => {
      res.status(500).send({ message: e.message });
    });
};
