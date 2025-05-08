<template>
  <a-layout class="layout-container">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="header-container">
        <!-- 左侧部分：Logo和导航菜单 -->
        <div class="left-section">
          <!-- Logo -->
          <div class="logo">
            <img src="@/assets/images/logo.svg" alt="Logo" height="32" />
            <span class="logo-text">智能户外徒步平台</span>
          </div>
          
          <!-- 导航菜单 -->
          <div class="nav-menu">
            <div class="menu-items">
              <div class="menu-item" :class="{ active: selectedKeys.includes('home') }" @click="selectMenuItem('home')">
                <icon-home class="menu-icon" />
                <span>首页</span>
              </div>
              <div class="menu-item" :class="{ active: selectedKeys.includes('map') }" @click="selectMenuItem('map')">
                <icon-location class="menu-icon" />
                <span>地图</span>
              </div>
              <div class="menu-item" :class="{ active: selectedKeys.includes('dashboard') }" @click="selectMenuItem('dashboard')">
                <icon-dashboard class="menu-icon" />
                <span>路线</span>
              </div>
              <div class="menu-item" :class="{ active: selectedKeys.includes('forum') }" @click="selectMenuItem('forum')">
                <icon-common class="menu-icon" />
                <span>交流</span>
              </div>
              <div class="menu-item" :class="{ active: selectedKeys.includes('message') }" @click="selectMenuItem('message')">
                <icon-message class="menu-icon" />
                <span>消息</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧用户操作区 -->
        <div class="user-actions">
          <a-space>
            <a-button type="primary" @click="handleLogin">
              <template #icon><icon-user /></template>
              登录
            </a-button>
          </a-space>
        </div>
      </div>
    </a-layout-header>
    
    <!-- 内容区域 -->
    <a-layout-content class="content">
      <slot></slot>
    </a-layout-content>
    
    <!-- 底部区域 -->
    <a-layout-footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a-space size="large">
            <a href="#">关于我们</a>
            <a href="#">帮助中心</a>
            <a href="#">条款</a>
            <a href="#">隐私政策</a>
          </a-space>
        </div>
        <div class="copyright">
          © {{ new Date().getFullYear() }} 公司名称. 保留所有权利
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconHome, 
  IconDashboard, 
  IconMessage, 
  IconUser, 
  IconNotification, 
  IconSettings,
  IconLocation,
  IconCommon
} from '@arco-design/web-vue/es/icon';

// 路由
const router = useRouter();
const route = useRoute();

// 当前选中的菜单项
const selectedKeys = ref(['home']);

// 根据路由路径设置激活的菜单项
const updateSelectedMenuByRoute = (path: string) => {
  if (path.includes('/home')) {
    selectedKeys.value = ['home'];
  } else if (path.includes('/map')) {
    selectedKeys.value = ['map'];
  } else if (path.includes('/dashboard')) {
    selectedKeys.value = ['dashboard'];
  } else if (path.includes('/message')) {
    selectedKeys.value = ['message'];
  } else if (path.includes('/forum')) {
    selectedKeys.value = ['forum'];
  }
};

// 监听路由变化，更新菜单激活状态
watch(
  () => route.path,
  (newPath) => {
    updateSelectedMenuByRoute(newPath);
  }
);

// 初始化时根据当前路由设置激活菜单
onMounted(() => {
  updateSelectedMenuByRoute(route.path);
});

// 处理菜单项选择
const selectMenuItem = (key: string) => {
  selectedKeys.value = [key];
  // 根据不同菜单项导航到不同页面
  if (key === 'home') {
    router.push('/home');
  } else if (key === 'dashboard') {
    router.push('/dashboard');
  } else if (key === 'message') {
    router.push('/message');
  } else if (key === 'map') {
    router.push('/map');
  } else if (key === 'forum') {
    router.push('/forum');
  }
};

// 处理登录按钮点击
const handleLogin = () => {
  router.push('/auth/login');
};
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.header {
  position: fixed;
  width: 100%;
  padding: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 40px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nav-menu {
  height: 100%;
}

.menu-items {
  display: flex;
  height: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.menu-item:hover {
  color: #165DFF;
  background-color: rgba(22, 93, 255, 0.05);
}

.menu-item.active {
  color: #165DFF;
  border-bottom: 2px solid #165DFF;
}

.menu-icon {
  margin-right: 5px;
}

.content {
  padding: 80px 20px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 60px - 100px); /* 减去header和footer的高度 */
}

.footer {
  background-color: #f5f5f5;
  padding: 20px;
  height: 100px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.footer-links a {
  color: #555;
  text-decoration: none;
}

.copyright {
  color: #999;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .left-section {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .logo {
    margin-right: 0;
  }
  
  .menu-items {
    gap: 10px;
  }
  
  .menu-item {
    padding: 0 10px;
    height: 40px;
  }
  
  .user-actions {
    align-self: flex-end;
  }
}
</style> 