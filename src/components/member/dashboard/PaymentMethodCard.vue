<template>
  <!-- <div
    @click="handleClick"
    :class="[
      'p-4 rounded-lg shadow-2xl flex flex-col items-center justify-center bg-white cursor-pointer',
      { 'border-4 border-blue-500': isSelected }
    ]"
  > -->
  <div @click="selectMethod" :class="{ 'selected': isSelected }" class="payment-method-card">
    <img :src="method.logo" :alt="method.name" class="w-20 h-20 mb-4 object-contain" />
    <h2 class="text-lg font-semibold mb-2">{{ method.name }}</h2>
    <p class="text-gray-400">Biaya Admin</p>
    <p class="text-red-400 line-through mb-2">{{ method.adminFee }}</p>
    <div class="flex items-center gap-2">
      <p class="text-gray-800 mb-2">Rp 0</p>
      <p class="bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-2">PROMO</p>
    </div>
    <p v-if="method.note" class="text-xs text-gray-800 mt-2">{{ method.note }}</p>
    <div v-if="isSelected" class="absolute top-2 right-2 text-primary">
      <Icon icon="fa-solid:check-circle" class="text-xl" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  method: Object,
  selectedMethodId: Number,
});

const emit = defineEmits(['update:selectedMethodId']);

// const isSelected = computed(() => props.selectedMethodId === props.method.id);
const isSelected = computed(() => props.method.id === props.selectedMethodId);


const selectMethod = () => {
  emit('update:selectedMethodId', props.method.id);
};
</script>

<style scoped>
.border-blue-500 {
  border-color: #3b82f6;
}

.payment-method-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.payment-method-card.selected {
  border-color: #3490dc;
}

.logo {
  max-width: 100%;
  height: auto;
}

.details {
  margin-top: 8px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
}

p {
  font-size: 14px;
  color: #555;
}
</style>
