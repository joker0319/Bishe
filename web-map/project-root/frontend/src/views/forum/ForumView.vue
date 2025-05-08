<template>
  <DefaultLayout>
    <div class="forum-container">
      <!-- 页面标题 -->
      <div class="forum-header">
        <div class="title-area">
          <h1 class="page-title">徒步交流论坛</h1>
          <p class="page-desc">分享您的徒步经验、路线推荐、装备心得，与其他户外爱好者交流讨论</p>
        </div>
        <div class="action-area">
          <a-button type="primary" size="large" @click="showPostModal">
            <template #icon><icon-edit /></template>
            发布新帖子
          </a-button>
        </div>
      </div>

      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <a-row :gutter="[16, 16]" align="center">
          <a-col :span="8">
            <a-input-search
              placeholder="搜索帖子标题、内容或用户"
              allow-clear
              v-model="searchQuery"
              @search="handleSearch"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              placeholder="帖子分类"
              v-model="categoryFilter"
              allow-clear
              @change="filterPosts"
            >
              <a-option value="route">路线分享</a-option>
              <a-option value="experience">徒步经验</a-option>
              <a-option value="gear">装备心得</a-option>
              <a-option value="photography">风景摄影</a-option>
              <a-option value="gathering">结伴出行</a-option>
            </a-select>
          </a-col>
          <a-col :span="12" style="text-align: right">
            <a-radio-group type="button" v-model="sortType" @change="filterPosts">
              <a-radio value="latest">最新发布</a-radio>
              <a-radio value="popular">最多浏览</a-radio>
              <a-radio value="hottest">最热帖子</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </div>

      <!-- 帖子列表 -->
      <div class="forum-content">
        <a-spin :loading="loading" style="width: 100%">
          <a-card v-for="post in filteredPosts" :key="post.id" class="post-card" hoverable>
            <div class="post-header">
              <div class="user-info">
                <a-avatar :size="40" :image-url="post.author.avatar" />
                <div class="user-details">
                  <div class="username">{{ post.author.name }}</div>
                  <div class="post-time">{{ formatDate(post.createdAt) }}</div>
                </div>
              </div>
              <a-tag :color="getCategoryColor(post.category)">{{ getCategoryName(post.category) }}</a-tag>
            </div>
            
            <div class="post-title" @click="viewPostDetail(post.id)">{{ post.title }}</div>
            
            <div class="post-content">
              <p>{{ post.summary }}</p>
            </div>
            
            <div class="post-images" v-if="post.images && post.images.length">
              <a-image-preview-group infinite>
                <a-space>
                  <a-image 
                    v-for="(image, index) in post.images.slice(0, 3)" 
                    :key="index" 
                    :src="image" 
                    width="120" 
                    height="80" 
                    :preview-visible="false"
                    fit="cover" 
                  />
                  <div class="more-images" v-if="post.images.length > 3">
                    +{{ post.images.length - 3 }}
                  </div>
                </a-space>
              </a-image-preview-group>
            </div>
            
            <div class="post-footer">
              <div class="post-stats">
                <span class="stat-item">
                  <icon-eye class="icon" />
                  {{ post.views }}
                </span>
                <span class="stat-item">
                  <icon-message class="icon" />
                  {{ post.comments }}
                </span>
                <span class="stat-item">
                  <icon-thumb-up class="icon" :style="{ color: post.isLiked ? '#165DFF' : '' }" />
                  {{ post.likes }}
                </span>
              </div>
              <a-button type="text" @click="viewPostDetail(post.id)">
                查看详情
                <template #icon><icon-right /></template>
              </a-button>
            </div>
          </a-card>
          
          <div class="empty-state" v-if="filteredPosts.length === 0 && !loading">
            <a-empty description="没有找到符合条件的帖子" />
          </div>
          
          <!-- 加载更多 -->
          <div class="load-more" v-if="hasMorePosts && filteredPosts.length > 0">
            <a-button type="text" @click="loadMorePosts" :loading="loadingMore">
              {{ loadingMore ? '加载中...' : '加载更多帖子' }}
              <template #icon><icon-down /></template>
            </a-button>
          </div>
        </a-spin>
      </div>
    </div>

    <!-- 发帖模态框 -->
    <a-modal
      v-model:visible="postModalVisible"
      :mask-closable="false"
      :unmount-on-close="false"
      title="发布新帖子"
      ok-text="发布"
      cancel-text="取消"
      :ok-button-props="{ disabled: !isFormValid }"
      @ok="submitPost"
      @cancel="cancelPost"
      style="width: 700px"
    >
      <a-form :model="postForm" layout="vertical">
        <a-form-item field="title" label="标题" :rules="[{ required: true, message: '请输入帖子标题' }]">
          <a-input v-model="postForm.title" placeholder="请输入帖子标题" allow-clear :max-length="100" show-word-limit />
        </a-form-item>
        
        <a-form-item field="category" label="分类" :rules="[{ required: true, message: '请选择帖子分类' }]">
          <a-select v-model="postForm.category" placeholder="请选择帖子分类">
            <a-option value="route">路线分享</a-option>
            <a-option value="experience">徒步经验</a-option>
            <a-option value="gear">装备心得</a-option>
            <a-option value="photography">风景摄影</a-option>
            <a-option value="gathering">结伴出行</a-option>
          </a-select>
        </a-form-item>
        
        <a-form-item field="content" label="内容" :rules="[{ required: true, message: '请输入帖子内容' }]">
          <a-textarea 
            v-model="postForm.content" 
            placeholder="分享您的徒步经验或问题..."
            allow-clear 
            :max-length="5000" 
            show-word-limit 
            :auto-size="{ minRows: 6, maxRows: 12 }"
          />
        </a-form-item>
        
        <a-form-item field="images" label="上传图片">
          <a-upload
            list-type="picture-card"
            :multiple="true"
            :limit="9"
            v-model:file-list="uploadImages"
            :custom-request="handleUpload"
            @change="handleImagesChange"
          >
            <template #upload-button>
              <div>
                <icon-plus />
                <div style="margin-top: 10px">上传图片</div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
        
        <a-form-item field="location" label="位置(可选)">
          <a-input v-model="postForm.location" placeholder="输入相关地点位置，如：浙江省杭州市西湖区" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { 
  IconEdit, 
  IconEye, 
  IconMessage, 
  IconThumbUp, 
  IconRight, 
  IconDown,
  IconPlus
} from '@arco-design/web-vue/es/icon';

const router = useRouter();

// 状态
const loading = ref(false);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const searchQuery = ref('');
const categoryFilter = ref('');
const sortType = ref('latest');
const currentPage = ref(1);
const postModalVisible = ref(false);
const uploadImages = ref([]);

// 帖子表单
const postForm = reactive({
  title: '',
  category: '',
  content: '',
  images: [] as string[],
  location: ''
});

// 表单验证
const isFormValid = computed(() => {
  return postForm.title && postForm.category && postForm.content;
});

// 模拟的帖子数据
const posts = ref([
  {
    id: 1,
    title: '黄山徒步三日游经验分享，适合新手的路线攻略',
    summary: '上周末和朋友一起完成了黄山三日徒步，特地来分享一下路线规划和经验心得。全程约25公里，风景绝佳，适合有一定体力基础的新手。注意带足饮水和防晒...',
    content: '详细内容',
    category: 'route',
    author: {
      id: 101,
      name: '山野行者',
      avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image'
    },
    createdAt: '2023-06-20T08:30:00Z',
    images: [
      'https://p1-arco.byteimg.com/oss-cn-beijing/fe83863f-223a-4a02-8d17-60151eb9e8e2~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/a2d3713a-5fab-4429-9d9a-cafc63b42e4a~tplv-k3u1fbpfcp-image.image'
    ],
    views: 1253,
    likes: 89,
    comments: 32,
    isLiked: false,
    location: '安徽省黄山市'
  },
  {
    id: 2,
    title: '徒步装备选购指南：登山鞋如何挑选？',
    summary: '作为一名有5年徒步经验的户外爱好者，我想分享一下关于徒步登山鞋的选购经验。好的登山鞋对徒步体验至关重要，一双合适的鞋能让你避免很多不必要的困扰...',
    content: '详细内容',
    category: 'gear',
    author: {
      id: 102,
      name: '装备控',
      avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image'
    },
    createdAt: '2023-06-18T14:25:00Z',
    images: [
      'https://p1-arco.byteimg.com/oss-cn-beijing/b76281d9-207b-45c2-945e-c707057b76c8~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/adf55591-6348-412d-ac29-cc27b4b6d72c~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/b0e7b07f-97c5-4819-95b6-90e8fa9dfb3a~tplv-k3u1fbpfcp-image.image'
    ],
    views: 2018,
    likes: 156,
    comments: 45,
    isLiked: true,
    location: ''
  },
  {
    id: 3,
    title: '寻找结伴：7月15日计划徒步武功山，有兴趣的同伴吗？',
    summary: '计划7月15-17日徒步武功山，目前已有3人确定，希望再找2-3位同伴一起。路线已规划好，住宿也已安排。要求有一定徒步经验，身体状况良好...',
    content: '详细内容',
    category: 'gathering',
    author: {
      id: 103,
      name: '行走的云',
      avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image'
    },
    createdAt: '2023-06-15T20:10:00Z',
    images: [
      'https://p1-arco.byteimg.com/oss-cn-beijing/c4c1e291-1843-46c2-8c77-bf7d58d4b8c7~tplv-k3u1fbpfcp-image.image'
    ],
    views: 876,
    likes: 24,
    comments: 38,
    isLiked: false,
    location: '江西省萍乡市武功山'
  },
  {
    id: 4,
    title: '高原徒步注意事项：我在玉龙雪山的经验教训',
    summary: '上个月去云南徒步玉龙雪山，海拔4500米的高原环境让我吃了不少苦头。这里分享一些高原徒步的经验教训，希望对计划去高海拔地区徒步的朋友有所帮助...',
    content: '详细内容',
    category: 'experience',
    author: {
      id: 104,
      name: '高原客',
      avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image'
    },
    createdAt: '2023-06-10T09:40:00Z',
    images: [
      'https://p1-arco.byteimg.com/oss-cn-beijing/d7a1ce97-56c9-4e56-8e63-1e0023e1a375~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/61da20b8-7450-434a-9cf4-20e20aab4d33~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/fe83863f-223a-4a02-8d17-60151eb9e8e2~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/a2d3713a-5fab-4429-9d9a-cafc63b42e4a~tplv-k3u1fbpfcp-image.image'
    ],
    views: 3524,
    likes: 214,
    comments: 67,
    isLiked: false,
    location: '云南省丽江市玉龙雪山'
  },
  {
    id: 5,
    title: '杭州西湖徒步一日游，拍了一些很棒的照片',
    summary: '周末在杭州西湖徒步了一整天，沿湖走了一圈，拍了很多照片。虽然人多，但风景确实很美。分享一些拍摄技巧和最佳取景点...',
    content: '详细内容',
    category: 'photography',
    author: {
      id: 105,
      name: '镜头里的世界',
      avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image'
    },
    createdAt: '2023-06-05T16:55:00Z',
    images: [
      'https://p1-arco.byteimg.com/oss-cn-beijing/b76281d9-207b-45c2-945e-c707057b76c8~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/adf55591-6348-412d-ac29-cc27b4b6d72c~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/b0e7b07f-97c5-4819-95b6-90e8fa9dfb3a~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/c4c1e291-1843-46c2-8c77-bf7d58d4b8c7~tplv-k3u1fbpfcp-image.image',
      'https://p1-arco.byteimg.com/oss-cn-beijing/d7a1ce97-56c9-4e56-8e63-1e0023e1a375~tplv-k3u1fbpfcp-image.image'
    ],
    views: 1876,
    likes: 203,
    comments: 42,
    isLiked: true,
    location: '浙江省杭州市西湖区'
  }
]);

// 过滤后的帖子
const filteredPosts = computed(() => {
  let result = [...posts.value];
  
  // 应用搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.summary.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query)
    );
  }
  
  // 应用分类过滤
  if (categoryFilter.value) {
    result = result.filter(post => post.category === categoryFilter.value);
  }
  
  // 应用排序
  if (sortType.value === 'latest') {
    result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortType.value === 'popular') {
    result = result.sort((a, b) => b.views - a.views);
  } else if (sortType.value === 'hottest') {
    result = result.sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2));
  }
  
  return result;
});

// 获取分类颜色
const getCategoryColor = (category: string) => {
  const colors = {
    route: 'blue',
    experience: 'green',
    gear: 'orange',
    photography: 'purple',
    gathering: 'red'
  };
  return colors[category as keyof typeof colors] || 'blue';
};

// 获取分类名称
const getCategoryName = (category: string) => {
  const names = {
    route: '路线分享',
    experience: '徒步经验',
    gear: '装备心得',
    photography: '风景摄影',
    gathering: '结伴出行'
  };
  return names[category as keyof typeof names] || '其他';
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 30) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } else if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

// 处理搜索
const handleSearch = () => {
  filterPosts();
};

// 过滤帖子
const filterPosts = () => {
  currentPage.value = 1;
  // 在实际应用中，这里会请求后端API获取过滤后的数据
};

// 加载更多帖子
const loadMorePosts = async () => {
  loadingMore.value = true;
  
  // 模拟异步加载
  await new Promise(resolve => setTimeout(resolve, 800));
  
  currentPage.value += 1;
  
  if (currentPage.value >= 3) {
    hasMorePosts.value = false;
  }
  
  loadingMore.value = false;
};

// 查看帖子详情
const viewPostDetail = (postId: number) => {
  // 实际项目中这里应该跳转到帖子详情页
  Message.info(`查看帖子ID: ${postId}的详情`);
  // router.push(`/forum/post/${postId}`);
};

// 显示发帖模态框
const showPostModal = () => {
  postModalVisible.value = true;
};

// 提交帖子
const submitPost = () => {
  loading.value = true;
  
  // 模拟异步请求
  setTimeout(() => {
    // 模拟新帖子添加
    const newPost = {
      id: posts.value.length + 1,
      title: postForm.title,
      summary: postForm.content.substring(0, 200) + (postForm.content.length > 200 ? '...' : ''),
      content: postForm.content,
      category: postForm.category,
      author: {
        id: 100,
        name: '当前用户',
        avatar: 'https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image'
      },
      createdAt: new Date().toISOString(),
      images: [...postForm.images],
      views: 0,
      likes: 0,
      comments: 0,
      isLiked: false,
      location: postForm.location
    };
    
    posts.value.unshift(newPost);
    
    // 重置表单
    postForm.title = '';
    postForm.category = '';
    postForm.content = '';
    postForm.images = [];
    postForm.location = '';
    uploadImages.value = [];
    
    postModalVisible.value = false;
    loading.value = false;
    
    Message.success('发布成功');
  }, 1000);
};

// 取消发帖
const cancelPost = () => {
  // 重置表单
  postForm.title = '';
  postForm.category = '';
  postForm.content = '';
  postForm.images = [];
  postForm.location = '';
  uploadImages.value = [];
  
  postModalVisible.value = false;
};

// 处理图片上传
const handleUpload = ({ file, onSuccess, onError }: any) => {
  // 模拟上传
  setTimeout(() => {
    try {
      // 模拟生成预览URL (实际项目中这里会上传到服务器)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onSuccess(imageUrl);
      };
    } catch (err) {
      onError(err);
    }
  }, 500);
};

// 处理图片变化
const handleImagesChange = (fileList: any) => {
  postForm.images = fileList.map((file: any) => file.response || '');
};

// 初始化
onMounted(() => {
  loading.value = true;
  
  // 模拟数据加载
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<style scoped>
.forum-container {
  padding: 20px 0;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-area {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1d2129;
}

.page-desc {
  font-size: 14px;
  color: #4e5969;
  max-width: 800px;
}

.filter-section {
  background-color: #f2f3f5;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.forum-content {
  margin-top: 20px;
}

.post-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  font-size: 14px;
}

.post-time {
  font-size: 12px;
  color: #86909c;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1d2129;
  cursor: pointer;
}

.post-title:hover {
  color: #165DFF;
}

.post-content {
  margin-bottom: 16px;
  color: #4e5969;
  font-size: 14px;
  line-height: 1.6;
}

.post-images {
  margin-bottom: 16px;
}

.more-images {
  width: 120px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 2px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #86909c;
  font-size: 14px;
}

.icon {
  font-size: 16px;
}

.empty-state {
  padding: 40px 0;
}

.load-more {
  text-align: center;
  margin: 20px 0;
}
</style> 