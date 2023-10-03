const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Успешное подключение к монгодб');
});

app.use((req, res, next) => {
  req.user = {
    _id: '6519abdfbd696c1433795754',
  };

  next();
});

app.use(bodyParser.json());

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

// роут для несуществующих страниц
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// обработчик ошибок для 404
app.use((err, req, res, next) => {
  res.status(err.status || 404).json({
    error: {
      message: err.message || 'Not Found',
    },
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}`);
});
