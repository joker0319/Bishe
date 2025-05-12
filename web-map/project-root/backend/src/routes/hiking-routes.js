const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取所有路线
router.get('/', async (req, res) => {
  try {
    const [routes] = await db.query('SELECT * FROM hiking_routes');
    res.json({ data: routes });
  } catch (error) {
    console.error('获取路线数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取热门路线（评分最高的3条）
router.get('/popular', async (req, res) => {
  try {
    // 临时改为获取评分最高的3条路线
    const [routes] = await db.query('SELECT * FROM hiking_routes ORDER BY rating DESC LIMIT 3');
    res.json({
      code: 200,
      message: "success",
      data: routes
    });
  } catch (error) {
    console.error('获取热门路线失败，详细错误:', error);
    res.status(500).json({
      code: 500,
      message: "获取热门路线失败",
      data: null
    });
  }
});

// 获取单个路线详情
router.get('/:id', async (req, res) => {
  try {
    const [routes] = await db.query(
      'SELECT * FROM hiking_routes WHERE id = ?',
      [req.params.id]
    );
    
    if (routes.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到路线'
      });
    }
    
    // 处理JSON字段
    const route = {
      ...routes[0],
      seasons: JSON.parse(routes[0].seasons),
    };
    
    res.status(200).json({ 
      success: true, 
      data: route 
    });
  } catch (error) {
    console.error('获取路线详情失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取路线详情失败' 
    });
  }
});

module.exports = router; 