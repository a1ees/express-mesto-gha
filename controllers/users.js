const User = require('../models/user');

const ERROR_CODE_VALIDATION = 400;

const ERROR__CODE_UNDEFINED = 404;

const ERROR_CODE_DEFAULT = 500;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (error) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при получении данных пользователей' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const createdUser = await User.create({ name, about, avatar });
    res.send({ data: createdUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return;
    }
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при создании пользователя' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const currentUser = req.params.userId;
    const user = await User.findById(currentUser);
    if (!user) {
      res.status(ERROR__CODE_UNDEFINED).send({ message: 'Пользователь по указанному _id не найден' });
      return;
    }
    res.send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'id пользователя указан некорректно' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка при получении пользователя' });
  }
};

module.exports.updateUserMe = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = {};

    if (name) {
      if (name.length < 2 || name.length > 30) {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      updateUser.name = name;
    }

    if (about) {
      if (about.length < 2 || about.length > 30) {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      updateUser.about = about;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateUser, { new: true });
    res.send({ data: user });
  } catch (error) {
    res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка при обновлении профиля' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar });
    if (!updatedUser) {
      res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return;
    }
    res.send({ data: updatedUser });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
