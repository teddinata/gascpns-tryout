<template>
  <div class="flex justify-center">
    <button
      @click="$emit('change-page', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 mx-1 border rounded-md bg-gray-200"
    >
      Previous
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      @click="$emit('change-page', page)"
      :class="{'bg-blue-500 text-white': currentPage === page, 'bg-gray-200': currentPage !== page}"
      class="px-4 py-2 mx-1 border rounded-md"
    >
      {{ page }}
    </button>
    <button
      @click="$emit('change-page', currentPage + 1)"
      :disabled="currentPage === lastPage"
      class="px-4 py-2 mx-1 border rounded-md bg-gray-200"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(['changePage']);

const changePage = (page) => {
  if (page > 0 && page <= props.lastPage) {
    emits('changePage', page);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
