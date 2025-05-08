<template>
  <DefaultLayout>
    <!-- 地图容器，充满整个内容区域 -->
    <div class="map-container">
      <!-- 使用静态图片替代iframe，避免权限问题 -->
      <div class="static-map">
        <img 
          :src="staticMapUrl" 
          alt="成都天府广场地图" 
          class="map-image"
        />
        
        <!-- 地图控件 -->
        <div class="map-controls">
          <div class="zoom-controls">
            <a-button type="primary" shape="circle" @click="zoomIn">
              <template #icon><icon-plus /></template>
            </a-button>
            <a-button type="primary" shape="circle" @click="zoomOut">
              <template #icon><icon-minus /></template>
            </a-button>
          </div>
        </div>
        
        <!-- 地图信息 -->
        <div class="map-info">
          <div class="location-info">
            <icon-location /> 当前位置：成都天府广场
          </div>
          <div class="coordinates">
            经度: 104.066801, 纬度: 30.657034
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { IconLocation, IconPlus, IconMinus } from '@arco-design/web-vue/es/icon';

// 地图参数
const zoom = ref(13);
const longitude = 104.066801; // 成都天府广场经度
const latitude = 30.657034;   // 成都天府广场纬度

// 计算静态地图URL
const staticMapUrl = ref(getStaticMapUrl());

// 生成静态地图URL的函数
function getStaticMapUrl() {
  // 高德地图静态图API URL
  const baseUrl = 'https://restapi.amap.com/v3/staticmap';
  
  // API参数
  const params = {
    location: `${longitude},${latitude}`,
    zoom: zoom.value,
    size: '1000*600',
    markers: `mid,0xFF0000,A:${longitude},${latitude}`,
    key: '02014705b4019e68cd65764c99ad3211'
  };
  
  // 构建URL参数字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${baseUrl}?${queryString}`;
}

// 缩放控制
function zoomIn() {
  if (zoom.value < 17) {
    zoom.value++;
    updateMap();
  }
}

function zoomOut() {
  if (zoom.value > 3) {
    zoom.value--;
    updateMap();
  }

}

// 更新地图
function updateMap() {
  staticMapUrl.value = getStaticMapUrl();
}

// 窗口大小变化时调整地图尺寸
function handleResize() {
  // 静态图不需要特别处理窗口大小变化
  console.log('窗口大小已变化');
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
/* 地图容器样式 */
.map-container {
  width: 100%;
  height: calc(100vh - 160px); /* 减去header和footer高度 */
  position: relative;
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f5f7f9;
  padding: 16px;
  box-sizing: border-box;
}

/* 静态地图容器 */
.static-map {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 地图图片样式 */
.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 地图控件样式 */
.map-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 地图信息样式 */
.map-info {
  position: absolute;
  left: 16px;
  bottom: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.location-info {
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.coordinates {
  font-size: 12px;
  color: #666;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .map-container {
    height: calc(100vh - 140px);
    padding: 8px;
  }
  
  .map-info {
    left: 8px;
    bottom: 8px;
    padding: 6px 12px;
  }
  
  .map-controls {
    right: 8px;
    bottom: 8px;
  }
}
</style>
