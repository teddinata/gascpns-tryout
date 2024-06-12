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
  await getUser();
  NProgress.done();
});

const logoutAction = () => {
  store.dispatch('auth/logout');
  router.push('/login');
};
</script>

<template>
  <div class="flex flex-row min-h-screen w-full">
    <!-- <Sidebar v-if="!hideSidebar && user" :user="user" /> -->
    <Sidebar v-if="!hideSidebar" />
    <div class="flex flex-col w-full">
      <TopNavbar
        v-if="user"
        :title="route.meta.title"
        :links="route.meta.links"
        :user="user"
        icon1="mage:notification-bell"
        image="/profile.png"
        @logout="logoutAction"
      />

      <main
        class="flex flex-col min-h-screen md:pl-72 w-full px-7 py-20 bg-background"
        :class="{ 'md:!pl-0 bg-white': hideSidebar }"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
