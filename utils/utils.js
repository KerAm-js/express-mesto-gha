module.exports.isEntityFound = (res, result, errorMessage) => {
  if (!result) {
    res.status(404).send(errorMessage);
    return;
  }
  res.send(result);
};

module.exports.chooseError = (res, err, possibleErrors) => {
  const { message, code } = possibleErrors.find((possibleErr) => possibleErr.name === err.name);
  if (message && code) {
    res.status(code).send(message);
    return;
  }
  res.status(500).send(err.message);
};
