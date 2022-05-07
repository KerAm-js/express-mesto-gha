const User = require('../models/user');
const { chooseError, isEntityFound } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((result) => res.send(result))
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
        { name: 'CastError', message: 'Некорректный id пользователя', code: 404 },
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
    upsert: true,
  })
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send(err.message));
};
