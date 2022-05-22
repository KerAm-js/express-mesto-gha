const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => {
        const regex = /(https?:\/\/)(www\.)?([\da-z\.\-]+)\.([a-z\.]{2,6})(\/[\da-z\-\._~:\/?#\[\]@!$&'\(\)*+,;=])*#?/g;
        const isValid = regex.test(v);
        if (!isValid) {
          return Promise.reject(new BadRequestError('Некорректная ссылка'));
        }
        return true;
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
