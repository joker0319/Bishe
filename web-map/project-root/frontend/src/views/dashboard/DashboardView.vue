<template>
  <DefaultLayout>
    <!-- 页面标题 -->
    <div class="routes-header">
      <div class="title-area">
        <h1 class="page-title">徒步路线</h1>
        <p class="page-desc">
          精选全国各地高品质徒步路线，根据难度和特点分类，助您畅享户外乐趣
        </p>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <a-row :gutter="[16, 16]" align="center">
        <a-col :span="8">
          <a-input-search
            placeholder="搜索路线名称、地点"
            allow-clear
            v-model="searchQuery"
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="5">
          <a-select
            placeholder="难度等级"
            v-model="difficultyFilter"
            allow-clear
            @change="applyFilters"
          >
            <a-option value="easy">初级路线</a-option>
            <a-option value="medium">中级路线</a-option>
            <a-option value="hard">高级路线</a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select
            placeholder="路线长度"
            v-model="distanceFilter"
            allow-clear
            @change="applyFilters"
          >
            <a-option value="short">短距离 (≤5公里)</a-option>
            <a-option value="medium">中等距离 (5-10公里)</a-option>
            <a-option value="long">长距离 (>10公里)</a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select
            placeholder="所需时间"
            v-model="durationFilter"
            allow-clear
            @change="applyFilters"
          >
            <a-option value="short">短时间 (≤3小时)</a-option>
            <a-option value="medium">中等时间 (3-6小时)</a-option>
            <a-option value="long">长时间 (>6小时)</a-option>
          </a-select>
        </a-col>
      </a-row>
    </div>

    <!-- 路线列表 -->
    <a-divider style="margin: 16px 0" />

    <div class="routes-container">
      <a-row :gutter="[24, 24]">
        <a-col :span="8" v-for="route in filteredRoutes" :key="route.id">
          <a-card
            class="route-card"
            hoverable
            @click="viewRouteDetail(route.id)"
          >
            <template #cover>
              <div
                class="route-image"
                :style="{ backgroundImage: `url(${route.image})` }"
              >
                <div class="route-difficulty" :class="route.difficultyClass">
                  {{ route.difficulty }}
                </div>
              </div>
            </template>
            <a-card-meta :title="route.title">
              <template #description>
                <div class="route-info">
                  <div class="route-detail">
                    <icon-clock-circle class="info-icon" />
                    <span>{{ route.duration }}</span>
                  </div>
                  <div class="route-detail">
                    <icon-compass class="info-icon" />
                    <span>{{ route.distance }}</span>
                  </div>
                  <div class="route-detail">
                    <icon-fire class="info-icon" />
                    <span>{{ route.elevation }}</span>
                  </div>
                </div>
                <p class="route-summary">{{ route.description }}</p>
                <div class="route-meta">
                  <a-rate
                    :default-value="route.rating"
                    size="small"
                    readonly
                    allow-half
                  />
                  <span class="review-count">{{ route.reviews }}条评价</span>
                </div>
              </template>
            </a-card-meta>

            <div class="route-footer">
              <div class="route-extra-info">
                <div class="location">
                  <icon-location />
                  <span>{{ route.location }}</span>
                </div>
                <div class="seasons">
                  <template
                    v-for="(season, index) in route.seasons"
                    :key="index"
                  >
                    <a-tag :color="getSeasonColor(season)">{{ season }}</a-tag>
                  </template>
                </div>
              </div>
              <a-button
                type="primary"
                shape="round"
                @click.stop="openRouteDetail(route)"
              >
                查看详情
                <template #icon><icon-right /></template>
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMoreRoutes">
        <a-button type="text" @click="loadMoreRoutes">
          加载更多路线
          <template #icon><icon-down /></template>
        </a-button>
      </div>
    </div>

    <!-- 路线详情弹窗 -->
    <a-modal
      v-model:visible="detailVisible"
      :title="selectedRoute?.title"
      :footer="false"
      :maskClosable="true"
      width="700px"
    >
      <div v-if="selectedRoute" class="route-detail-modal">
        <!-- 路线图片 -->
        <div
          class="route-detail-image"
          :style="{ backgroundImage: `url(${selectedRoute.image})` }"
        >
          <div class="route-difficulty" :class="selectedRoute.difficultyClass">
            {{ selectedRoute.difficulty }}
          </div>
        </div>

        <!-- 路线基本信息 -->
        <div class="route-detail-info">
          <div class="info-row">
            <div class="info-item">
              <icon-clock-circle class="info-icon" />
              <span>时长: {{ selectedRoute.duration }}</span>
            </div>
            <div class="info-item">
              <icon-compass class="info-icon" />
              <span>距离: {{ selectedRoute.distance }}</span>
            </div>
            <div class="info-item">
              <icon-fire class="info-icon" />
              <span>海拔: {{ selectedRoute.elevation }}</span>
            </div>
          </div>

          <div class="info-item location">
            <icon-location class="info-icon" />
            <span>位置: {{ selectedRoute.location }}</span>
          </div>

          <div class="info-item seasons">
            <span>最佳季节: </span>
            <template
              v-for="(season, index) in selectedRoute.seasons"
              :key="index"
            >
              <a-tag :color="getSeasonColor(season)">{{ season }}</a-tag>
            </template>
          </div>
        </div>

        <!-- 路线描述 -->
        <a-divider>路线详情</a-divider>
        <div class="route-description">
          <p>{{ selectedRoute.description }}</p>
        </div>
      </div>
    </a-modal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import {
  hikingRoutesService,
  HikingRoute,
} from "../../services/hiking-routes.service";
import {
  IconClockCircle,
  IconCompass,
  IconFire,
  IconLocation,
  IconRight,
  IconDown,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";

const router = useRouter();

// 筛选和搜索状态
const searchQuery = ref("");
const difficultyFilter = ref("");
const distanceFilter = ref("");
const durationFilter = ref("");
const currentPage = ref(1);
const hasMoreRoutes = ref(true);

// 路线数据，初始为空数组
const allRoutes = ref<HikingRoute[]>([]);
const loading = ref(true);

// 添加弹窗状态管理
const detailVisible = ref(false);
const selectedRoute = ref<HikingRoute | null>(null);

// 从API获取路线数据
const fetchRoutes = async () => {
  try {
    loading.value = true;
    const routes = await hikingRoutesService.getAllRoutes();
    allRoutes.value = routes;
  } catch (error) {
    console.error("获取路线数据失败:", error);
    Message.error("获取路线数据失败，请刷新页面重试");
  } finally {
    loading.value = false;
  }
};

// 计算筛选后的路线
const filteredRoutes = computed(() => {
  let result = [...allRoutes.value];
  console.log("筛选前路线数:", result.length);

  // 应用搜索查询
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (route) =>
        route.title.toLowerCase().includes(query) ||
        route.location.toLowerCase().includes(query)
    );
    console.log("搜索后路线数:", result.length);
  }

  // 应用难度筛选
  if (difficultyFilter.value) {
    result = result.filter(
      (route) => route.difficultyClass === difficultyFilter.value
    );
    console.log("难度筛选后路线数:", result.length);
  }

  // 应用距离筛选
  if (distanceFilter.value) {
    result = result.filter((route) => {
      // 提取数字部分
      const distanceStr = route.distance.replace(/[^0-9.]/g, "");
      const distance = parseFloat(distanceStr);

      if (distanceFilter.value === "short") return distance <= 5;
      if (distanceFilter.value === "medium")
        return distance > 5 && distance <= 10;
      if (distanceFilter.value === "long") return distance > 10;
      return true;
    });
    console.log("距离筛选后路线数:", result.length);
  }

  // 应用时间筛选
  if (durationFilter.value) {
    result = result.filter((route) => {
      // 提取数字部分
      const durationStr = route.duration.replace(/[^0-9.]/g, "");
      const duration = parseFloat(durationStr);

      if (durationFilter.value === "short") return duration <= 3;
      if (durationFilter.value === "medium")
        return duration > 3 && duration <= 6;
      if (durationFilter.value === "long") return duration > 6;
      return true;
    });
    console.log("时间筛选后路线数:", result.length);
  }

  return result;
});

// 处理搜索
function handleSearch() {
  console.log("执行搜索:", searchQuery.value);
  applyFilters();
}

// 应用筛选
function applyFilters() {
  console.log("应用筛选条件:", {
    搜索: searchQuery.value,
    难度: difficultyFilter.value,
    距离: distanceFilter.value,
    时间: durationFilter.value,
  });

  currentPage.value = 1;
  hasMoreRoutes.value = filteredRoutes.value.length > 6;

  if (filteredRoutes.value.length === 0) {
    Message.info("没有符合条件的路线，请尝试其他筛选条件");
  }
}

// 获取季节标签颜色
function getSeasonColor(season: string) {
  switch (season) {
    case "春季":
      return "green";
    case "夏季":
      return "blue";
    case "秋季":
      return "orange";
    case "冬季":
      return "arcoblue";
    default:
      return "gray";
  }
}

// 打开路线详情弹窗
function openRouteDetail(route: HikingRoute) {
  selectedRoute.value = route;
  detailVisible.value = true;
}

// 查看路线详情
function viewRouteDetail(id: number) {
  const route = allRoutes.value.find((r) => r.id === id);
  if (route) {
    openRouteDetail(route);
  } else {
    Message.error("未找到路线详情");
  }
}

// 加载更多路线
function loadMoreRoutes() {
  currentPage.value++;
  // 模拟加载更多路线
  // 实际应用中，这里应该调用API获取下一页的路线
  Message.success("加载更多路线成功");
  // 当没有更多路线时
  if (currentPage.value >= 3) {
    hasMoreRoutes.value = false;
  }
}

onMounted(() => {
  fetchRoutes();
});
</script>

<style scoped>
.routes-header {
  padding: 40px 0;
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1d2129;
}

.page-desc {
  font-size: 16px;
  color: #4e5969;
  max-width: 700px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 20px;
}

.routes-container {
  margin-top: 20px;
  margin-bottom: 60px;
}

.route-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.route-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.route-difficulty {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.easy {
  background-color: #3dd2b4;
}

.medium {
  background-color: #f59b42;
}

.hard {
  background-color: #f4664a;
}

.route-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 4px;
}

.route-detail {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #86909c;
}

.info-icon {
  font-size: 14px;
  margin-right: 4px;
}

.route-summary {
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  color: #86909c;
  font-size: 12px;
}

.review-count {
  margin-left: 8px;
}

.route-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  border-top: 1px solid #f2f3f5;
  padding-top: 16px;
}

.route-extra-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #4e5969;
}

.seasons {
  display: flex;
  gap: 4px;
}

.load-more {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .filter-section :deep(.arco-col) {
    margin-bottom: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-desc {
    font-size: 14px;
  }
}

/* 添加弹窗样式 */
.route-detail-modal {
  padding: 0;
}

.route-detail-image {
  height: 280px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px;
  margin-bottom: 20px;
}

.route-detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 8px;
}

.route-description {
  line-height: 1.8;
  color: #4e5969;
  text-align: justify;
  margin-bottom: 20px;
}
</style> 