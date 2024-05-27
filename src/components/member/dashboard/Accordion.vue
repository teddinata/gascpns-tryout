<template>
  <div>
    <button @click="toggle" class="w-full flex justify-between items-center p-4 bg-gray-200">
      <span>{{ title }}</span>
      <svg :class="{'transform rotate-180': isOpen}" class="w-4 h-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div v-if="isOpen" class="p-4 bg-white border border-t-0 border-gray-200">
      <p>{{ instructions }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    instructions: String
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
