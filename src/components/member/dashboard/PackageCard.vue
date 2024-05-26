<template>
  <div @click="handleClick" class="p-4 rounded-lg shadow-2xl bg-white cursor-pointer hover:border-blue-500 border transition-all duration-300 flex">
    <!-- <img :src="pkg.imageUrl" alt="Package Image" class="w-24 h-24 object-cover mr-4" /> -->
    <div>
      <h4 class="text-lg font-semibold mb-2">{{ pkg.name }}</h4>
      <p class="text-gray-400 line-through">Rp{{ pkg.originalPrice }}</p>
      <p class="text-green-500">Hemat Rp{{ pkg.originalPrice - pkg.discountPrice }}</p>
      <p class="text-gray-800">Rp{{ pkg.discountPrice }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pkg: Object
});

const emit = defineEmits(['select']);

const handleClick = () => {
  emit('select', props.pkg);
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
