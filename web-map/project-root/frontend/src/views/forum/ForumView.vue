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
      <div class="forum-content">
        <a-spin :loading="loading" style="width: 100%">
          <a-card
            v-for="post in filteredPosts"
            :key="post.id"
            class="post-card"
            hoverable
          >
            <div class="post-header">
              <div class="user-info">
                <a-avatar :size="40" :image-url="post.author.avatar" />
                <div class="user-details">
                  <div class="username">{{ post.author.name }}</div>
                  <div class="post-time">{{ formatDate(post.createdAt) }}</div>
                </div>
              </div>
            </div>

            <div class="post-title" @click="viewPostDetail(post.id)">
              {{ post.title }}
            </div>

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
              <a-button type="text" @click="viewPostDetail(post.id)">
                查看详情
                <template #icon><icon-right /></template>
              </a-button>
            </div>
          </a-card>

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
  forumService,
  Post,
  CreatePostData,
} from "../../services/forum.service";
import {
  IconEdit,
  IconMessage,
  IconThumbUp,
  IconRight,
  IconDown,
  IconPlus,
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
});

// 表单验证
const isFormValid = computed(() => {
  return postForm.title && postForm.content;
});

// 帖子数据
const posts = ref<Post[]>([]);

// 过滤后的帖子
const filteredPosts = computed(() => {
  return posts.value;
});

// 加载帖子数据
const fetchPosts = async () => {
  try {
    loading.value = true;
    const fetchedPosts = await forumService.getPosts(1, sortType.value);
    posts.value = fetchedPosts;

    // 有更多数据时显示加载更多按钮
    hasMorePosts.value = fetchedPosts.length >= 10;
    currentPage.value = 1;
  } catch (error) {
    console.error("获取帖子失败:", error);
    Message.error("获取帖子数据失败，请稍后重试");
  } finally {
    loading.value = false;
  }
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

// 处理搜索
const handleSearch = async () => {
  try {
    loading.value = true;
    if (searchQuery.value.trim()) {
      const results = await forumService.searchPosts(
        searchQuery.value,
        sortType.value
      );
      posts.value = results;
    } else {
      await fetchPosts();
    }
  } catch (error) {
    console.error("搜索失败:", error);
    Message.error("搜索失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// 过滤帖子
const filterPosts = async () => {
  await fetchPosts();
};

// 加载更多帖子
const loadMorePosts = async () => {
  try {
    loadingMore.value = true;
    currentPage.value += 1;

    const morePosts = await forumService.getPosts(
      currentPage.value,
      sortType.value
    );

    if (morePosts.length === 0) {
      hasMorePosts.value = false;
    } else {
      posts.value = [...posts.value, ...morePosts];
      hasMorePosts.value = morePosts.length >= 10;
    }
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

    const postData: CreatePostData = {
      title: postForm.title,
      content: postForm.content,
      images: postForm.images,
      location: postForm.location,
    };

    const newPost = await forumService.createPost(postData);

    // 添加到帖子列表开头
    posts.value.unshift(newPost);

    // 重置表单
    postForm.title = "";
    postForm.content = "";
    postForm.images = [];
    postForm.location = "";
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
  uploadImages.value = [];

  postModalVisible.value = false;
};

// 处理图片上传
const handleUpload = async ({ file, onSuccess, onError }: any) => {
  try {
    // 真实上传到服务器
    const imageUrl = await forumService.uploadImage(file);
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

// 点赞/取消点赞
const toggleLike = async (post: Post) => {
  try {
    const result = await forumService.toggleLike(post.id);

    // 更新帖子数据
    const index = posts.value.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts.value[index].likes = result.likes;
      posts.value[index].isLiked = result.isLiked;
    }
  } catch (error) {
    console.error("点赞操作失败:", error);
    Message.error("操作失败，请稍后重试");
  }
};

// 初始化
onMounted(() => {
  fetchPosts();
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
  color: #165dff;
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