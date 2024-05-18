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
    icons: "f7:question-square",
  },
  {
    name: "Rangking",
    url: "#",
    icons: "flowbite:chart-line-up-outline",
  },
  {
    name: "Statistika",
    url: "#",
    icons: "solar:volleyball-outline",
  },
  {
    name: "Latihan Soal",
    url: "/member/latihan",
    icons: "gg:browser",
  },
  {
    name: "FAQ",
    url: "#",
    icons: "gg:browser",
  },
];

const settings = [
  {
    name: "Pengaturan",
    url: "#",
    icons: "carbon:settings",
  },
  {
    name: "Bantuan",
    url: "#",
    icons: "bx:bxs-help-circle",
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
    
    <!-- <div class="flex justify-center items-center w-auto bg-primary rounded-full mt-5">
      <img src="/profile.png" alt="profile" class="w-14  rounded-full" />
    </div>
    <div class="flex flex-col justify-between items-center mt-2">
      <div class="flex justify-center items-center w-full">
        <h4 class="mr-2">{{ user?.name }}</h4>
        <div class="flex justify-center items-center w-5 h-5 bg-primary rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <div class="flex text-sm text-gray-500 mt-2">
        <Icon class="text-xl text-primary mr-1" icon="fa6-solid:wallet" />
        <span class="mr-1">Saldo:</span>
        <span>Rp {{ formatRupiah(user?.wallet_balance) }}.00</span>
      </div>
    </div> -->
    

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

    <!-- LOGOUT section -->
      <button @click="logoutAction" class="flex w-full justify-center items-center py-2 px-4 bg-secondary rounded-full transition-all duration-300">
          <Icon icon="fa-solid:sign-out-alt" class="text-3xl text-white mr-4"></Icon>
          <p class="text-white text-lg">Logout</p>
      </button>
    
  </div>
</template>
