<template>
  <div
    @click="handleClick"
    :class="[
      'p-4 rounded-lg shadow-2xl flex flex-col items-center justify-center bg-white cursor-pointer',
      { 'border-4 border-blue-500': isSelected }
    ]"
  >
    <img :src="method.logo" :alt="method.name" class="w-20 h-20 mb-4 object-contain" />
    <h2 class="text-lg font-semibold mb-2">{{ method.name }}</h2>
    <p class="text-gray-400">Biaya Admin</p>
    <p class="text-red-400 line-through mb-2">{{ method.adminFee }}</p>
    <div class="flex items-center gap-2">
      <p class="text-gray-800 mb-2">Rp 0</p>
      <p class="bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-2">PROMO</p>
    </div>
    <p v-if="method.note" class="text-xs text-gray-800 mt-2">{{ method.note }}</p>
    <div v-if="isSelected" class="absolute top-2 right-2 text-blue-500">
      <Icon icon="fa6-solid:cart-shopping" class="text-2xl" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  method: Object,
  selectedMethodId: Number,
});

const emit = defineEmits(['update:selectedMethodId']);

const isSelected = computed(() => props.selectedMethodId === props.method.id);

const handleClick = () => {
  emit('update:selectedMethodId', props.method.id);
};
</script>

<style scoped>
.border-blue-500 {
  border-color: #3b82f6;
}
</style>
