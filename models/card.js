const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
