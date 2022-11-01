const {authenticateToken, authenticateTokenPublic} = require('../utils/token');
const uploadImage = require('../utils/uploadImage');
const controller = require('../controllers/users');

const router = (require('express')).Router();

router.get('/', authenticateTokenPublic, controller.getUsersList);
router.get('/:userId', authenticateTokenPublic, controller.getUser);
router.post('/', authenticateToken, controller.newUser);
router.post('/avatar', authenticateToken, uploadImage.single('image'), controller.setUserAvatar);
router.patch('/:userId', authenticateToken, controller.setUserData);
router.delete('/:userId', authenticateToken, controller.deleteUser)

module.exports = router;