const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const regexLink = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/;

const app = express();
const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://alees.nomoredomainsrocks.ru');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Успешное подключение к монгодб');
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(requestLogger);

app.post('/sign-in', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/sign-up', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().regex(regexLink),
  }),
}), createUser);

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use(errorLogger);

// роут для несуществующих страниц
app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors());

// обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}`);
});
