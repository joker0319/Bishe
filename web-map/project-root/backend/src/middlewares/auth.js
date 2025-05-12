const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticate = (req, res, next) => {
  try {
    // 从请求头中获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // 验证token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的令牌或令牌已过期'
    });
  }
};
