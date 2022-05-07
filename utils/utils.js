module.exports.isEntityFound = (res, result, errorMessage) => {
  if (!result) {
    res.status(404).send({ message: errorMessage });
    return;
  }
  res.send(JSON.stringify(result));
};

module.exports.chooseError = (res, err, possibleErrors) => {
  const { message, code } = possibleErrors.find((possibleErr) => possibleErr.name === err.name);
  if (message && code) {
    res.status(code).send({ message, ...err });
    return;
  }
  res.status(500).send(JSON.stringify({ message: err.message, ...err }));
};
