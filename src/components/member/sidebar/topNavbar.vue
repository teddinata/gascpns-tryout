<script setup>
const props = defineProps({
  title: String,
  span: String || null,
  icon1: String,
  image: String,
  links: Array, // New prop for dynamic links
  user: Object,
});
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, defineProps } from "vue";
import { formatRupiah } from "@/filters";

const route = useRoute();
const router = useRouter();
const hideSidebar = computed(
  () => route.path === "/member/latihan" || route.path === "/member/tryout"
);
const goBack = () => {
  router.go(-1); // Navigate back one step in history
};

const notifications = ref([
  {
    title: "Transaksi Anda Berhasil!",
    body: "Saldo Anda bertambah sebesar Rp 100.000,00",
    timestamp: "1 jam yang lalu",
    read: false,
  },
  {
    title: "Pembelian Paket Anda Berhasil!",
    body: "Paket Tryout 10 Hari telah berhasil dibeli",
    timestamp: "2 jam yang lalu",
    read: true,
  },
  {
    title: "Teman Anda membelikan Paket Tryout!",
    body: "Teman Anda membelikan Paket Tryout 10 Hari",
    timestamp: "3 jam yang lalu",
    read: false,
  },
]);

const isDropdownOpen = ref(false);
const isToggleDropdownOpen = ref(false);

const notifToggleDropdown = () => {
  isToggleDropdownOpen.value = !isToggleDropdownOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const emits = defineEmits(['logout']);

const handleLogout = () => {
  emits('logout');
};
</script>

<template>
  <header
    v-if="!hideSidebar"
    class="fixed z-10 w-full top-0 left-0 right-0 px-7 py-4 pl-72 bg-white shadow-sm"
    :class="{ 'pl-0': hideSidebar }"
  >
    <div class="flex justify-between items-center pl-4">
      <!-- Dynamic Navigation Links (Breadcrumb) -->
      <div
        v-if="props.links && props.links.length"
        class="flex text-xl font-medium text-text-primary"
      >
        <template v-for="(link, index) in props.links" :key="index">
          <router-link
            :to="link.to"
            :class="{
              'text-text-primary': index === 0,
              'text-primary': index === props.links.length - 1,
            }"
          >
            {{ link.label }}
          </router-link>
          <!-- Add a divider after each link except the last one -->
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
          <button @click="notifToggleDropdown" class="flex items-center gap-2">
            <Icon :icon="props.icon1" class="text-3xl" />
          </button>
          <div v-if="isToggleDropdownOpen" class="absolute right-0 mt-2 w-[500px] bg-white rounded-lg shadow-xl overflow-hidden">
            <!-- Notification list -->
            <div class="py-2">
              <!-- Sample notifications -->
              <div v-for="(notification, index) in notifications" :key="index" 
                :class="{ 'bg-gray-100': notification.read, 'bg-white': !notification.read }">
                <div class="px-4 py-3 flex justify-between items-center">
                  <div class="">
                    <p class="text-text-primary font-semibold">{{ notification.title }}</p>
                    <p class="text-text-secondary">{{ notification.body }}</p>
                  </div>
                  <div class="text-text-tertiary text-xs">{{ notification.timestamp }}</div>
                </div>
              </div>
            </div>
            <!-- Footer with view all notifications button -->
            <div class="bg-gray-50  px-4 py-2">
              <button class="text-sm items-center justify-center text-blue-600 hover:underline">View All Notifications</button>
            </div>
          </div>
        </div>
        
        

        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2">
            <img
              :src="props.image"
              class="w-8 h-8 rounded-full"
              alt="Profile Image"
            />
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

  <header
    v-if="hideSidebar"
    class="fixed z-10 w-full top-0 left-0 right-0 px-7 py-4 bg-white shadow-sm"
  >
    <button @click="goBack" class="flex justify-start items-center gap-3">
      <Icon icon="mingcute:left-line" class="text-3xl" />
      <p class="text-lg text-text-primary font-medium">Kembali</p>
    </button>
  </header>
</template>

<style scoped>
/* Tambahkan ke dalam file CSS Anda */
/* Warna teks untuk judul notifikasi */
.text-text-primary {
  color: #333; /* Ganti dengan warna teks utama Anda */
}

/* Warna teks untuk isi notifikasi */
.text-text-secondary {
  color: #666; /* Ganti dengan warna teks sekunder Anda */
}

/* Warna teks untuk timestamp notifikasi */
.text-text-tertiary {
  color: #999; /* Ganti dengan warna teks tertiari Anda */
}

/* Warna latar belakang untuk footer */
.bg-gray-50 {
  background-color: #f9fafb; /* Ganti dengan warna latar belakang yang Anda inginkan */
}

/* Warna teks untuk tombol View All Notifications */
.text-blue-600 {
  color: #3b82f6; /* Ganti dengan warna teks tombol yang Anda inginkan */
}

</style>