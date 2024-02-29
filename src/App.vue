<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./components/admin/sidebar/sidebar.vue";
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <main class="flex flex-col min-h-screen w-full p-7 bg-background">
      <RouterView />
    </main>
  </div>
</template>
