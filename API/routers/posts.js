const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/posts');

const router = (require('express')).Router();

router.get('/', controller.getPostsList);
router.post('/', authenticateToken, controller.newPost);
router.route('/:postId')
      .get(controller.getPost)
      .patch(authenticateToken, controller.updatePost)
      .delete(authenticateToken, controller.deletePost);
router.route('/:postId/comments')
      .get(controller.getPostComments)
      .post(authenticateToken, controller.newPostComment);
router.route('/:postId/like')
      .get(authenticateToken, controller.getPostLikes)
      .post(authenticateToken, controller.newPostLike)
      .delete(authenticateToken, controller.deletePostLike);
router.get('/:postId/categories', controller.getPostCategories)

module.exports = router;