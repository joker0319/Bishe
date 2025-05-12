const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { testConnection, initDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const hikingRoutesRouter = require('./routes/hiking-routes');

// 在 app.js 文件顶部添加
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

// 创建Express应用
const app = express();

// 中间件
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hiking-routes', hikingRoutesRouter);

// 添加静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '智能户外徒步平台API服务' });
});

// 启动服务器
const PORT = config.PORT;
app.listen(PORT, async () => {
  console.log(`服务器运行在端口 ${PORT}`);
  
  // 测试数据库连接
  const isConnected = await testConnection();
  if (isConnected) {
    // 初始化数据库表
    await initDatabase();
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

module.exports = app;