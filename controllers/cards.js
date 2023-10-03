const Card = require('../models/card');

const ERROR_CODE_VALIDATION = 400;

const ERROR__CODE_UNDEFINED = 404;

const ERROR_CODE_DEFAULT = 500;

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (error) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при поиске карточек' });
  }
};

module.exports.getCardsById = async (req, res) => {
  try {
    const currentCard = req.params.cardId;
    const cards = await Card.findById(currentCard);
    res.send({ data: cards });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Карточки с таким идентификатором не существует' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при поиске карточки' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const createdCard = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send({ data: createdCard });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при создании карточки' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(ERROR__CODE_UNDEFINED).send({ message: 'Карточка с указанным _id не найдена' });
      return;
    }
    res.send({ data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Указан некорректный id карточки' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при удалении карточки' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(ERROR__CODE_UNDEFINED).send({ message: 'Передан несуществующий _id карточки' });
      return;
    }
    res.json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Передан некорректный _id карточки' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).json({ message: 'Произошла ошибка при постановке лайка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(ERROR__CODE_UNDEFINED).send({ message: 'Передан несуществующий _id карточки' });
      return;
    }
    res.json(updatedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Передан некорректный _id карточки' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).json({ message: 'Произошла ошибка при постановке лайка' });
  }
};
