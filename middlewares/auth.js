const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Ошибка авторизации'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next(new UnauthorizedError('Ошибка авторизации'));
    return;
  }

  req.user = payload;
  next();
};
