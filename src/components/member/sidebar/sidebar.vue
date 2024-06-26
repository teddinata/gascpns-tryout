<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// import { store } from "@/store";
import { ref, defineProps, computed } from "vue";
import Logo from "./logo.vue";
import NavigationLink from "./navigation.vue";
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from "@iconify/vue";
import api from '@/api/Api.js';
import { formatRupiah } from "@/filters";
import { useToast } from "vue-toastification";

const store = useStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
// const user = ref({});
// const user = computed(() => store.getters['auth/user']);
// const props = defineProps({
//   user: Object,
// });

const logoutAction = async () => {
  try {
    await store.dispatch("auth/logout"); 
    localStorage.removeItem("token");
    toast.success("Anda berhasil logout");
    router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error); // Atau penanganan error lainnya
  }
};

const memberLinks = [
  {
    name: "Dashboard",
    url: "/member/dashboard",
    icons: "ri:dashboard-2-line",
  },
  {
    name: "Tryout",
    url: "/member/my-tryout",
    // icons learning use outline
    icons: "fluent:brain-circuit-20-regular",
  },
  {
    name: "Rangking",
    url: "/member/ranking",
    icons: "flowbite:chart-line-up-outline",
  },
  {
    name: "Raport",
    url: "/member/raport",
    // icon raport use outline 
    icons: "fluent:document-bullet-list-24-regular",
  },
  // {
  //   name: "Statistika",
  //   url: "#",
  //   icons: "solar:volleyball-outline",
  // },
  {
    name: "Tryout Gratis",
    url: "/member/latihan-soal",
    // icons exercise use outline
    icons: "fluent:book-question-mark-24-regular",
    badge: "Terbatas",
  },
  // riwayat transaksi
  {
    name: "Transaksi",
    url: "/member/riwayat-transaksi",
    icons: "fluent:money-24-regular",
  },
  
];

const settings = [
  {
    name: "Pengaturan",
    url: "/member/profile",
    icons: "carbon:settings",
  },
  {
    name: "Bantuan",
    url: "/member/help",
    // icon call center outline
    icons: "fa-solid:headset",
  },
  {
    name: "FAQ",
    url: "/member/faq",
    icons: "f7:question-square",
  },
];

const news = [
  {
    name: "Berita CPNS",
    url: "/member/news",
    icons: "fluent:news-20-regular",
  },
];

const settings2 = [
  {
    name: "Log Out 2",
    url: "#",
    icons: "ph:power-bold",
    // action: "logout",
  },
];

// const toggleSidebar = () => {
//   store.sidebarOpen = !store.sidebarOpen;
// };
</script>
<template>
  <!-- <div class="fixed inset-0 bg-black opacity-70 z-40"></div> -->
  <div class="w-full max-w-[275px] min-h-screen items-center p-5 border-r-2 flex flex-col gap-8 text-text-primary 
  fixed z-[99999] bg-white max-h-screen overflow-y-auto">
  <div class="flex justify-between items-center">
    <div class="w-full">
      <Logo />
    </div>
  </div>

  <!-- MENU section -->
  <div class="flex flex-col gap-4">
    <h1 class="text-md font-medium text-text-tertiary">MENU</h1>
    <NavigationLink :links="memberLinks" />
  </div>

  <!-- SETTINGS section -->
  <div class="flex flex-col gap-4">
    <h1 class="text-md font-medium text-text-tertiary">SETTINGS</h1>
    <NavigationLink :links="settings" />
  </div>

  <!-- NEWS section -->
  <div class="flex flex-col gap-4">
    <h1 class="text-md font-medium text-text-tertiary">NEWS</h1>
    <NavigationLink :links="news" />
  </div>

  <!-- LOGOUT section -->
  <button @click="logoutAction" class="flex w-full justify-center items-center py-2 px-4 bg-secondary rounded-full transition-all duration-300">
    <Icon icon="fa-solid:sign-out-alt" class="text-xl text-white mr-4"></Icon>
    <p class="text-white text-lg">Logout</p>
  </button>
</div>
</template>

<style scoped>
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.animate-pulse {
  animation: blink 1s infinite;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.bg-primary {
  background-color: #3490dc; /* Ganti dengan warna utama Anda */
}

.text-white {
  color: #ffffff;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db; /* Warna hover yang lebih jelas */
}

.hover\:text-gray-900:hover {
  color: #1a202c; /* Warna teks saat dihover */
}

.bg-gray-300 {
  background-color: #d1d5db;
}

.text-gray-900 {
  color: #1a202c;
}
</style>