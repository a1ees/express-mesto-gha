const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');
const { updateUserMe, updateAvatar, userInfo } = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserMe);

router.get('/me', userInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(22),
  }),
}), getUserById);

module.exports = router;
