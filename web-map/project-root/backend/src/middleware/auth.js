const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/userModel');

exports.auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证令牌',
        success: false
      });
    }

    // 验证token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在',
        success: false
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '无效的认证令牌',
        success: false
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌已过期',
        success: false
      });
    }

    console.error('认证中间件错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      success: false
    });
  }
}; 