import { defineStore } from 'pinia';
import type { UserInfo } from '@/types/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserInfo | null,
  }),
  
  getters: {
    getUserInfo: (state) => state.user,
    isLoggedIn: (state) => !!state.user,
    userRole: (state) => state.user?.role || '',
    userPermissions: (state) => state.user?.permissions || [],
  },
  
  actions: {
    setUser(user: UserInfo) {
      this.user = user;
    },
    
    updateUser(userInfo: Partial<UserInfo>) {
      if (this.user) {
        this.user = { ...this.user, ...userInfo };
      }
    },
    
    clearUser() {
      this.user = null;
    },
    
    hasPermission(permission: string): boolean {
      if (!this.user) return false;
      return this.user.permissions.includes(permission);
    },
  },
}); 