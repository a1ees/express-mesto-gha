const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorized-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnathorizedError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnathorizedError('Неверный токен, необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
