module.exports.isEntityFound = (res, result, errorMessage) => {
  if (!result) {
    res.status(404).send({ message: errorMessage });
    return;
  }
  res.send(result);
};

module.exports.chooseError = (res, err, possibleErrors) => {
  const currentErr = possibleErrors.find((possibleErr) => possibleErr.name === err.name);
  if (currentErr) {
    res.status(currentErr.code).send({ ...err, message: currentErr.message });
    return;
  }
  res.status(500).send({ message: err.message, ...err });
};
