<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useUserStore } from "./stores/user.store";
import { userService } from "./services/user.service";

const userStore = useUserStore();

onMounted(async () => {
  // 从本地存储初始化用户状态
  userStore.initFromStorage();

  // 如果有令牌但没有用户信息，自动获取用户信息
  if (userStore.token && !userStore.user) {
    try {
      console.log("正在获取用户信息...");
      const userData = await userService.getUserProfile();
      userStore.setUserInfo(userData.data);

      // 更新本地存储
      localStorage.setItem("user_info", JSON.stringify(userData.data));
      console.log("用户信息获取成功");
    } catch (error) {
      console.error("自动获取用户信息失败:", error);
      // 如果获取失败可能是令牌无效，清除令牌
      userStore.logout();
    }
  }
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

#app,
.app-container {
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
