<template>
  <DefaultLayout>
    <!-- 页面标题 -->
    <div class="routes-header">
      <div class="title-area">
        <h1 class="page-title">徒步路线</h1>
        <p class="page-desc">精选全国各地高品质徒步路线，根据难度和特点分类，助您畅享户外乐趣</p>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <a-row :gutter="[16, 16]" align="center">
        <a-col :span="6">
          <a-input-search
            placeholder="搜索路线名称、地点"
            allow-clear
            v-model="searchQuery"
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
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
        <a-col :span="4">
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
        <a-col :span="4">
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
        <a-col :span="6" style="text-align: right">
          <a-radio-group type="button" v-model="sortType" @change="applyFilters">
            <a-radio value="popular">热门</a-radio>
            <a-radio value="rating">评分</a-radio>
            <a-radio value="newest">最新</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </div>

    <!-- 路线列表 -->
    <a-divider style="margin: 16px 0" />

    <div class="routes-container">
      <a-row :gutter="[24, 24]">
        <a-col :span="8" v-for="route in filteredRoutes" :key="route.id">
          <a-card class="route-card" hoverable @click="viewRouteDetail(route.id)">
            <template #cover>
              <div class="route-image" :style="{ backgroundImage: `url(${route.image})` }">
                <div class="route-difficulty" :class="route.difficultyClass">{{ route.difficulty }}</div>
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
                  <a-rate :default-value="route.rating" size="small" readonly allow-half />
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
                  <template v-for="(season, index) in route.seasons" :key="index">
                    <a-tag :color="getSeasonColor(season)">{{ season }}</a-tag>
                  </template>
                </div>
              </div>
              <a-button type="primary" shape="round">
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
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { 
  IconClockCircle, 
  IconCompass, 
  IconFire, 
  IconLocation, 
  IconRight,
  IconDown
} from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';

const router = useRouter();

// 筛选和搜索状态
const searchQuery = ref('');
const difficultyFilter = ref('');
const distanceFilter = ref('');
const durationFilter = ref('');
const sortType = ref('popular');
const currentPage = ref(1);
const hasMoreRoutes = ref(true);

// 路线数据
const allRoutes = ref([
  {
    id: 1,
    title: '龙虎山观景徒步路线',
    difficulty: '初级',
    difficultyClass: 'easy',
    duration: '3小时',
    distance: '5.8公里',
    elevation: '320米',
    description: '适合初学者的经典路线，景色优美，路况良好，可欣赏山景和溪流。',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop',
    rating: 4.5,
    reviews: 128,
    location: '四川 成都',
    seasons: ['春季', '秋季'],
    createdAt: '2023-05-15'
  },
  {
    id: 2,
    title: '青龙峡谷探险路线',
    difficulty: '中级',
    difficultyClass: 'medium',
    duration: '5小时',
    distance: '9.5公里',
    elevation: '580米',
    description: '中等难度的峡谷路线，包含部分攀爬段，沿途有多处壮观的峡谷景观。',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8,
    reviews: 97,
    location: '云南 丽江',
    seasons: ['春季', '夏季', '秋季'],
    createdAt: '2023-06-20'
  },
  {
    id: 3,
    title: '雪山高原长线徒步',
    difficulty: '高级',
    difficultyClass: 'hard',
    duration: '8小时',
    distance: '16.2公里',
    elevation: '1200米',
    description: '挑战性强的高海拔路线，需要良好的体能和户外经验，风景壮丽。',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop',
    rating: 4.9,
    reviews: 76,
    location: '西藏 林芝',
    seasons: ['夏季'],
    createdAt: '2023-04-10'
  },
  {
    id: 4,
    title: '松林湖泊环线',
    difficulty: '初级',
    difficultyClass: 'easy',
    duration: '2.5小时',
    distance: '4.2公里',
    elevation: '150米',
    description: '平缓的湖泊环线，全程树荫遮盖，非常适合夏季徒步和亲子活动。',
    image: 'https://images.unsplash.com/photo-1465311530779-5241f5a29892?q=80&w=1470&auto=format&fit=crop',
    rating: 4.3,
    reviews: 156,
    location: '浙江 杭州',
    seasons: ['春季', '夏季', '秋季'],
    createdAt: '2023-08-05'
  },
  {
    id: 5,
    title: '黄山西海大峡谷',
    difficulty: '中级',
    difficultyClass: 'medium',
    duration: '6小时',
    distance: '8.7公里',
    elevation: '750米',
    description: '穿越壮观的峡谷和山脉，欣赏黄山奇松怪石，沿途风景秀丽，适合徒步爱好者。',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1574&auto=format&fit=crop',
    rating: 4.7,
    reviews: 112,
    location: '安徽 黄山',
    seasons: ['春季', '秋季'],
    createdAt: '2023-07-12'
  },
  {
    id: 6,
    title: '海岸线礁石路线',
    difficulty: '中级',
    difficultyClass: 'medium',
    duration: '4小时',
    distance: '7.3公里',
    elevation: '210米',
    description: '沿海岸线穿行，经过多处礁石和海蚀地貌，可以欣赏壮观的海景。',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470&auto=format&fit=crop',
    rating: 4.6,
    reviews: 88,
    location: '福建 厦门',
    seasons: ['春季', '秋季', '冬季'],
    createdAt: '2023-09-18'
  }
]);

// 计算筛选后的路线
const filteredRoutes = computed(() => {
  let result = [...allRoutes.value];
  
  // 应用搜索查询
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(route => 
      route.title.toLowerCase().includes(query) || 
      route.location.toLowerCase().includes(query)
    );
  }
  
  // 应用难度筛选
  if (difficultyFilter.value) {
    result = result.filter(route => route.difficultyClass === difficultyFilter.value);
  }
  
  // 应用距离筛选
  if (distanceFilter.value) {
    result = result.filter(route => {
      const distance = parseFloat(route.distance.replace('公里', ''));
      if (distanceFilter.value === 'short') return distance <= 5;
      if (distanceFilter.value === 'medium') return distance > 5 && distance <= 10;
      if (distanceFilter.value === 'long') return distance > 10;
      return true;
    });
  }
  
  // 应用时间筛选
  if (durationFilter.value) {
    result = result.filter(route => {
      const duration = parseFloat(route.duration.replace('小时', ''));
      if (durationFilter.value === 'short') return duration <= 3;
      if (durationFilter.value === 'medium') return duration > 3 && duration <= 6;
      if (durationFilter.value === 'long') return duration > 6;
      return true;
    });
  }
  
  // 应用排序
  if (sortType.value === 'popular') {
    result.sort((a, b) => b.reviews - a.reviews);
  } else if (sortType.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortType.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return result;
});

// 处理搜索
function handleSearch() {
  applyFilters();
}

// 应用筛选
function applyFilters() {
  currentPage.value = 1;
  // 当筛选条件改变时，判断是否还有更多路线
  hasMoreRoutes.value = filteredRoutes.value.length > 6;
}

// 获取季节标签颜色
function getSeasonColor(season: string) {
  switch (season) {
    case '春季': return 'green';
    case '夏季': return 'blue';
    case '秋季': return 'orange';
    case '冬季': return 'arcoblue';
    default: return 'gray';
  }
}

// 查看路线详情
function viewRouteDetail(id: number) {
  console.log('查看路线详情:', id);
  // 跳转到路线详情页面
  // router.push(`/route/${id}`);
  Message.info('路线详情功能开发中');
}

// 加载更多路线
function loadMoreRoutes() {
  currentPage.value++;
  // 模拟加载更多路线
  // 实际应用中，这里应该调用API获取下一页的路线
  Message.success('加载更多路线成功');
  // 当没有更多路线时
  if (currentPage.value >= 3) {
    hasMoreRoutes.value = false;
  }
}

onMounted(() => {
  console.log('路线页面已加载');
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
  color: #1D2129;
}

.page-desc {
  font-size: 16px;
  color: #4E5969;
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
  background-color: #3DD2B4;
}

.medium {
  background-color: #F59B42;
}

.hard {
  background-color: #F4664A;
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
  color: #86909C;
}

.info-icon {
  font-size: 14px;
  margin-right: 4px;
}

.route-summary {
  font-size: 14px;
  color: #4E5969;
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
  color: #86909C;
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
  color: #4E5969;
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
</style> 