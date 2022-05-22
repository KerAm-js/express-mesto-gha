const NotFoundError = require('../errors/NotFoundError');

module.exports.isEntityFound = (res, result, errorMessage) => {
  if (!result) {
    return Promise.reject(new NotFoundError(errorMessage));
  }
  return res.status(200).send(result);
};
