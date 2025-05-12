<template>
  <DefaultLayout>
    <div class="ai-assistant-container">
      <a-card class="chat-card">
        <div class="chat-header">
          <h2><icon-robot /> AI户外助手</h2>
          <p class="subtitle">
            您的智能徒步向导，随时为您提供路线推荐和天气建议
          </p>
        </div>

        <div class="chat-body" ref="chatBodyRef">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'message-item',
              message.type === 'user' ? 'user-message' : 'assistant-message',
            ]"
          >
            <a-avatar
              :style="{
                backgroundColor:
                  message.type === 'user' ? '#165DFF' : '#00B42A',
              }"
            >
              <icon-user v-if="message.type === 'user'" />
              <icon-robot v-else />
            </a-avatar>
            <div class="message-content">
              <div class="message-bubble">{{ message.content }}</div>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>

          <div v-if="isLoading" class="loading-message">
            <a-spin />
            <span class="ml-2">正在思考...</span>
          </div>
        </div>

        <div class="chat-footer">
          <a-input-search
            v-model="userInput"
            placeholder="询问路线推荐、天气建议或户外装备..."
            search-button
            allow-clear
            @search="sendMessage"
            @press-enter="sendMessage"
          >
            <template #button-icon>
              <icon-send />
            </template>
          </a-input-search>

          <div class="quick-questions">
            <a-space>
              <a-tag
                checkable
                size="medium"
                @click="quickAsk('推荐杭州周边的徒步路线')"
                >推荐杭州周边的徒步路线</a-tag
              >
              <a-tag
                checkable
                size="medium"
                @click="quickAsk('明天北京的天气适合徒步吗')"
                >明天北京的天气适合徒步吗</a-tag
              >
              <a-tag checkable size="medium" @click="quickAsk('徒步装备清单')"
                >徒步装备清单</a-tag
              >
            </a-space>
          </div>
        </div>
      </a-card>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import { IconRobot, IconUser, IconSend } from "@arco-design/web-vue/es/icon";

type MessageType = {
  content: string;
  type: "user" | "assistant";
  time: string;
};

const userInput = ref("");
const messages = ref<MessageType[]>([]);
const isLoading = ref(false);
const chatBodyRef = ref<HTMLElement | null>(null);

// 初始化欢迎消息
onMounted(() => {
  addMessage(
    "您好！我是您的户外助手。我可以帮您推荐徒步路线、提供天气建议或者回答关于户外活动的问题。请问有什么可以帮您的吗？",
    "assistant"
  );
});

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMessage = userInput.value;
  userInput.value = "";

  // 添加用户消息
  addMessage(userMessage, "user");

  // 显示加载状态
  isLoading.value = true;

  // 滚动到底部
  await scrollToBottom();

  // 模拟AI回复延迟
  setTimeout(() => {
    // 根据用户输入生成回复
    const response = generateResponse(userMessage);

    // 添加助手回复
    addMessage(response, "assistant");
    isLoading.value = false;

    // 再次滚动到底部
    scrollToBottom();
  }, 1000);
};

// 快速提问
const quickAsk = (question: string) => {
  userInput.value = question;
  sendMessage();
};

// 添加消息到列表
const addMessage = (content: string, type: "user" | "assistant") => {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  messages.value.push({
    content,
    type,
    time: timeString,
  });
};

// 滚动到对话底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
  }
};

// 简单的响应生成逻辑(实际项目中应该调用后端API)
const generateResponse = (message: string): string => {
  if (message.includes("徒步路线") || message.includes("推荐")) {
    return "根据您的兴趣，我推荐以下几条热门徒步路线：\n1. 杭州西湖环线，难度低，约8公里\n2. 莫干山竹海徒步，难度中，约12公里\n3. 黄山西海大峡谷，难度高，约15公里\n您对哪条路线感兴趣，我可以提供更详细的信息。";
  } else if (message.includes("天气") || message.includes("适合")) {
    return "根据最新天气预报，明天北京晴朗，气温15-25℃，风力2-3级，非常适合户外徒步活动。建议携带防晒用品，准备足够的饮用水，选择透气性好的服装。";
  } else if (message.includes("装备") || message.includes("清单")) {
    return "徒步基础装备清单：\n✅ 徒步鞋或登山鞋\n✅ 速干衣裤\n✅ 小型背包(20-35L)\n✅ 帽子和太阳镜\n✅ 防晒霜\n✅ 充足的水和能量食品\n✅ 简易急救包\n✅ 雨衣或防水外套\n根据路线难度和季节，您可能需要增减装备。";
  } else {
    return "感谢您的问题！作为户外助手，我可以为您提供路线推荐、天气信息、装备建议等服务。请告诉我您计划去哪里徒步，或者您有什么具体需求，我会尽力帮助您。";
  }
};
</script>

<style scoped>
.ai-assistant-container {
  padding: 20px;
  height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
}

.chat-card {
  width: 100%;
  max-width: 900px;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
  text-align: center;
}

.subtitle {
  color: #86909c;
  margin-top: 4px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.user-message {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.assistant-message {
  align-self: flex-start;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  white-space: pre-line;
}

.user-message .message-bubble {
  background-color: #165dff;
  color: white;
  border-top-right-radius: 2px;
}

.assistant-message .message-bubble {
  background-color: #f2f3f5;
  color: #333;
  border-top-left-radius: 2px;
}

.message-time {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
  align-self: flex-end;
}

.loading-message {
  display: flex;
  align-items: center;
  color: #86909c;
  padding: 8px 16px;
}

.chat-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.quick-questions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ml-2 {
  margin-left: 8px;
}
</style> 