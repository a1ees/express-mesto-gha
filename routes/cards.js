const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

const { likeCard, dislikeCard, getCardById } = require('../controllers/cards');

router.get('/', getCards);

router.get('/:cardId', getCardById);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['https'] }),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

module.exports = router;
