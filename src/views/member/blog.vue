<template>
  <BlogLayouts>
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-4">Daftar Berita</h1>
      <p class="text-gray-500 mb-8">Berita dan artikel terbaru seputar dunia CPNS, PPPK, BUMN dan instansi lainnya.</p>
      <div class="grid gap-8">
        <!-- Item pertama dengan lebar penuh -->
        <router-link
          v-if="blogs.length > 0"
          :to="{ name: 'news-detail', params: { slug: blogs[0].slug } }"
          class="block bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-2 hover:bg-gray-100 transition duration-200"
        >
          <img :src="blogs[0].image" alt="Blog Image" class="w-full h-64 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{{ blogs[0].title }}</h2>
            <p class="text-gray-500 mb-4">{{ formatDate(blogs[0].created_at) }}</p>
            <p class="text-gray-700 mb-4" v-html="truncateContent(blogs[0].content, 50)"></p>
            <span class="text-blue-500 hover:underline">Baca selengkapnya</span>
          </div>
        </router-link>
        
        <!-- Item-item lainnya sebagai kartu yang lebih kecil -->
        <router-link
          v-for="(blog) in blogs.slice(1)"
          :key="blog.id"
          :to="{ name: 'news-detail', params: { slug: blog.slug } }"
          class="block bg-white rounded-lg shadow-lg overflow-hidden hover:bg-gray-100 transition duration-200"
        >
          <img :src="blog.image" alt="Blog Image" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{{ blog.title }}</h2>
            <p class="text-gray-500 mb-4">{{ formatDate(blog.created_at) }}</p>
            <p class="text-gray-700 mb-4" v-html="truncateContent(blog.content, 50)"></p>
            <span class="text-blue-500 hover:underline">Baca selengkapnya</span>
          </div>
        </router-link>
      </div>
    </div>
  </BlogLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/Api.js';
import BlogLayouts from "@/components/BlogLayouts.vue";

const blogs = ref([]);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const truncateContent = (content, wordLimit) => {
  const words = content.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return content;
};

const fetchBlogs = async () => {
  try {
    const response = await api.get('/v1/blog');
    blogs.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};

onMounted(fetchBlogs);
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.w-full {
  width: 100%;
}

.h-48 {
  height: 12rem;
}

.h-64 {
  height: 16rem;
}

.object-cover {
  object-fit: cover;
}

.p-6 {
  padding: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-500 {
  color: #718096;
}

.text-gray-700 {
  color: #4A5568;
}

.text-blue-500 {
  color: #4299E1;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.leading-relaxed {
  line-height: 1.625;
}
</style>
