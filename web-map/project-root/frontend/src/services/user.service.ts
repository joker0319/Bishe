import { request } from '../utils/request';

export const userService = {
  /**
   * 更新用户资料（包括头像）
   */
  async updateProfile(formData: FormData) {
    return request({
      url: 'http://localhost:3000/api/users/profile',
      method: 'PUT',
      data: formData,
      headers: {
        // 不要手动设置 Content-Type，让浏览器自动设置为 multipart/form-data
      }
    });
  },

  /**
   * 获取用户资料
   */
  async getUserProfile() {
    return request({
      url: 'http://localhost:3000/api/users/profile',
      method: 'GET'
    });
  },

  /**
   * 上传头像
   * 注意：头像上传通过a-upload组件直接处理，这里不需要额外方法
   */
};
