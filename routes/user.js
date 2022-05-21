const router = require('express').Router();
const userController = require('../controllers/user');

router.get('/', userController.getUsers);
router.post('/signup', userController.createUser);
router.post('./signin', userController.login);
router.get('/:userId', userController.getUserById);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
