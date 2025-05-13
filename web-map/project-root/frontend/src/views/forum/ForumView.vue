<template>
  <DefaultLayout>
    <div class="forum-container">
      <!-- 页面标题 -->
      <div class="forum-header">
        <div class="title-area">
          <h1 class="page-title">徒步交流论坛</h1>
          <p class="page-desc">
            分享您的徒步经验、路线推荐、装备心得，与其他户外爱好者交流讨论
          </p>
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
          <a-col :span="12">
            <a-input-search
              placeholder="搜索帖子标题、内容或用户"
              allow-clear
              v-model="searchQuery"
              @search="handleSearch"
            />
          </a-col>
          <a-col :span="12" style="text-align: right">
            <a-radio-group
              type="button"
              v-model="sortType"
              @change="filterPosts"
            >
              <a-radio value="latest">最新发布</a-radio>
              <a-radio value="hottest">最热帖子</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </div>

      <!-- 帖子列表 -->
      <a-divider style="margin: 16px 0" />
      
      <div class="posts-container">
        <a-spin :loading="loading" style="width: 100%">
          <a-row :gutter="[24, 24]">
            <a-col :span="8" v-for="post in filteredPosts" :key="post.id">
              <a-card
                class="post-card"
                hoverable
                @click="viewPostDetail(post.id)"
              >
                <template #cover>
                  <div
                    class="post-image"
                    :style="{
                      backgroundImage: post.images && post.images.length
                        ? `url(${post.images[0]})`
                        : 'url(https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image)'
                    }"
                  >
                    <div class="post-badge" :class="getBadgeClass(post)">
                      {{ getBadgeText(post) }}
                    </div>
                  </div>
                </template>
                
                <a-card-meta :title="post.title">
                  <template #description>
                    <div class="post-info">
                      <div class="author-info">
                        <a-avatar :size="24" :image-url="post.author.avatar" />
                        <span class="author-name">{{ post.author.name }}</span>
                      </div>
                      <div class="post-time">{{ formatDate(post.createdAt) }}</div>
                    </div>
                    <p class="post-summary">{{ post.summary }}</p>
                    <div class="post-meta">
                      <div class="post-stats">
                        <span class="stat-item">
                          <icon-message class="icon" />
                          {{ post.comments }}
                        </span>
                        <span class="stat-item">
                          <icon-thumb-up
                            class="icon"
                            :style="{ color: post.isLiked ? '#165DFF' : '' }"
                          />
                          {{ post.likes }}
                        </span>
                      </div>
                    </div>
                  </template>
                </a-card-meta>

                <div class="post-footer">
                  <div class="post-extra-info">
                    <div class="location" v-if="post.location">
                      <icon-location />
                      <span>{{ post.location }}</span>
                    </div>
                    <div class="tags" v-if="post.tags && post.tags.length">
                      <template v-for="(tag, index) in post.tags" :key="index">
                        <a-tag :color="getTagColor(tag)">{{ tag }}</a-tag>
                      </template>
                    </div>
                  </div>
                  <a-button
                    type="primary"
                    shape="round"
                    @click.stop="viewPostDetail(post.id)"
                  >
                    查看详情
                    <template #icon><icon-right /></template>
                  </a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>

          <div
            class="empty-state"
            v-if="filteredPosts.length === 0 && !loading"
          >
            <a-empty description="没有找到符合条件的帖子" />
          </div>

          <!-- 加载更多 -->
          <div
            class="load-more"
            v-if="hasMorePosts && filteredPosts.length > 0"
          >
            <a-button type="text" @click="loadMorePosts" :loading="loadingMore">
              {{ loadingMore ? "加载中..." : "加载更多帖子" }}
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
        <a-form-item
          field="title"
          label="标题"
          :rules="[{ required: true, message: '请输入帖子标题' }]"
        >
          <a-input
            v-model="postForm.title"
            placeholder="请输入帖子标题"
            allow-clear
            :max-length="100"
            show-word-limit
          />
        </a-form-item>

        <a-form-item
          field="content"
          label="内容"
          :rules="[{ required: true, message: '请输入帖子内容' }]"
        >
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
          <a-input
            v-model="postForm.location"
            placeholder="输入相关地点位置，如：浙江省杭州市西湖区"
            allow-clear
          />
        </a-form-item>

        <a-form-item field="tags" label="标签(可选)">
          <a-select
            v-model="postForm.tags"
            placeholder="选择标签"
            multiple
            allow-create
            allow-clear
          >
            <a-option value="装备">装备</a-option>
            <a-option value="路线">路线</a-option>
            <a-option value="技巧">技巧</a-option>
            <a-option value="风景">风景</a-option>
            <a-option value="安全">安全</a-option>
            <a-option value="问答">问答</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import {
  IconEdit,
  IconMessage,
  IconThumbUp,
  IconRight,
  IconDown,
  IconPlus,
  IconLocation,
} from "@arco-design/web-vue/es/icon";

const router = useRouter();

// 状态
const loading = ref(false);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const searchQuery = ref("");
const sortType = ref("latest");
const currentPage = ref(1);
const postModalVisible = ref(false);
const uploadImages = ref([]);
const submitting = ref(false);

// 帖子表单
const postForm = reactive({
  title: "",
  content: "",
  images: [] as string[],
  location: "",
  tags: [] as string[],
});

// 表单验证
const isFormValid = computed(() => {
  return postForm.title && postForm.content;
});

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    title: "黄山徒步三日游经验分享，适合新手的路线攻略",
    summary: "分享我最近在黄山的三日徒步经验，包括路线规划、装备准备、住宿推荐以及注意事项，非常适合徒步新手参考。",
    author: {
      id: 101,
      name: "山地探险家",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-15T08:30:00Z",
    images: [
      "https://p1-arco.byteimg.com/oss-cn-beijing/fe42c34d-6994-480d-900c-afbf9c845f8e~tplv-k3u1fbpfcp-image.image",
    ],
    comments: 24,
    likes: 68,
    isLiked: false,
    location: "安徽省黄山市",
    tags: ["路线", "攻略", "新手"],
    hot: true,
  },
  {
    id: 2,
    title: "专业登山鞋选购指南：五年徒步经验的心得",
    summary: "作为一名有五年徒步经验的户外爱好者，分享我对各种登山鞋的使用体验和选购建议，帮助大家避开选购误区。",
    author: {
      id: 102,
      name: "装备控",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-14T14:25:00Z",
    images: [
      "https://p1-arco.byteimg.com/oss-cn-beijing/a04a1102-d836-47bd-9186-b86aa66a2ede~tplv-k3u1fbpfcp-image.image",
    ],
    comments: 36,
    likes: 92,
    isLiked: true,
    location: "",
    tags: ["装备", "选购", "心得"],
    hot: true,
  },
  {
    id: 3,
    title: "户外徒步拍摄技巧：如何用手机拍出美照",
    summary: "不需要专业相机，用手机也能在徒步中拍出令人惊艳的照片。分享构图、光线利用、后期处理等实用技巧。",
    author: {
      id: 103,
      name: "风景摄影师",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-13T10:15:00Z",
    images: [
      "https://p1-arco.byteimg.com/oss-cn-beijing/e5da7b9f-d706-4a28-88d5-4cb872886ec0~tplv-k3u1fbpfcp-image.image",
    ],
    comments: 18,
    likes: 45,
    isLiked: false,
    location: "",
    tags: ["摄影", "技巧", "分享"],
  },
  {
    id: 4,
    title: "徒步新手常见问题解答与注意事项",
    summary: "整理了徒步新手最常遇到的20个问题及详细解答，涵盖装备选择、体能准备、安全防护等方面。",
    author: {
      id: 104,
      name: "户外教练",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-12T16:40:00Z",
    images: [],
    comments: 42,
    likes: 76,
    isLiked: false,
    location: "",
    tags: ["新手", "问答", "安全"],
  },
  {
    id: 5,
    title: "杭州周边一日徒步路线推荐",
    summary: "整理了杭州周边适合一日徒步的五条精选路线，包括交通、难度、风景特点和所需时间等详细信息。",
    author: {
      id: 105,
      name: "都市探险",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-11T09:20:00Z",
    images: [
      "https://p1-arco.byteimg.com/oss-cn-beijing/c3f6b08a-2869-4c56-80e8-4c463dd73b5e~tplv-k3u1fbpfcp-image.image",
    ],
    comments: 31,
    likes: 64,
    isLiked: true,
    location: "浙江省杭州市",
    tags: ["路线", "一日游"],
  },
  {
    id: 6,
    title: "高海拔徒步的呼吸调节与高原反应预防",
    summary: "分享在高海拔地区徒步时如何正确调节呼吸，以及预防和应对高原反应的实用方法和经验。",
    author: {
      id: 106,
      name: "高山向导",
      avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
    },
    createdAt: "2023-07-10T11:05:00Z",
    images: [
      "https://p1-arco.byteimg.com/oss-cn-beijing/79a2dcf5-9699-43d1-8580-9aba6613ede7~tplv-k3u1fbpfcp-image.image",
    ],
    comments: 27,
    likes: 58,
    isLiked: false,
    location: "西藏自治区林芝市",
    tags: ["技巧", "安全", "高海拔"],
  },
]);

// 过滤后的帖子
const filteredPosts = computed(() => {
  let result = [...posts.value];
  
  // 应用搜索查询
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
    );
  }
  
  // 应用排序
  if (sortType.value === "hottest") {
    result.sort((a, b) => b.likes - a.likes);
  } else {
    // 最新发布
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return result;
});

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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  } else if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return "刚刚";
  }
};

// 获取帖子标签颜色
const getTagColor = (tag: string) => {
  const colors = {
    装备: "blue",
    路线: "green",
    技巧: "purple",
    风景: "cyan",
    安全: "red",
    攻略: "orange",
    新手: "arcoblue",
    问答: "gold",
    "一日游": "lime",
    高海拔: "magenta",
    选购: "blue",
    心得: "purple",
    摄影: "cyan",
    分享: "arcoblue",
  };
  return (colors as any)[tag] || "gray";
};

// 获取徽章类名
const getBadgeClass = (post: any) => {
  if (post.hot) return "hot";
  if (post.comments > 30) return "popular";
  if (new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000) return "new";
  return "normal";
};

// 获取徽章文本
const getBadgeText = (post: any) => {
  if (post.hot) return "热门";
  if (post.comments > 30) return "热评";
  if (new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000) return "新帖";
  return "";
};

// 处理搜索
const handleSearch = async () => {
  try {
    loading.value = true;
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    // 实际项目中这里会调用API搜索
  } catch (error) {
    console.error("搜索失败:", error);
    Message.error("搜索失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// 过滤帖子
const filterPosts = async () => {
  try {
    loading.value = true;
    // 模拟过滤延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    // 实际项目中这里会调用API获取数据
  } catch (error) {
    console.error("过滤失败:", error);
    Message.error("获取数据失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// 加载更多帖子
const loadMorePosts = async () => {
  try {
    loadingMore.value = true;
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟加载更多帖子
    const morePosts = [
      {
        id: 7,
        title: "雨季徒步装备防水指南",
        summary: "雨季徒步如何保持干爽？分享我的装备防水经验，从背包到鞋子，让你在雨中也能愉快徒步。",
        author: {
          id: 107,
          name: "雨中漫步",
          avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image",
        },
        createdAt: "2023-07-09T15:18:00Z",
        images: [
          "https://p1-arco.byteimg.com/oss-cn-beijing/d0c41dfd-4ba3-4653-a932-c777a73be9bc~tplv-k3u1fbpfcp-image.image", 
        ],
        comments: 19,
        likes: 42,
        isLiked: false,
        location: "",
        tags: ["装备", "防水", "技巧"],
      },
      {
        id: 8,
        title: "低碳徒步：如何减少户外活动的环境影响",
        summary: "探讨如何在享受徒步乐趣的同时减少对环境的影响，包括装备选择、垃圾处理和露营习惯等方面的建议。",
        author: {
          id: 108,
          name: "绿色出行",
          avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
        },
        createdAt: "2023-07-08T13:40:00Z",
        images: [
          "https://p1-arco.byteimg.com/oss-cn-beijing/27ec9072-5e76-4ba9-99bb-6e7fbd20ad30~tplv-k3u1fbpfcp-image.image",
        ],
        comments: 23,
        likes: 51,
        isLiked: true,
        location: "",
        tags: ["环保", "技巧"],
      },
    ];
    
    posts.value = [...posts.value, ...morePosts];
    
    // 模拟没有更多数据
    hasMorePosts.value = false;
  } catch (error) {
    console.error("加载更多帖子失败:", error);
    Message.error("加载更多帖子失败，请稍后重试");
  } finally {
    loadingMore.value = false;
  }
};

// 查看帖子详情
const viewPostDetail = (postId: number) => {
  router.push(`/forum/post/${postId}`);
};

// 显示发帖模态框
const showPostModal = () => {
  postModalVisible.value = true;
};

// 提交帖子
const submitPost = async () => {
  if (!isFormValid.value) return;

  try {
    submitting.value = true;

    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建新帖子对象（模拟服务器响应）
    const newPost = {
      id: posts.value.length + 1,
      title: postForm.title,
      summary: postForm.content.substring(0, 100) + (postForm.content.length > 100 ? "..." : ""),
      author: {
        id: 201, // 假设当前用户ID
        name: "当前用户", // 假设当前用户名
        avatar: "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image", // 假设当前用户头像
      },
      createdAt: new Date().toISOString(),
      images: postForm.images,
      comments: 0,
      likes: 0,
      isLiked: false,
      location: postForm.location,
      tags: postForm.tags,
    };
    
    // 添加到帖子列表开头
    posts.value.unshift(newPost);

    // 重置表单
    postForm.title = "";
    postForm.content = "";
    postForm.images = [];
    postForm.location = "";
    postForm.tags = [];
    uploadImages.value = [];

    postModalVisible.value = false;
    Message.success("发布成功");
  } catch (error) {
    console.error("发布帖子失败:", error);
    Message.error("发布失败，请稍后重试");
  } finally {
    submitting.value = false;
  }
};

// 取消发帖
const cancelPost = () => {
  // 重置表单
  postForm.title = "";
  postForm.content = "";
  postForm.images = [];
  postForm.location = "";
  postForm.tags = [];
  uploadImages.value = [];

  postModalVisible.value = false;
};

// 处理图片上传
const handleUpload = async ({ file, onSuccess, onError }: any) => {
  try {
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟上传成功，返回图片URL
    const imageUrl = "https://p1-arco.byteimg.com/oss-cn-beijing/fe42c34d-6994-480d-900c-afbf9c845f8e~tplv-k3u1fbpfcp-image.image";
    onSuccess(imageUrl);
  } catch (err) {
    console.error("上传图片失败:", err);
    onError(err);
    Message.error("上传图片失败");
  }
};

// 处理图片变化
const handleImagesChange = (fileList: any) => {
  postForm.images = fileList.map((file: any) => file.response || "");
};

// 初始化
onMounted(() => {
  // 模拟数据加载
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.forum-container {
  padding: 20px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.forum-header {
  padding: 40px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-area {
  margin-bottom: 20px;
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

.posts-container {
  margin-top: 20px;
  margin-bottom: 60px;
}

.post-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.post-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.hot {
  background-color: #f53f3f;
}

.popular {
  background-color: #f59b42;
}

.new {
  background-color: #3dd2b4;
}

.normal {
  display: none;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 4px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 14px;
  color: #1d2129;
}

.post-time {
  font-size: 12px;
  color: #86909c;
}

.post-summary {
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

.post-meta {
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

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  border-top: 1px solid #f2f3f5;
  padding-top: 16px;
}

.post-extra-info {
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

.tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
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