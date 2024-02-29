<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// import { store } from "@/store";
import Logo from "./logo.vue";
import Navigation from "./navigation.vue";
import { Icon } from "@iconify/vue";
const links = [
  {
    name: "Dashboard",
    url: "/",
    icons: "ri:dashboard-2-line",
  },
  {
    name: "Soal & Paket",
    url: "/soal",
    icons: "f7:question-square",
    children: [
      {
        label: "Paket Soal Tryout",
        name: "paket tryout",
        to: "/soal/paket",
      },
      {
        label: "Soal Tryout",
        name: "soal tryout",
        to: "/soal/tryout",
      },
    ],
  },
  {
    name: "Statistika",
    url: "/statistika",
    icons: "flowbite:chart-line-up-outline",
  },
  {
    name: "Soal Latihan",
    url: "/latihan",
    icons: "solar:volleyball-outline",
  },
  {
    name: "Konten",
    url: "/konten",
    icons: "gg:browser",
  },
];

const settings = [
  {
    name: "Pengaturan",
    url: "/pengaturan",
    icons: "carbon:settings",
  },
  {
    name: "Keluar",
    url: "/keluar",
    icons: "ph:power-bold",
  },
];

// const toggleSidebar = () => {
//   store.sidebarOpen = !store.sidebarOpen;
// };
</script>
<template>
  <!-- <div class="fixed inset-0 bg-black opacity-70 z-40"></div> -->
  <div
    class="w-full max-w-[275px] min-h-screen p-5 border-r-2 flex flex-col gap-8 text-text-primary static z-50 bg-white"
  >
    <div class="flex justify-between items-center">
      <div class="w-full">
        <Logo />
      </div>
      <button class="lg:hidden block">
        <Icon icon="ci:hamburger-md" size="40" class="text-text-primary" />
      </button>
    </div>

    <!-- MENU section -->
    <div class="flex flex-col gap-4">
      <h1 class="text-md font-medium text-text-tertiary">MENU</h1>
      <Navigation :links="links" />
    </div>

    <!-- SETTINGS section -->
    <div class="pt-10 flex flex-col gap-4">
      <h1 class="text-md font-medium text-text-tertiary">SETTINGS</h1>
      <Navigation :links="settings" />
    </div>
  </div>
</template>
