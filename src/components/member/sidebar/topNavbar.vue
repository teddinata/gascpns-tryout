<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Icon } from '@iconify/vue';
import { formatRupiah, relativeTime } from '@/filters';

const props = defineProps({
  title: String,
  span: String || null,
  icon1: String,
  image: String,
  links: Array,
  user: Object,
});

const store = useStore();
const route = useRoute();
const router = useRouter();
const activeTab = ref('transaction'); // Default tab

const hideSidebar = computed(() => route.path === "/member/latihan" || route.path === "/member/tryout");

const goBack = () => {
  router.go(-1);
};

const isDropdownOpen = ref(false);
const isToggleDropdownOpen = ref(false);

const notifToggleDropdown = () => {
  isToggleDropdownOpen.value = !isToggleDropdownOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  store.dispatch('auth/logout');
};

onMounted(() => {
  store.dispatch('auth/fetchNotifications');
});

const notifications = computed(() => store.getters['auth/allNotifications']);
const unreadNotifications = computed(() => store.getters['auth/unreadNotifications']);
const transactionNotifications = computed(() => store.getters['auth/transactionNotifications']);
const informationNotifications = computed(() => store.getters['auth/informationNotifications']);
const latestTransactionNotifications = computed(() => store.getters['auth/latestTransactionNotifications']);
const latestInformationNotifications = computed(() => store.getters['auth/latestInformationNotifications']);

const markAsRead = async (id) => {
  await store.dispatch('auth/markAsRead', id);
};

const goToNotificationCenter = () => {
  router.push({ name: 'notifications-center' });
};

const handleNotificationClick = (notification) => {
  if (notification.link) {
    markAsRead(notification.id);
    navigateToUrl(notification.link);
  } else {
    markAsRead(notification.id);
  }
};

const navigateToUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.origin === window.location.origin) {
      // URL is internal
      router.push(urlObj.pathname + urlObj.search + urlObj.hash);
    } else {
      // URL is external
      window.location.href = url;
    }
  } catch (e) {
    // URL is relative
    router.push(url);
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

</script>

<template>
  <header v-if="!hideSidebar" class="fixed z-10 w-full top-0 left-0 right-0 px-7 py-4 pl-72 bg-white shadow-sm">
    <div class="flex justify-between items-center pl-4">
      <div v-if="props.links && props.links.length" class="flex text-xl font-medium text-text-primary">
        <template v-for="(link, index) in props.links" :key="index">
          <router-link :to="link.to" :class="{'text-text-primary': index === 0, 'text-primary': index === props.links.length - 1}">
            {{ link.label }}
          </router-link>
          <span v-if="index !== props.links.length - 1" class="mx-1">/</span>
        </template>
      </div>

      <div class="flex gap-5 text-text-tertiary">
        <div class="flex text-sm text-gray-500 mt-2">
          <Icon class="text-xl text-primary mr-1" icon="fa6-solid:wallet" />
          <span class="mr-1">Saldo:</span>
          <span>Rp {{ formatRupiah(user?.wallet_balance) }}.00</span>
        </div>
        
        <div class="relative">
          <button @click="notifToggleDropdown" class="flex items-center gap-2 relative">
            <Icon :icon="props.icon1" class="text-3xl" />
            <span v-if="unreadNotifications.length" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ unreadNotifications.length }}
            </span>
          </button>
          <div v-if="isToggleDropdownOpen" class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden">
            <div class="flex justify-start px-4 py-2 bg-gray-100">
              <span class="font-semibold text-md">Notifikasi </span>
              <!-- <span class="text-sm text-gray-600 font-bold ml-1"> ({{ unreadNotifications.length }})</span> -->
            </div>
            <div class="flex justify-around gap-2 mb-2 border-b py-2">
              <button @click="activeTab = 'transaction'" :class="{'text-primary active-tab': activeTab === 'transaction'}">Transaksi</button>
              <button @click="activeTab = 'information'" :class="{'text-primary active-tab': activeTab === 'information'}">Informasi</button>
            </div>
            <div class="py-2">
              <template v-if="(activeTab === 'transaction' ? latestTransactionNotifications : latestInformationNotifications).length">
                <div v-for="(notification, index) in (activeTab === 'transaction' ? latestTransactionNotifications : latestInformationNotifications)" :key="index" 
                  :class="[
                    'notification-item', 
                    notification.is_read ? 'read-notification' : 'unread-notification'
                  ]"
                  @click="handleNotificationClick(notification)"
                  class="px-4 py-3 flex justify-between items-start cursor-pointer notification-item">
                  <img :src="getNotificationIcon(notification.type)" alt="Icon" class="w-10 h-10 mr-4">
                  <div class="flex-grow">
                    <p class="font-semibold">{{ notification.title }}</p>
                    <p>{{ notification.message }}</p>
                    <div class="text-xs mt-2">{{ relativeTime(notification.created_at) }}</div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="px-4 py-3 text-gray-500 text-center">Belum ada notifikasi</div>
              </template>
            </div>
            <div class="flex justify-center px-4 py-2 bg-gray-100">
              <button class="text-sm text-blue-600 hover:underline" @click="goToNotificationCenter">Lihat selengkapnya</button>
            </div>
          </div>
        </div>
        
        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2">
            <img :src="props.image" class="w-8 h-8 rounded-full" alt="Profile Image" />
            <p class="text-text-primary font-medium">Hi, {{ user?.name }}!</p>
            <Icon icon="fa-solid:chevron-down" class="text-xl" />
          </button>
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl">
            <button @click="handleLogout" class="flex items-center gap-2 px-4 py-2">
              <Icon icon="fa-solid:sign-out-alt" class="text-xl" />
              <p class="text-text-primary font-medium">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <header v-if="hideSidebar" class="fixed z-10 w-full top-0 left-0 right-0 px-7 py-4 bg-white shadow-sm">
    <button @click="goBack" class="flex justify-start items-center gap-3">
      <Icon icon="mingcute:left-line" class="text-3xl" />
      <p class="text-lg text-text-primary font-medium">Kembali</p>
    </button>
  </header>
</template>

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

.flex-1 {
  flex: 1;
}

.bg-gray-50 {
  background-color: #f9fafb; /* Warna latar belakang untuk footer notifikasi */
}

button {
  position: relative;
  padding-bottom: 0.5rem; /* Spasi untuk garis di bawah */
}

button.active-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px; /* Tebal garis di bawah */
  background-color: #0BA7E3; /* Warna garis di bawah */
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
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

.notification-item.read-notification:hover {
  background-color: #bfc2c2; /* Warna latar belakang saat hover */
  color: black;
}


.notification-item:hover .hover-text {
  color: black;
}

</style>
