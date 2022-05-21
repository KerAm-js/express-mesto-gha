const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorizathion } = req.headers;
  if (!authorizathion || authorizathion.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Ошибка авторизации' });
    return;
  }

  const token = authorizathion.replace('Bearer ');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    res.status(401).send({ message: 'Ошибка авторизации' });
    return;
  }

  req.user = payload;
  next();
};
