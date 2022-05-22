const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const { isEntityFound } = require('../utils/utils');
const UnauthorizedError = require('../errors/UnauthorizedError');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((result) => {
      const { password, ...userData } = result.toObject();
      res.status(201).send({ ...userData });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => isEntityFound(res, user, 'Пользователь не найден'))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((result) => isEntityFound(res, result, 'Пользователь не найден'))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((result) => isEntityFound(res, result, 'Пользователь не найден'))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверные данные пользователя'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверные данные пользователя'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: 3600 * 24 * 7 });
      res
        .cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .status(200)
        .send({ message: 'Вы успешно авторизировались' });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError('Неверные данные пользователя'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};
