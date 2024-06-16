<template>
  <MemberLayouts>
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-xl overflow-hidden w-full">
        <div class="flex justify-between px-4 py-2 bg-gray-100">
          <span class="font-semibold text-md">Notifikasi</span>
          <button 
            @click="markAllAsRead"
            class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors duration-200"
          >
            Tandai Semua Dibaca
          </button>
        </div>
        <div class="flex justify-around gap-2 mb-2 border-b py-4 px-2">
          <button @click="changeTab('transaction')" :class="{'text-primary active-tab': activeTab === 'transaction'}">Transaksi</button>
          <button @click="changeTab('information')" :class="{'text-primary active-tab': activeTab === 'information'}">Informasi</button>
        </div>
        <div class="py-2">
          <template v-if="currentNotifications.length">
            <div
              v-for="(notification) in currentNotifications"
              :key="notification.id"
              :class="[
                'notification-item', 
                notification.is_read ? 'read-notification' : 'unread-notification'
              ]"
              @click="handleNotificationClick(notification)">
              <img :src="getNotificationIcon(notification.type)" alt="Icon" class="w-10 h-10 mr-4">
              <div class="flex-grow">
                <p class="font-semibold">{{ notification.title }}</p>
                <p>{{ notification.message }}</p>
                <div class="text-xs mt-2">{{ relativeTime(notification.created_at) }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="px-4 py-3 text-gray-500 items-center justify-center">
              <img src="/src/assets/empty-img.jpg" alt="No Notifications" class="w-96 h-96 mx-auto">
              <p class="text-center text-lg">Belum ada notifikasi</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { relativeTime } from '@/filters';
import MemberLayouts from '@/components/MemberLayouts.vue';

const store = useStore();
const router = useRouter();

const activeTab = ref('transaction');
const loading = ref(false);

onMounted(() => {
  fetchNotifications();
});

const notifications = computed(() => store.getters['auth/allNotifications']);
const transactionNotifications = computed(() => store.getters['auth/transactionNotifications']);
const informationNotifications = computed(() => store.getters['auth/informationNotifications']);
const currentNotifications = computed(() => activeTab.value === 'transaction' ? transactionNotifications.value : informationNotifications.value);

const changeTab = (tab) => {
  activeTab.value = tab;
  fetchNotifications(true);
};

const handleNotificationClick = (notification) => {
  if (notification.link) {
    markAsRead(notification.id);
    router.push(notification.link);
  } else {
    markAsRead(notification.id);
  }
};

const getNotificationIcon = (type) => {
  if (type === 'transaction') {
    return '/src/assets/transaction-history.png';
  } else if (type === 'information') {
    return '/src/assets/information.png';
  }
  return '/src/assets/wallet.png';
};

const markAsRead = async (id) => {
  await store.dispatch('auth/markAsRead', id);
};

const fetchNotifications = async (reset = false) => {
  if (loading.value) return;

  loading.value = true;
  const page = reset ? 1 : store.state.auth.notificationPagination.currentPage + 1;
  try {
    await store.dispatch('auth/fetchNotifications', page);
  } finally {
    loading.value = false;
  }
};

const markAllAsRead = async () => {
  try {
    await store.dispatch('auth/markAllAsRead');
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

watch(activeTab, () => {
  fetchNotifications(true);
});
</script>

<style scoped>
.text-text-primary {
  color: #333;
}

.text-text-secondary {
  color: #666;
}

.text-text-tertiary {
  color: #999;
}

.bg-primary {
  background-color: #0BA7E3;
}

.text-white {
  color: #fff;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-blue-600 {
  color: #3b82f6;
}

.relative-time {
  margin-top: 0.5rem;
  color: #999;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s, color 0.3s;
}

.notification-item.unread-notification {
  background-color: #0BA7E3;
  color: #fff;
}

.notification-item.unread-notification:hover {
  background-color: #dadddf;
  color: #000;
}

.notification-item.read-notification {
  background-color: #fff;
  color: #333;
}

.notification-item:hover .hover-text {
  color: black;
}

.notification-item.read-notification:hover {
  background-color: #bfc2c2;
  color: black;
}

.active-tab {
  border-bottom: 2px solid #0BA7E3;
}
</style>
