const NotFoundError = require('../errors/NotFoundError');

module.exports.myRegex = /(https?:\/\/)(www\.)?([\da-z\.\-]+)\.([a-z\.]{2,6})(\/[\da-z\-\._~:\/?#\[\]@!$&'\(\)*+,;=])*#?/;

module.exports.isEntityFound = (res, result, errorMessage) => {
  if (!result) {
    return Promise.reject(new NotFoundError(errorMessage));
  }
  return res.status(200).send(result);
};
