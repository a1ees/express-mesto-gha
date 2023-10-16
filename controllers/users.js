const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/validation-err'); // 400
const BadRequestError = require('../errors/bad-request-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-error'); // 409

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new BadRequestError('Неправильные почта или пароль');
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new BadRequestError('Неправильные почта или пароль');
    }
    const token = await jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
    res.send(token);
  } catch (error) {
    next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ email, password: hash });
    res.status(201).send({ data: createdUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    }
    if (error.code === 11000) {
      next(new ConflictError('Пользователь с данной почтой уже зарегистрирован'));
    }
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const currentUser = req.params.userId;
    const user = await User.findById(currentUser);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    res.send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('id пользователя указан некорректно'));
    }
    next(error);
  }
};

module.exports.updateUserMe = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = {};

    if (name) {
      if (name.length < 2 || name.length > 30) {
        throw new ValidationError('Переданы некорректные данные при обновлении пользователя');
      }
      updateUser.name = name;
    }

    if (about) {
      if (about.length < 2 || about.length > 30) {
        throw new ValidationError('Переданы некорректные данные при обновлении пользователя');
      }
      updateUser.about = about;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateUser, { new: true });
    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (!updatedUser) {
      throw new ValidationError('Переданы некорректные данные при обновлении аватара');
    }
    res.send({ data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.userInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};
