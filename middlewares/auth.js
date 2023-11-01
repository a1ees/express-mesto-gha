const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnathorizedError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnathorizedError('Неверный токен, необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
