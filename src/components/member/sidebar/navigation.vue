<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

const route = useRoute();
const props = defineProps({
  links: Array,
});

const isActiveLink = (url) => {
  return route.path === url;
};

const openDropdown = ref(null);

onMounted(() => {
  openDropdown.value = parseInt(localStorage.getItem("openDropdown")) || null;
});

// const toggleDropdown = (index) => {
//   const link = props.links[index];
//   if (link.name === "Soal & Paket") {
//     if (openDropdown.value === index) {
//       openDropdown.value = null;
//     } else {
//       openDropdown.value = index;
//     }

//     // Store the openDropdown state in local storage
//     localStorage.setItem("openDropdown", openDropdown.value);
//   }
// };
</script>

<template>
  <nav class="flex flex-col gap-2">
    <template v-for="link in links" :key="link.name">
      <div class="relative">
        <router-link
          :to="link.url"
          class="flex items-center gap-4 py-3 px-4 rounded-lg text-lg transition-colors duration-300"
          :class="{
            'bg-primary text-white': isActiveLink(link.url),
            'hover:bg-gray-300 hover:text-gray-900': !isActiveLink(link.url)
          }"
        >
          <Icon :icon="link.icons" class="text-2xl"></Icon>
          <div class="flex flex-col">
            <span>{{ link.name }}</span>
            <!-- Badge -->
            <span v-if="link.badge" class="mt-1 px-2 py-1 text-sm font-semibold bg-red-500 text-white rounded-full animate-pulse">
              {{ link.badge }}
            </span>
          </div>
        </router-link>
      </div>
    </template>
  </nav>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}
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
