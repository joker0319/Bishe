const { verifyToken } = require('../utils/jwtHelper');

// 验证用户是否已登录
const authenticate = (req, res, next) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: '未授权访问，请先登录' 
      });
    }

    // 提取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const { valid, decoded, error } = verifyToken(token);
    
    if (!valid) {
      return res.status(401).json({ 
        success: false, 
        message: '令牌无效或已过期，请重新登录',
        error
      });
    }

    // 将用户信息添加到请求对象
    req.user = { id: decoded.id };
    
    // 继续处理请求
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
};

module.exports = { authenticate };