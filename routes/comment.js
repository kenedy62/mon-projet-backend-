const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');

router.post('/', commentCtrl.createComment);
router.get('/public/:productId', commentCtrl.getApprovedComments); // 💡 public
router.get('/admin/all', commentCtrl.getAllCommentsForAdmin);      // 💡 admin
router.put('/admin/moderate/:id', commentCtrl.moderateComment);    // 💡 admin action


module.exports = router;
