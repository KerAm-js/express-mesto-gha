const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use('/', (req, res, next) => {
  req.user = {
    _id: '6276733a1f28035c04df9f29',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
