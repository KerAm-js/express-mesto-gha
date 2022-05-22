const errorHandling = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
    return;
  }
  if (err.errors) {
    res.status(400).send({ message: err.message.split(':')[2] });
    return;
  }
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
};

module.exports = {
  errorHandling,
};
