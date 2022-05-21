const router = require('express').Router();
const cardController = require('../controllers/card');

router.get('/', cardController.getCards);
router.post('/', cardController.createCard);
router.get('/me', cardController.getUserInfo);
router.delete('/:cardId', cardController.deleteCardById);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);

module.exports = router;
