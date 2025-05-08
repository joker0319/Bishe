import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import NotFound from '@/views/NotFound.vue';

// 使用异步组件加载主页和地图页
const HomeView = () => import('@/views/home/HomeView.vue');
const MapView = () => import('@/views/map/MapView.vue');
const DashboardView = () => import('@/views/dashboard/DashboardView.vue');
const ForumView = () => import('@/views/forum/ForumView.vue');
const MessageView = () => import('@/views/message/MessageView.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView,
    meta: {
      requiresAuth: false,
      title: '注册'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: false,
      title: '主页'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
    meta: {
      requiresAuth: false,
      title: '户外徒步地图'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: false,
      title: '徒步路线'
    }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: ForumView,
    meta: {
      requiresAuth: false,
      title: '徒步交流论坛'
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: MessageView,
    meta: {
      requiresAuth: false,
      title: '我的消息'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      requiresAuth: false,
      title: '页面未找到'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '应用系统';
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    // 获取用户状态
    const userStore = useUserStore();
    
    if (!userStore.isLoggedIn) {
      // 临时取消重定向，直接允许访问
      next();
    } else {
      // 用户已登录，允许访问
      next();
    }
  } else {
    // 不需要认证的路由，直接访问
    next();
  }
});

export default router; 