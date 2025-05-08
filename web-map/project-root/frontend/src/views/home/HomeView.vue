<template>
  <DefaultLayout>
    <!-- 轮播图区域 -->
    <a-carousel class="carousel" indicator-type="dot" show-arrow="hover" autoplay>
      <a-carousel-item v-for="(item, index) in carouselData" :key="index">
        <div class="carousel-item" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="carousel-content">
            <h2 class="carousel-title">{{ item.title }}</h2>
            <p class="carousel-desc">{{ item.description }}</p>
            <a-button type="primary" size="large">{{ item.buttonText }}</a-button>
          </div>
        </div>
      </a-carousel-item>
    </a-carousel>

    <!-- 四大核心功能模块 -->
    <div class="modules-section">
      <div class="section-header">
        <h2 class="section-title">探索平台功能</h2>
        <p class="section-desc">我们提供全方位的户外徒步服务</p>
      </div>

      <a-row :gutter="[36, 36]" class="modules-grid">
        <!-- 地图模块 -->
        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="module-card map-module" hoverable>
            <div class="card-content">
              <div class="module-icon-wrapper">
                <icon-location class="module-icon" />
              </div>
              <h3 class="module-title">地图导航</h3>
              <p class="module-desc">提供实时地图导航，帮助您轻松规划徒步路线，并实时掌握位置信息</p>
              <div class="module-features">
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>地形显示</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>实时定位</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>路径规划</span>
                </div>
              </div>
              <a-button class="module-button" type="outline">探索地图</a-button>
            </div>
          </a-card>
        </a-col>
        
        <!-- 路线模块 -->
        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="module-card route-module" hoverable>
            <div class="card-content">
              <div class="module-icon-wrapper">
                <icon-dashboard class="module-icon" />
              </div>
              <h3 class="module-title">徒步路线</h3>
              <p class="module-desc">精选优质徒步路线，详细的路线信息，满足不同水平的徒步爱好者</p>
              <div class="module-features">
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>难度分级</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>时长预估</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>用户评价</span>
                </div>
              </div>
              <a-button class="module-button" type="outline">浏览路线</a-button>
            </div>
          </a-card>
        </a-col>
        
        <!-- 消息模块 -->
        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="module-card message-module" hoverable>
            <div class="card-content">
              <div class="module-icon-wrapper">
                <icon-message class="module-icon" />
              </div>
              <h3 class="module-title">徒步消息</h3>
              <p class="module-desc">获取重要通知和消息，包括天气预警、活动邀请和徒步小组的实时动态</p>
              <div class="module-features">
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>消息通知</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>天气预警</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>活动提醒</span>
                </div>
              </div>
              <a-button class="module-button" type="outline">查看消息</a-button>
            </div>
          </a-card>
        </a-col>
        
        <!-- 交流模块 -->
        <a-col :xs="24" :sm="12" :md="12" :lg="6">
          <a-card class="module-card forum-module" hoverable>
            <div class="card-content">
              <div class="module-icon-wrapper">
                <icon-common class="module-icon" />
              </div>
              <h3 class="module-title">户外交流</h3>
              <p class="module-desc">与其他徒步爱好者分享经验和心得，结识志同道合的伙伴，组织户外活动</p>
              <div class="module-features">
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>经验分享</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>结伴同行</span>
                </div>
                <div class="feature-item">
                  <icon-check-circle-fill class="feature-icon" />
                  <span>活动组织</span>
                </div>
              </div>
              <a-button class="module-button" type="outline">加入交流</a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 统计数据展示 -->
    <div class="stats-section">
      <a-row :gutter="16" class="stats-grid">
        <a-col :span="6" v-for="(stat, index) in statsData" :key="index">
          <a-statistic 
            :value="stat.value" 
            :title="stat.title"
            :suffix="stat.suffix"
            :value-style="{ color: stat.color, fontSize: '28px', fontWeight: '600' }"
            animation
          />
        </a-col>
      </a-row>
    </div>

    <!-- 热门路线展示 -->
    <div class="popular-routes-section">
      <div class="section-header">
        <h2 class="section-title">热门路线</h2>
        <a-link>查看全部</a-link>
      </div>

      <a-row :gutter="[24, 24]">
        <a-col :span="8" v-for="(route, index) in routesData" :key="index">
          <a-card class="route-card" hoverable>
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
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 徒步资讯 -->
    <div class="hiking-tips-section">
      <div class="section-header">
        <h2 class="section-title">徒步资讯</h2>
        <a-link>更多资讯</a-link>
      </div>

      <a-row :gutter="[24, 24]">
        <a-col :span="8" v-for="(article, index) in articlesData" :key="index">
          <a-card class="article-card" hoverable>
            <template #cover>
              <div class="article-image" :style="{ backgroundImage: `url(${article.image})` }"></div>
            </template>
            <a-card-meta :title="article.title">
              <template #description>
                <p class="article-summary">{{ article.summary }}</p>
                <div class="article-meta">
                  <span class="article-date">{{ article.date }}</span>
                  <a-tag>{{ article.category }}</a-tag>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { 
  IconLocation,
  IconDashboard, 
  IconMessage, 
  IconCommon,
  IconCheckCircleFill,
  IconClockCircle,
  IconCompass,
  IconFire
} from '@arco-design/web-vue/es/icon';

// 轮播图数据
const carouselData = ref([
  {
    title: '探索自然的奇妙之旅',
    description: '开启您的户外徒步之旅，发现大自然的美丽与惊喜',
    buttonText: '开始探索',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop',
  },
  {
    title: '与志同道合的人同行',
    description: '加入徒步社区，结识新朋友，共同享受徒步乐趣',
    buttonText: '加入我们',
    image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1374&auto=format&fit=crop',
  },
  {
    title: '安全可靠的户外向导',
    description: '精准导航，详细路线，全方位保障您的户外安全',
    buttonText: '了解更多',
    image: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?q=80&w=1470&auto=format&fit=crop',
  },
]);

// 统计数据
const statsData = ref([
  {
    title: '注册用户',
    value: 25680,
    color: '#4080FF',
  },
  {
    title: '路线总数',
    value: 1256,
    color: '#3DD2B4',
  },
  {
    title: '总行程',
    value: 86420,
    suffix: 'km',
    color: '#7265E3',
  },
  {
    title: '活跃社区',
    value: 326,
    color: '#F4664A',
  },
]);

// 热门路线数据
const routesData = ref([
  {
    title: '龙虎山观景徒步路线',
    difficulty: '初级',
    difficultyClass: 'easy',
    duration: '3小时',
    distance: '5.8公里',
    elevation: '320米',
    description: '适合初学者的经典路线，景色优美，路况良好，可欣赏山景和溪流。',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop',
    rating: 4.5,
    reviews: 128
  },
  {
    title: '青龙峡谷探险路线',
    difficulty: '中级',
    difficultyClass: 'medium',
    duration: '5小时',
    distance: '9.5公里',
    elevation: '580米',
    description: '中等难度的峡谷路线，包含部分攀爬段，沿途有多处壮观的峡谷景观。',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8,
    reviews: 97
  },
  {
    title: '雪山高原长线徒步',
    difficulty: '高级',
    difficultyClass: 'hard',
    duration: '8小时',
    distance: '16.2公里',
    elevation: '1200米',
    description: '挑战性强的高海拔路线，需要良好的体能和户外经验，风景壮丽。',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop',
    rating: 4.9,
    reviews: 76
  }
]);

// 徒步资讯数据
const articlesData = ref([
  {
    title: '初学者徒步装备指南',
    summary: '为初次徒步的爱好者提供全面的装备选购建议，从鞋子到背包，一应俱全...',
    image: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=1470&auto=format&fit=crop',
    date: '2023-06-15',
    category: '装备指南'
  },
  {
    title: '高海拔徒步注意事项',
    summary: '高海拔环境对人体有特殊要求，本文详细介绍高海拔徒步的准备工作和应对方法...',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1476&auto=format&fit=crop',
    date: '2023-06-08',
    category: '安全指南'
  },
  {
    title: '四季徒步最佳目的地推荐',
    summary: '根据不同季节特点，推荐最适合当季徒步的目的地，让您一年四季都能享受徒步乐趣...',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1476&auto=format&fit=crop',
    date: '2023-05-28',
    category: '目的地'
  }
]);
</script>

<style scoped>
.carousel {
  height: 500px;
  margin-bottom: 60px;
}

.carousel-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.carousel-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.carousel-content {
  max-width: 800px;
  color: white;
  text-align: center;
  position: relative;
  z-index: 1;
}

.carousel-title {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 600;
}

.carousel-desc {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1D2129;
}

.section-desc {
  font-size: 16px;
  color: #86909C;
}

.modules-section {
  padding: 60px 0;
}

.module-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.module-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.map-module .module-icon-wrapper {
  background: rgba(64, 128, 255, 0.1);
  color: #4080FF;
}

.route-module .module-icon-wrapper {
  background: rgba(61, 210, 180, 0.1);
  color: #3DD2B4;
}

.message-module .module-icon-wrapper {
  background: rgba(114, 101, 227, 0.1);
  color: #7265E3;
}

.forum-module .module-icon-wrapper {
  background: rgba(244, 102, 74, 0.1);
  color: #F4664A;
}

.module-icon {
  font-size: 28px;
}

.module-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1D2129;
}

.module-desc {
  font-size: 14px;
  color: #4E5969;
  margin-bottom: 20px;
  flex-grow: 1;
  line-height: 1.6;
}

.module-features {
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4E5969;
}

.feature-icon {
  font-size: 16px;
  margin-right: 8px;
}

.map-module .feature-icon {
  color: #4080FF;
}

.route-module .feature-icon {
  color: #3DD2B4;
}

.message-module .feature-icon {
  color: #7265E3;
}

.forum-module .feature-icon {
  color: #F4664A;
}

.module-button {
  align-self: flex-start;
}

.map-module .module-button {
  color: #4080FF;
  border-color: #4080FF;
}

.route-module .module-button {
  color: #3DD2B4;
  border-color: #3DD2B4;
}

.message-module .module-button {
  color: #7265E3;
  border-color: #7265E3;
}

.forum-module .module-button {
  color: #F4664A;
  border-color: #F4664A;
}

.stats-section {
  padding: 60px 0;
  background-color: #F2F3F5;
  margin: 40px 0;
  border-radius: 12px;
}

.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.popular-routes-section,
.hiking-tips-section {
  padding: 60px 0;
}

.route-card,
.article-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.route-card:hover,
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.route-image,
.article-image {
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

.route-summary,
.article-summary {
  font-size: 14px;
  color: #4E5969;
  margin-bottom: 12px;
  line-height: 1.6;
}

.route-meta,
.article-meta {
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

.article-date {
  font-size: 12px;
}

@media (max-width: 768px) {
  .carousel-title {
    font-size: 26px;
  }
  
  .carousel-desc {
    font-size: 16px;
  }
  
  .stats-grid :deep(.arco-col) {
    width: 50%;
    margin-bottom: 24px;
  }
}
</style> 