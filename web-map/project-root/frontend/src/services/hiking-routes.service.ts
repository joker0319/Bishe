import { request } from '../utils/request';

export interface HikingRoute {
  id: number;
  title: string;
  difficulty: string;
  difficultyClass: string;
  duration: string;
  distance: string;
  elevation: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  seasons: string[];
  createdAt: string;
  updatedAt: string;
}

export const hikingRoutesService = {
  // 获取所有路线
  getAllRoutes: async (): Promise<HikingRoute[]> => {
    const response = await request({
      url: 'http://localhost:3000/api/hiking-routes',
      method: 'GET'
    });
    
    console.log('获取所有路线响应:', response); // 添加调试日志
    
    // 检查响应结构 - 支持多种格式
    let routesData = [];
    if (response && response.data) {
      routesData = response.data;
    } else if (Array.isArray(response)) {
      routesData = response;
    }
    
    return Array.isArray(routesData) ? routesData.map((route: any) => ({
      id: route.id,
      title: route.title,
      difficulty: route.difficulty || "未知",
      difficultyClass: route.difficulty_class || "medium",
      duration: route.duration || "未知",
      distance: route.distance || "未知",
      elevation: route.elevation || "未知",
      description: route.description || "",
      image: route.image || route.image_url || "/images/default-route.jpg",
      rating: parseFloat(route.rating || "0"),
      reviews: route.reviews || 0,
      location: route.location || "未知",
      seasons: Array.isArray(route.seasons) ? route.seasons : ["四季皆宜"],
      createdAt: route.created_at || route.createdAt || new Date().toISOString(),
      updatedAt: route.updated_at || route.updatedAt || new Date().toISOString()
    })) : [];
  },
  
  // 获取热门路线
  getPopularRoutes: async (): Promise<HikingRoute[]> => {
    try {
      const response = await request({
        url: 'http://localhost:3000/api/hiking-routes/popular',
        method: 'GET'
      });
      
      console.log('热门路线API响应:', response);
      
      // 修改判断条件匹配后端格式
      if (response && 
          ((response.code === 200 && Array.isArray(response.data)) || 
           (response.success === true && Array.isArray(response.data)))) {
        return response.data.map((route: any) => ({
          id: route.id,
          title: route.title,
          difficulty: route.difficulty,
          difficultyClass: route.difficulty_class || route.difficultyClass,
          duration: route.duration,
          distance: route.distance,
          elevation: route.elevation,
          description: route.description,
          image: route.image,
          rating: parseFloat(route.rating || "0"),
          reviews: route.reviews || 0,
          location: route.location || "",
          seasons: Array.isArray(route.seasons) ? route.seasons : [],
          createdAt: route.created_at || route.createdAt,
          updatedAt: route.updated_at || route.updatedAt
        }));
      }
      
      // 如果直接返回数组
      if (Array.isArray(response)) {
        return response.map((route: any) => ({
          id: route.id,
          title: route.title,
          difficulty: route.difficulty,
          difficultyClass: route.difficulty_class || route.difficultyClass,
          duration: route.duration,
          distance: route.distance,
          elevation: route.elevation,
          description: route.description,
          image: route.image,
          rating: parseFloat(route.rating || "0"),
          reviews: route.reviews || 0,
          location: route.location || "",
          seasons: Array.isArray(route.seasons) ? route.seasons : [],
          createdAt: route.created_at || route.createdAt,
          updatedAt: route.updated_at || route.updatedAt
        }));
      }
      
      console.warn('API响应格式不符合预期，使用备用数据');
      return [];
    } catch (error) {
      console.error('获取热门路线出错:', error);
      return [];
    }
  },
  
  // 获取路线详情
  getRouteById: async (id: number): Promise<HikingRoute> => {
    const response = await request({
      url: `http://localhost:3000/api/hiking-routes/${id}`,
      method: 'GET'
    });
    
    // 转换字段名为驼峰式
    const route = response.data;
    return {
      id: route.id,
      title: route.title,
      difficulty: route.difficulty,
      difficultyClass: route.difficulty_class,
      duration: route.duration,
      distance: route.distance,
      elevation: route.elevation,
      description: route.description,
      image: route.image,
      rating: route.rating,
      reviews: route.reviews,
      location: route.location,
      seasons: typeof route.seasons === 'string' ? JSON.parse(route.seasons) : route.seasons,
      createdAt: route.created_at,
      updatedAt: route.updated_at
    };
  }
}; 