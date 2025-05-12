import { get, post } from '@/utils/request';
import type { BaseResponse } from '@/types/response';

// 帖子类型定义
export interface Post {
  id: number;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
  images: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  location?: string;
}

// 创建帖子的数据类型
export interface CreatePostData {
  title: string;
  content: string;
  images: string[];
  location?: string;
}

// 论坛服务
export const forumService = {
  // 获取帖子列表
  async getPosts(page: number = 1, sortType: string = 'latest'): Promise<Post[]> {
    try {
      const res = await get<BaseResponse<Post[]>>('/api/forum/posts', { page, sortType });
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  },
  
  // 搜索帖子
  async searchPosts(query: string, sortType: string = 'latest'): Promise<Post[]> {
    try {
      const res = await get<BaseResponse<Post[]>>('/api/forum/search', { query, sortType });
      return res.success ? res.data : [];
    } catch (error) {
      console.error('搜索帖子失败:', error);
      return [];
    }
  },
  
  // 获取帖子详情
  async getPostDetail(id: number): Promise<Post | null> {
    try {
      const res = await get<BaseResponse<Post>>(`/api/forum/posts/${id}`);
      return res.success ? res.data : null;
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      return null;
    }
  },
  
  // 创建帖子
  async createPost(data: CreatePostData): Promise<Post | null> {
    try {
      const res = await post<BaseResponse<Post>>('/api/forum/posts', data);
      return res.success ? res.data : null;
    } catch (error) {
      console.error('创建帖子失败:', error);
      return null;
    }
  },
  
  // 上传图片
  async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await post<BaseResponse<string>>('/api/forum/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.success ? res.data : null;
    } catch (error) {
      console.error('上传图片失败:', error);
      return null;
    }
  },
  
  // 点赞/取消点赞
  async toggleLike(postId: number): Promise<{likes: number, isLiked: boolean} | null> {
    try {
      const res = await post<BaseResponse<{likes: number, isLiked: boolean}>>(`/api/forum/posts/${postId}/like`);
      return res.success ? res.data : null;
    } catch (error) {
      console.error('点赞操作失败:', error);
      return null;
    }
  }
};
