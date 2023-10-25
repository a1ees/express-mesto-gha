const Card = require('../models/card');
const ValidationError = require('../errors/validation-err'); // 400
const ForbiddenError = require('../errors/forbidden-err'); // 500
const NotFoundError = require('../errors/not-found-err'); // 404

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards.reverse());
  } catch (error) {
    next(error);
  }
};

module.exports.getCardById = async (req, res, next) => {
  try {
    const currentCard = req.params.cardId;
    const cards = await Card.findById(currentCard);
    if (!cards) {
      throw new NotFoundError('Карточки с таким идентификатором не существует');
    }
    res.send({ data: cards });
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const createdCard = await Card.create({ name, link, owner: req.user._id});
    res.status(201).send(createdCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params; // взяли id карточки из запроса
  const userId = req.user._id; // взяли id авторизованного юзера

  try {
    const cardSearch = await Card.findById(cardId); // нашли карточку из запроса по id

    if (!cardSearch) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }

    const cardOwnerId = cardSearch.owner.toString(); // достали id создателя из найденной карточки

    if (cardOwnerId !== userId) {
      throw new ForbiddenError('У вас нет прав для удаления этой карточки');
    }

    const deletedCard = await Card.findByIdAndRemove(cardId); // удаляем карточку, все совпало
    res.send({ data: deletedCard }); // отправляем карточку в тело ответа после успешного удаления
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('Указан некорректный id карточки'));
    } else {
      next(error);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('Передан некорректный _id карточки'));
    } else {
      next(error);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('Передан некорректный _id карточки'));
    } else {
      next(error);
    }
  }
};
