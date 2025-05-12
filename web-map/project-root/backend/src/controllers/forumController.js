const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

// 获取帖子列表
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, sortType = 'latest' } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    console.log('获取帖子列表参数:', { page, sortType, limit, offset });

    let orderBy = 'p.created_at DESC';
    if (sortType === 'hottest') {
      orderBy = 'p.likes DESC, p.created_at DESC';
    }

    // 获取帖子列表，包含作者信息和点赞数
    const [posts] = await db.query(`
      SELECT 
        p.*,
        u.username as author_name,
        u.avatar as author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    console.log('查询到的帖子数量:', posts.length);

    // 获取每个帖子的图片
    const postsWithImages = await Promise.all(posts.map(async (post) => {
      const [images] = await db.query(`
        SELECT image_url 
        FROM post_images 
        WHERE post_id = ? 
        ORDER BY sort_order ASC
      `, [post.id]);

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        createdAt: post.created_at,
        author: {
          name: post.author_name,
          avatar: post.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_name}`
        },
        images: images.map(img => img.image_url),
        likes: post.likes_count || 0,
        comments: post.comments || 0, // 使用 posts 表中的 comments 字段
        isLiked: false, // 默认未点赞，需要根据当前用户状态判断
        location: post.location
      };
    }));

    console.log('处理后的帖子数据:', postsWithImages.length);

    res.json({
      code: 200,
      data: postsWithImages,
      message: '获取帖子成功',
      success: true
    });
  } catch (error) {
    console.error('获取帖子失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取帖子失败: ' + error.message,
      success: false,
      data: []
    });
  }
};

// 搜索帖子
exports.searchPosts = async (req, res) => {
  try {
    const { query, sortType = 'latest' } = req.query;
    
    let orderBy = 'created_at DESC';
    if (sortType === 'hottest') {
      orderBy = 'likes DESC';
    }

    const [posts] = await db.query(`
      SELECT p.*, u.username as author_name, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.title LIKE ? OR p.content LIKE ?
      ORDER BY ${orderBy}
    `, [`%${query}%`, `%${query}%`]);

    res.json({
      code: 200,
      data: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        createdAt: post.created_at,
        author: {
          name: post.author_name,
          avatar: post.author_avatar
        },
        likes: post.likes,
        comments: post.comments,
        location: post.location
      })),
      message: '搜索帖子成功',
      success: true
    });
  } catch (error) {
    console.error('搜索帖子失败:', error);
    res.status(500).json({
      code: 500,
      message: '搜索帖子失败',
      success: false
    });
  }
};

// 获取帖子详情
exports.getPostById = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT p.*, u.username as author_name, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    const post = posts[0];
    res.json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        createdAt: post.created_at,
        author: {
          name: post.author_name,
          avatar: post.author_avatar
        },
        likes: post.likes,
        comments: post.comments,
        location: post.location
      }
    });
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取帖子详情失败'
    });
  }
};

// 创建帖子
exports.createPost = async (req, res) => {
  try {
    const { title, content, location } = req.body;
    const userId = req.user.id; // 假设通过认证中间件设置了用户信息
    const summary = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    const [result] = await db.query(`
      INSERT INTO posts (title, content, summary, user_id, location)
      VALUES (?, ?, ?, ?, ?)
    `, [title, content, summary, userId, location]);

    const postId = result.insertId;

    // 处理图片上传
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadDir = path.join(__dirname, '../../uploads');
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        
        // 确保上传目录存在
        await fs.mkdir(uploadDir, { recursive: true });
        
        // 移动文件到上传目录
        await fs.rename(file.path, filePath);
        
        // 保存图片记录
        await db.query(`
          INSERT INTO post_images (post_id, image_url)
          VALUES (?, ?)
        `, [postId, `/uploads/${fileName}`]);
      }
    }

    // 获取新创建的帖子
    const [posts] = await db.query(`
      SELECT p.*, u.username as author_name, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);

    const post = posts[0];
    res.status(201).json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        createdAt: post.created_at,
        author: {
          name: post.author_name,
          avatar: post.author_avatar
        },
        likes: post.likes,
        comments: post.comments,
        location: post.location
      }
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    res.status(500).json({
      success: false,
      message: '创建帖子失败'
    });
  }
};

// 点赞/取消点赞
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // 检查是否已经点赞
    const [likes] = await db.query(`
      SELECT id FROM post_likes
      WHERE post_id = ? AND user_id = ?
    `, [postId, userId]);

    if (likes.length > 0) {
      // 取消点赞
      await db.query(`
        DELETE FROM post_likes
        WHERE post_id = ? AND user_id = ?
      `, [postId, userId]);

      // 更新帖子点赞数
      await db.query(`
        UPDATE posts
        SET likes = likes - 1
        WHERE id = ?
      `, [postId]);
    } else {
      // 添加点赞
      await db.query(`
        INSERT INTO post_likes (post_id, user_id)
        VALUES (?, ?)
      `, [postId, userId]);

      // 更新帖子点赞数
      await db.query(`
        UPDATE posts
        SET likes = likes + 1
        WHERE id = ?
      `, [postId]);
    }

    // 获取更新后的点赞数
    const [posts] = await db.query(`
      SELECT likes FROM posts WHERE id = ?
    `, [postId]);

    res.json({
      code: 200,
      data: {
        likes: posts[0].likes,
        isLiked: likes.length === 0
      },
      message: likes.length > 0 ? '取消点赞成功' : '点赞成功',
      success: true
    });
  } catch (error) {
    console.error('点赞操作失败:', error);
    res.status(500).json({
      code: 500,
      message: '点赞操作失败',
      success: false
    });
  }
}; 