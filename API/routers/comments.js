const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/comments');

const router = (require('express')).Router();

router.route('/:commentId')
      .get(controller.getComment)
      .patch(authenticateToken, controller.updateComment)
      .delete(authenticateToken, controller.deleteComment);
router.route('/:commentId/comments')
      .get(controller.getCommentComments)
      .post(authenticateToken, controller.newCommentComment)
router.route('/:commentId/like')
      .get(authenticateToken, controller.getCommentLikes)
      .post(authenticateToken, controller.newCommentLike)
      .delete(authenticateToken, controller.deleteCommentLike);

module.exports = router;