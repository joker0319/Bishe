const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const forumController = require('../controllers/forumController');

// 获取帖子列表
router.get('/posts', forumController.getPosts);

// 搜索帖子
router.get('/search', forumController.searchPosts);

// 获取帖子详情
router.get('/posts/:id', forumController.getPostById);

// 创建帖子
router.post('/posts', auth, forumController.createPost);

// 点赞/取消点赞
router.post('/posts/:id/like', auth, forumController.toggleLike);

module.exports = router; 