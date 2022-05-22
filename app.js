const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const userController = require('./controllers/user');
const { pageNotFound } = require('./middlewares/pageNotFound');
const { auth } = require('./middlewares/auth');
const { errorHandling } = require('./middlewares/errorHandling');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), userController.login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), userController.createUser);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('/', pageNotFound);
app.use(errors());
app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`Server listen port: ${PORT}`);
});
