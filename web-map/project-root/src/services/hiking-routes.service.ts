import { request } from '../../frontend/src/utils/request';

// 内联定义响应类型
interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 路线数据类型定义
export interface HikingRoute {
  id: number;
  title: string;
  difficulty: string;
  difficulty_class: string;
  duration: string;
  distance: string;
  elevation: number;
  description: string;
  image_url: string;
  rating: number;
  // 其他字段...
}

// 备用数据
const backupData: HikingRoute[] = [
  {
    id: 1,
    title: '城市森林公园徒步',
    difficulty: '初级',
    difficulty_class: 'easy',
    duration: '2小时',
    distance: '5公里',
    elevation: 150,
    description: '位于城市边缘的森林公园，适合初学者的轻松徒步路线。',
    image_url: '/images/routes/city-forest.jpg',
    rating: 4.3
  },
  // 可添加更多备用数据...
];

// 服务类
export default {
  // 获取所有徒步路线
  getAllRoutes() {
    return request<BaseResponse<HikingRoute[]>>({
      url: '/hiking-routes',
      method: 'GET'
    });
  },
  
  // 获取热门徒步路线
  getPopularRoutes() {
    return request<any>({
      url: '/hiking-routes/popular',
      method: 'GET'
    })
      .then(response => {
        console.log('热门路线API响应:', response);
        
        // 1. 如果直接返回数组，直接使用
        if (Array.isArray(response)) {
          return {
            code: 200,
            message: "success",
            data: response  // 直接使用返回的数组数据
          };
        } 
        // 2. 如果返回标准格式，直接返回
        else if (response && typeof response === 'object' && 'data' in response) {
          return response;
        } 
        // 3. 其他情况使用备用数据
        else {
          return {
            code: 200,
            message: "success",
            data: backupData
          };
        }
      })
      .catch(error => {
        console.error("获取热门路线出错:", error);
        return {
          code: 500,
          message: "获取热门路线失败",
          data: backupData
        };
      });
  },
  
  // 获取路线详情
  getRouteDetail(id: number) {
    return request<BaseResponse<HikingRoute>>({
      url: `/hiking-routes/${id}`,
      method: 'GET'
    });
  }
}; 