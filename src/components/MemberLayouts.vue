<!-- MemberLayout.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import NProgress from "nprogress"; // Impor NProgress
import Sidebar from "./member/sidebar/sidebar.vue";
import TopNavbar from "./member/sidebar/topNavbar.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const user = ref(null);
const sidebarOpen = ref(false);  // Tambahkan state ini untuk mengontrol sidebar

const hideSidebar = computed(
  () => route.path === "/member/latihan" || route.path === "/member/tryout"
);

const getUser = async () => {
  try {
    await store.dispatch('auth/getUser');
    user.value = store.getters['auth/user'];
    console.log('User:', user.value.name);
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

onMounted(async () => {
  NProgress.start();
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true;
  }
  await getUser();
  NProgress.done();
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;  // Tambahkan fungsi ini untuk toggle sidebar
};

const logoutAction = () => {
  store.dispatch('auth/logout');
  router.push('/login');
};
</script>

<template>
  <div class="flex flex-row min-h-screen w-full">
    <!-- Add v-if binding with sidebarOpen -->
    <Sidebar :show="sidebarOpen" @closeSidebar="sidebarOpen = false" />
    <div :class="{'w-full': true, 'ml-0': !sidebarOpen, 'ml-72': sidebarOpen}">
      <TopNavbar
        v-if="user"
        :title="route.meta.title"
        :links="route.meta.links"
        :user="user"
        icon1="mage:notification-bell"
        image="/profile.png"
        @toggleSidebar="toggleSidebar" 
        @logout="logoutAction"
      />

      <main
        class="flex flex-col min-h-screen w-full px-7 py-20 bg-background"
        :class="{ 'bg-white': hideSidebar }"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
