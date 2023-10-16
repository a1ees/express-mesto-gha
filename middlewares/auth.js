const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};