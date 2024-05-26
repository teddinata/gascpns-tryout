<template>
  <div @click="handleClick" class="p-4 rounded-lg shadow-2xl bg-white cursor-pointer hover:border-blue-500 border transition-all duration-300">
    <h4 class="text-lg font-semibold mb-2">{{ item.name }}</h4>
    <p class="text-gray-400 line-through">Rp{{ item.originalPrice }}</p>
    <p class="text-green-500">Hemat Rp{{ item.originalPrice - item.discountPrice }}</p>
    <p class="text-gray-800">Rp{{ item.discountPrice }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object
});

const emit = defineEmits(['select']);

const handleClick = () => {
  emit('select', props.item);
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
