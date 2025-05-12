const mysql = require('mysql2');
const config = require('./config');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'hiking_platform'
});

// 转换为 Promise 接口
const promisePool = pool.promise();

// 导出查询函数
module.exports = {
  query: (sql, params) => promisePool.query(sql, params),
  testConnection: async () => {
    try {
      await promisePool.query('SELECT 1');
      console.log('数据库连接成功');
      return true;
    } catch (err) {
      console.error('数据库连接失败:', err);
      return false;
    }
  },
  initDatabase: async () => {
    try {
      const conn = await promisePool.getConnection();
      
      // 创建用户表
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          avatar VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('数据库表初始化成功');
      conn.release();
    } catch (error) {
      console.error('数据库表初始化失败:', error);
    }
  }
};