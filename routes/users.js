const router = require('express').Router();
const { getUsers, createUser, getUserById } = require('../controllers/users');

const { updateUserMe, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', updateUserMe);

router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

router.post('/', createUser);

module.exports = router;
