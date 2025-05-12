import { defineStore } from 'pinia';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isAdmin: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('auth_token') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    setUserInfo(user: User) {
      this.user = user;
    },
    
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('auth_token', token);
    },
    
    login(token: string, user: any) {
      if (user.is_admin !== undefined && user.isAdmin === undefined) {
        user.isAdmin = !!user.is_admin;
      }
      
      this.token = token;
      this.user = user;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));
      
      console.log("登录后用户数据:", this.user);
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    },
    
    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('auth_token');
    },
    
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = {
          ...this.user,
          ...userData
        } as User;
      }
    },
    
    initFromStorage() {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user_info');
      
      if (token) {
        this.token = token;
        
        if (userStr && userStr !== "undefined" && userStr !== "null") {
          try {
            const user = JSON.parse(userStr);
            if (user.is_admin !== undefined && user.isAdmin === undefined) {
              user.isAdmin = !!user.is_admin;
            }
            this.user = user;
            console.log("从存储恢复的用户数据:", this.user);
          } catch (e) {
            console.error('解析用户信息失败', e);
            localStorage.removeItem('user_info');
          }
        }
        
        if (!this.user) {
          console.log('令牌存在但用户信息无效，建议重新获取用户信息');
        }
      }
    }
  }
}); 