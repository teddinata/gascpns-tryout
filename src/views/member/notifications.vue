<!-- NotificationCenter.vue -->
<template>
  <MemberLayouts>
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-xl overflow-hidden w-full">
        <div class="flex justify-start px-4 py-2 bg-gray-100">
          <span class="font-semibold text-md">Notifikasi </span>
        </div>
        <div class="flex justify-around gap-2 mb-2 border-b py-4 px-2">
          <button @click="activeTab = 'transaction'" :class="{'text-primary active-tab': activeTab === 'transaction'}">Transaksi</button>
          <button @click="activeTab = 'information'" :class="{'text-primary active-tab': activeTab === 'information'}">Informasi</button>
        </div>
        <div class="py-2">
          <template v-if="(activeTab === 'transaction' ? transactionNotifications : informationNotifications).length">
            <div v-for="(notification, index) in (activeTab === 'transaction' ? transactionNotifications : informationNotifications)" :key="index"
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { relativeTime } from '@/filters';
import MemberLayouts from '@/components/MemberLayouts.vue';

const store = useStore();
const router = useRouter();

const activeTab = ref('transaction'); // Default tab

onMounted(() => {
  store.dispatch('auth/fetchNotifications');
});

const notifications = computed(() => store.getters['auth/allNotifications']);
const transactionNotifications = computed(() => store.getters['auth/transactionNotifications']);
const informationNotifications = computed(() => store.getters['auth/informationNotifications']);

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

const previousPage = () => {
  if (pagination.value.prevPageUrl) {
    const url = new URL(pagination.value.prevPageUrl);
    const page = url.searchParams.get('page');
    store.dispatch('auth/fetchNotifications', page);
  }
};

const nextPage = () => {
  if (pagination.value.nextPageUrl) {
    const url = new URL(pagination.value.nextPageUrl);
    const page = url.searchParams.get('page');
    store.dispatch('auth/fetchNotifications', page);
  }
};
</script>

<style scoped>
.text-text-primary {
  color: #333; /* Ganti dengan warna teks utama Anda */
}

.text-text-secondary {
  color: #666; /* Ganti dengan warna teks sekunder Anda */
}

.text-text-tertiary {
  color: #999; /* Ganti dengan warna teks tertiari Anda */
}

.bg-primary {
  background-color: #0BA7E3; /* Warna biru untuk notifikasi yang belum dibaca */
}

.text-white {
  color: #fff; /* Warna teks putih */
}

.bg-gray-100 {
  background-color: #f7fafc; /* Warna latar belakang untuk header notifikasi */
}

.bg-gray-50 {
  background-color: #f9fafb; /* Warna latar belakang untuk footer notifikasi */
}

.text-blue-600 {
  color: #3b82f6; /* Warna teks tombol untuk tindakan tambahan */
}

.relative-time {
  margin-top: 0.5rem;
  color: #999; /* Warna teks untuk timestamp */
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
  background-color: #0BA7E3; /* Warna biru untuk notifikasi yang belum dibaca */
  color: #fff; /* Warna teks putih untuk notifikasi yang belum dibaca */
}

.notification-item.unread-notification:hover {
  background-color: #dadddf; /* Warna latar belakang saat hover */
  color: #000; /* Warna teks menjadi hitam saat hover */
}

.notification-item.read-notification {
  background-color: #fff; /* Warna latar belakang untuk notifikasi yang sudah dibaca */
  color: #333; /* Warna teks untuk notifikasi yang sudah dibaca */
}

.notification-item:hover .hover-text {
  color: black;
}

.notification-item.read-notification:hover {
  background-color: #bfc2c2; /* Warna latar belakang saat hover */
  color: black;
}

.active-tab {
  border-bottom: 2px solid #0BA7E3; /* Garis bawah untuk tab aktif */
}
</style>
