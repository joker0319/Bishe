const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth.js');

// 注册路由
router.post(
  '/register',
  [
    body('username')
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 20 }).withMessage('用户名长度应为3-20个字符'),
    body('email')
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('请提供有效的邮箱地址'),
    body('password')
      .notEmpty().withMessage('密码不能为空')
      .isLength({ min: 6 }).withMessage('密码长度至少为6个字符')
  ],
  authController.register
);

// 登录路由
router.post(
  '/login',
  [
    body('username')
      .notEmpty().withMessage('用户名不能为空'),
    body('password')
      .notEmpty().withMessage('密码不能为空')
  ],
  authController.login
);

// 获取当前用户信息
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;