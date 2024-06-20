<template>
  <MemberLayouts>
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-semibold mb-4">{{ blog.title }}</h1>
      <div class="text-gray-600 mb-4">
        <span>{{ formatDate(blog.created_at) }}</span>
        <span class="mx-2">•</span>
        <span>{{ blog.views }} views</span>
        <!-- readTime -->
        <span class="mx-2">•</span>
        <span>{{ readTime }} menit estimasi waktu baca</span>
      </div>
      <img :src="blog.image" alt="Blog Image" class="w-full h-64 object-cover mb-4 rounded-lg">
      <div class="text-lg leading-relaxed" v-html="blog.content"></div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/Api.js';
import MemberLayouts from "@/components/MemberLayouts.vue";

const route = useRoute();
const blog = ref({});
const readTime = ref(0);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(async () => {
  try {
    const response = await api.get(`/v1/blog/${route.params.id}`);
    blog.value = response.data.blog;
    readTime.value = response.data.readTime;
    console.log('Blog detail:', blog.value);
  } catch (error) {
    console.error('Error fetching blog detail:', error);
  }
});
</script>
