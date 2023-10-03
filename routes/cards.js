const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

const { likeCard, dislikeCard, getCardsById } = require('../controllers/cards');

router.get('/', getCards);

router.get('/:cardId', getCardsById);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.delete('/:cardId/likes', dislikeCard);

router.put('/:cardId/likes', likeCard);

module.exports = router;
