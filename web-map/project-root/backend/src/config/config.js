require('dotenv').config();

module.exports = {
  // 服务器配置
  PORT: process.env.PORT || 3000,
  
  // JWT配置
  JWT_SECRET: process.env.JWT_SECRET || 'hiking_platform_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5175'
};