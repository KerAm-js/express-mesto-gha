const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { pageNotFound } = require('./middleweares/pageNotFound');
const { auth } = require('./middleweares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/', pageNotFound);

app.listen(PORT, () => {
  console.log(`Server listen port: ${PORT}`);
});
