const jwt = require('../utils/token');
const controller = require('../controllers/authorization');

const router = (require('express')).Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/password-reset', controller.passwordReset);
router.post('/password-reset/:confirmToken', controller.confirmNewPassword);
router.get('/confirm-email/:confirmToken', controller.confirmPassword)

module.exports = router;
