const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/categories');

const router = (require('express')).Router();

router.get('/', controller.getCategoriesList);
router.post('/', authenticateToken, controller.newCategory);
router.route('/:categoryId')
      .get(controller.getCategory)
      .patch(authenticateToken, controller.updateCategory)
      .delete(authenticateToken, controller.deleteCategory);
router.get('/:categoryId/posts', controller.getPostsByCategory);

module.exports = router;