<template>
  <DefaultLayout>
    <div class="message-container">
      <!-- 页面标题 -->
      <div class="message-header">
        <div class="title-area">
          <h1 class="page-title">我的消息</h1>
          <p class="page-desc">您的帖子收到的所有点赞和评论通知</p>
        </div>
        <div class="action-area">
          <a-space>
            <a-button @click="markAllAsRead" :disabled="!hasUnread">
              <template #icon><icon-check /></template>
              全部标为已读
            </a-button>
            <a-dropdown @select="handleTypeChange">
              <a-button>
                {{ getTypeLabel(messageType) }}
                <template #icon><icon-down /></template>
              </a-button>
              <template #content>
                <a-doption value="all">全部消息</a-doption>
                <a-doption value="like">点赞通知</a-doption>
                <a-doption value="comment">评论通知</a-doption>
                <a-doption value="unread">未读消息</a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-content">
        <a-spin :loading="loading" style="width: 100%">
          <template v-if="filteredMessages.length > 0">
            <a-list :bordered="false" class="message-list">
              <a-list-item
                v-for="message in filteredMessages"
                :key="message.id"
                class="message-item"
                :class="{ unread: !message.isRead }"
              >
                <div class="message-dot" v-if="!message.isRead"></div>
                <div
                  class="message-wrapper"
                  @click="viewMessageDetail(message)"
                >
                  <div class="message-avatar">
                    <a-avatar :size="40" :image-url="message.sender.avatar" />
                  </div>
                  <div class="message-main">
                    <div class="message-info">
                      <span class="message-sender">{{
                        message.sender.name
                      }}</span>
                      <span class="message-time">{{
                        formatDate(message.createdAt)
                      }}</span>
                    </div>
                    <div class="message-content-text">
                      <span
                        v-if="message.type === 'like'"
                        class="message-action"
                      >
                        <icon-thumb-up class="icon-like" /> 赞了你的帖子
                      </span>
                      <span
                        v-else-if="message.type === 'comment'"
                        class="message-action"
                      >
                        <icon-message class="icon-comment" /> 评论了你的帖子
                      </span>
                      <span class="message-post-title"
                        >《{{ message.post.title }}》</span
                      >
                    </div>
                    <div
                      class="message-detail"
                      v-if="message.type === 'comment'"
                    >
                      <div class="comment-content">
                        {{ message.content }}
                      </div>
                    </div>
                  </div>
                  <div class="message-actions">
                    <a-button
                      type="text"
                      @click.stop="markAsRead(message)"
                      v-if="!message.isRead"
                    >
                      标为已读
                    </a-button>
                    <a-button
                      type="text"
                      status="danger"
                      @click.stop="deleteMessage(message)"
                    >
                      <template #icon><icon-delete /></template>
                    </a-button>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </template>

          <template v-else>
            <div class="empty-state">
              <a-empty description="暂无相关消息" />
            </div>
          </template>

          <!-- 加载更多 -->
          <div
            class="load-more"
            v-if="hasMoreMessages && filteredMessages.length > 0"
          >
            <a-button
              type="text"
              @click="loadMoreMessages"
              :loading="loadingMore"
            >
              {{ loadingMore ? "加载中..." : "加载更多消息" }}
              <template #icon><icon-down /></template>
            </a-button>
          </div>
        </a-spin>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import {
  IconThumbUp,
  IconMessage,
  IconDown,
  IconCheck,
  IconDelete,
} from "@arco-design/web-vue/es/icon";

const router = useRouter();

// 状态
const loading = ref(false);
const loadingMore = ref(false);
const hasMoreMessages = ref(true);
const messageType = ref("all"); // all, like, comment, unread
const messages = ref([
  {
    id: 1,
    type: "like",
    sender: {
      id: 201,
      name: "云间漫步",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 101,
      title: "黄山徒步三日游经验分享，适合新手的路线攻略",
    },
    content: "",
    isRead: false,
    createdAt: "2023-07-12T09:25:10Z",
  },
  {
    id: 2,
    type: "comment",
    sender: {
      id: 202,
      name: "山间溪流",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 101,
      title: "黄山徒步三日游经验分享，适合新手的路线攻略",
    },
    content: "很详细的攻略，对我帮助很大！请问住宿的话有推荐的地方吗？",
    isRead: true,
    createdAt: "2023-07-11T15:42:30Z",
  },
  {
    id: 3,
    type: "like",
    sender: {
      id: 203,
      name: "徒步者",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 102,
      title: "登山鞋选购攻略：五年徒步经验的分享",
    },
    content: "",
    isRead: false,
    createdAt: "2023-07-10T20:15:45Z",
  },
  {
    id: 4,
    type: "comment",
    sender: {
      id: 204,
      name: "山野探险",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 102,
      title: "登山鞋选购攻略：五年徒步经验的分享",
    },
    content:
      "我用过文中推荐的第三款鞋，确实防水性很好，但透气性一般，夏天穿会比较闷热。",
    isRead: false,
    createdAt: "2023-07-09T14:38:20Z",
  },
  {
    id: 5,
    type: "comment",
    sender: {
      id: 205,
      name: "户外达人",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 101,
      title: "黄山徒步三日游经验分享，适合新手的路线攻略",
    },
    content:
      "感谢分享！想请教一下，这个路线适合带孩子去吗？孩子10岁，平时有参加一些户外活动。",
    isRead: true,
    createdAt: "2023-07-05T08:12:15Z",
  },
  {
    id: 6,
    type: "like",
    sender: {
      id: 206,
      name: "风之旅者",
      avatar:
        "https://p1-arco.byteimg.com/oss-cn-beijing/1e33ec0e-4226-4e57-9e85-714f8a87b42e~tplv-k3u1fbpfcp-image.image",
    },
    post: {
      id: 103,
      title: "徒步装备必备清单：从新手到专业的全套推荐",
    },
    content: "",
    isRead: true,
    createdAt: "2023-07-03T19:27:40Z",
  },
]);

// 过滤消息
const filteredMessages = computed(() => {
  if (messageType.value === "all") {
    return messages.value;
  } else if (messageType.value === "like") {
    return messages.value.filter((msg) => msg.type === "like");
  } else if (messageType.value === "comment") {
    return messages.value.filter((msg) => msg.type === "comment");
  } else if (messageType.value === "unread") {
    return messages.value.filter((msg) => !msg.isRead);
  }
  return messages.value;
});

// 是否有未读消息
const hasUnread = computed(() => {
  return messages.value.some((msg) => !msg.isRead);
});

// 获取消息类型标签
const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    all: "全部消息",
    like: "点赞通知",
    comment: "评论通知",
    unread: "未读消息",
  };
  return types[type] || "全部消息";
};

// 处理消息类型切换
const handleTypeChange = (type: string) => {
  messageType.value = type;
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

// 加载更多消息
const loadMoreMessages = async () => {
  loadingMore.value = true;

  // 模拟异步加载
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 模拟加载更多的逻辑
  const moreMessages = [
    {
      id: 7,
      type: "comment",
      sender: {
        id: 207,
        name: "露营爱好者",
        avatar:
          "https://p1-arco.byteimg.com/oss-cn-beijing/fcc8d168-a764-4f1e-8094-8b1f62496aee~tplv-k3u1fbpfcp-image.image",
      },
      post: {
        id: 103,
        title: "徒步装备必备清单：从新手到专业的全套推荐",
      },
      content:
        "请问帐篷的选择有什么更详细的建议吗？我主要是在夏季使用，担心通风问题。",
      isRead: true,
      createdAt: "2023-07-01T10:22:35Z",
    },
    {
      id: 8,
      type: "like",
      sender: {
        id: 208,
        name: "峰林探险",
        avatar:
          "https://p1-arco.byteimg.com/oss-cn-beijing/45ce9a1d-dd01-499c-af33-51c4c9a9f6dc~tplv-k3u1fbpfcp-image.image",
      },
      post: {
        id: 101,
        title: "黄山徒步三日游经验分享，适合新手的路线攻略",
      },
      content: "",
      isRead: true,
      createdAt: "2023-06-29T16:45:10Z",
    },
  ];

  messages.value = [...messages.value, ...moreMessages];

  hasMoreMessages.value = false; // 假设没有更多数据了
  loadingMore.value = false;
};

// 查看消息详情
const viewMessageDetail = (message: any) => {
  if (!message.isRead) {
    markAsRead(message);
  }

  // 跳转到对应的帖子页面
  Message.info(`查看帖子《${message.post.title}》`);
  // 实际项目中这里会跳转到帖子详情页
  // router.push(`/forum/post/${message.post.id}`);
};

// 标记单条消息为已读
const markAsRead = (message: any) => {
  message.isRead = true;
  Message.success("已标记为已读");
};

// 标记所有消息为已读
const markAllAsRead = () => {
  messages.value.forEach((msg) => {
    msg.isRead = true;
  });
  Message.success("已全部标记为已读");
};

// 删除消息
const deleteMessage = (message: any) => {
  const index = messages.value.findIndex((item) => item.id === message.id);
  if (index !== -1) {
    messages.value.splice(index, 1);
    Message.success("消息已删除");
  }
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
.message-container {
  padding: 20px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.message-header {
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

.message-content {
  margin-top: 20px;
}

.message-list {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-item {
  position: relative;
  padding: 16px 20px;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f2f3f5;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background-color: #f9f9fa;
}

.message-item.unread {
  background-color: #f2f8ff;
}

.message-item.unread:hover {
  background-color: #e8f3ff;
}

.message-dot {
  position: absolute;
  top: 24px;
  left: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #165dff;
}

.message-wrapper {
  display: flex;
  width: 100%;
  cursor: pointer;
}

.message-avatar {
  margin-right: 16px;
  flex-shrink: 0;
}

.message-main {
  flex: 1;
  overflow: hidden;
}

.message-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.message-sender {
  font-weight: 500;
  font-size: 15px;
  color: #1d2129;
}

.message-time {
  font-size: 13px;
  color: #86909c;
}

.message-content-text {
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 8px;
}

.message-action {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
}

.icon-like,
.icon-comment {
  margin-right: 4px;
}

.icon-like {
  color: #f53f3f;
}

.icon-comment {
  color: #165dff;
}

.message-post-title {
  color: #1d2129;
  font-weight: 500;
}

.message-detail {
  margin-top: 8px;
}

.comment-content {
  background-color: #f7f8fa;
  padding: 10px 12px;
  border-radius: 4px;
  color: #4e5969;
  font-size: 14px;
  line-height: 1.6;
}

.message-actions {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.load-more {
  text-align: center;
  margin: 20px 0;
}
</style> 