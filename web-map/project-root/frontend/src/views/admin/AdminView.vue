<template>
  <DefaultLayout>
    <div v-if="userStore.user?.isAdmin" class="admin-container">
      <a-row :gutter="16">
        <!-- 左侧导航 -->
        <a-col :span="5">
          <a-card class="admin-menu-card">
            <a-menu
              :selected-keys="selectedKeys"
              @select="handleMenuSelect"
              style="border: none"
            >
              <a-menu-item key="posts">
                <template #icon><icon-file /></template>
                帖子管理
              </a-menu-item>
              <a-menu-item key="users">
                <template #icon><icon-user /></template>
                用户管理
              </a-menu-item>
              <a-menu-item key="routes">
                <template #icon><icon-location /></template>
                路线管理
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-col>

        <!-- 右侧内容区域 -->
        <a-col :span="19">
          <a-card class="admin-content-card">
            <!-- 帖子管理 -->
            <div v-if="activeTab === 'posts'">
              <h2 class="admin-title">帖子管理</h2>
              <div class="table-operations">
                <a-space>
                  <a-input-search
                    placeholder="搜索帖子标题"
                    style="width: 240px"
                  />
                  <a-button type="primary">
                    <template #icon><icon-plus /></template>
                    添加帖子
                  </a-button>
                </a-space>
              </div>
              <a-table :columns="postsColumns" :data="postsData">
                <template #operation>
                  <a-space>
                    <a-button type="text" size="small">
                      <icon-edit />
                    </a-button>
                    <a-button type="text" size="small" status="danger">
                      <icon-delete />
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </div>

            <!-- 用户管理 -->
            <div v-if="activeTab === 'users'">
              <h2 class="admin-title">用户管理</h2>
              <div class="table-operations">
                <a-space>
                  <a-input-search
                    placeholder="搜索用户名或邮箱"
                    style="width: 240px"
                  />
                  <a-button type="primary">
                    <template #icon><icon-plus /></template>
                    添加用户
                  </a-button>
                </a-space>
              </div>
              <a-table :columns="usersColumns" :data="usersData">
                <template #operation>
                  <a-space>
                    <a-button type="text" size="small">
                      <icon-edit />
                    </a-button>
                    <a-button type="text" size="small" status="danger">
                      <icon-delete />
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </div>

            <!-- 路线管理 -->
            <div v-if="activeTab === 'routes'">
              <h2 class="admin-title">路线管理</h2>
              <div class="table-operations">
                <a-space>
                  <a-input-search
                    placeholder="搜索路线名称"
                    style="width: 240px"
                  />
                  <a-button type="primary">
                    <template #icon><icon-plus /></template>
                    添加路线
                  </a-button>
                </a-space>
              </div>
              <a-table :columns="routesColumns" :data="routesData">
                <template #operation>
                  <a-space>
                    <a-button type="text" size="small">
                      <icon-edit />
                    </a-button>
                    <a-button type="text" size="small" status="danger">
                      <icon-delete />
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div v-else class="no-permission">
      <a-result status="403" title="403" subtitle="抱歉，您没有权限访问此页面">
        <template #extra>
          <a-button type="primary" @click="router.push('/home')">
            返回首页
          </a-button>
        </template>
      </a-result>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import { useUserStore } from "../../stores/user.store";
import { useNotification } from "../../composables/useNotification";
import {
  IconFile,
  IconUser,
  IconLocation,
  IconPlus,
  IconEdit,
  IconDelete,
} from "@arco-design/web-vue/es/icon";

defineOptions({
  name: "AdminView",
});

const router = useRouter();
const userStore = useUserStore();
const { showNotification } = useNotification();

// 当前选中的菜单项
const selectedKeys = ref(["posts"]);
const activeTab = ref("posts");

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeTab.value = key;
};

// 检查权限
onMounted(() => {
  if (!userStore.user?.isAdmin) {
    showNotification({
      title: "无权限",
      content: "您没有管理员权限",
      type: "error",
    });
  }
});

// 帖子管理数据
const postsColumns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 70,
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "作者",
    dataIndex: "author",
  },
  {
    title: "发布时间",
    dataIndex: "createTime",
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 160,
    slotName: "operation",
  },
];

const postsData = [
  {
    id: 1,
    title: "分享我的莫干山徒步经历",
    author: "xiaohong",
    createTime: "2023-06-08",
    status: "已发布",
  },
  {
    id: 2,
    title: "黄山徒步装备推荐",
    author: "hiking_lover",
    createTime: "2023-06-07",
    status: "已发布",
  },
  {
    id: 3,
    title: "杭州周边最适合初学者的5条徒步路线",
    author: "beginner101",
    createTime: "2023-06-05",
    status: "已发布",
  },
];

// 用户管理数据
const usersColumns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 70,
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "管理员",
    dataIndex: "isAdmin",
    render: (value) => (value ? "是" : "否"),
  },
  {
    title: "操作",
    width: 160,
    slotName: "operation",
  },
];

const usersData = [
  {
    id: 1,
    username: "xiaoming",
    email: "xiaoming@example.com",
    createTime: "2023-05-10",
    status: "正常",
    isAdmin: true,
  },
  {
    id: 2,
    username: "hiking_lover",
    email: "hiker@example.com",
    createTime: "2023-05-12",
    status: "正常",
    isAdmin: false,
  },
  {
    id: 3,
    username: "mountain_explorer",
    email: "explorer@example.com",
    createTime: "2023-05-15",
    status: "禁用",
    isAdmin: false,
  },
];

// 路线管理数据
const routesColumns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 70,
  },
  {
    title: "路线名称",
    dataIndex: "name",
  },
  {
    title: "难度",
    dataIndex: "difficulty",
  },
  {
    title: "长度(km)",
    dataIndex: "length",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "操作",
    width: 160,
    slotName: "operation",
  },
];

const routesData = [
  {
    id: 1,
    name: "杭州西湖环线",
    difficulty: "简单",
    length: 8,
    status: "已发布",
  },
  {
    id: 2,
    name: "莫干山竹海徒步",
    difficulty: "中等",
    length: 12,
    status: "已发布",
  },
  {
    id: 3,
    name: "黄山西海大峡谷",
    difficulty: "困难",
    length: 15,
    status: "已发布",
  },
];
</script>

<style scoped>
.admin-container {
  padding: 20px 0;
}

.admin-menu-card,
.admin-content-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  height: 100%;
}

.admin-menu-card {
  height: calc(100vh - 200px);
}

.admin-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 20px;
  color: #1d2129;
}

.section-title {
  margin-top: 20px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1d2129;
}

.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.no-permission {
  padding: 40px 0;
}
</style> 