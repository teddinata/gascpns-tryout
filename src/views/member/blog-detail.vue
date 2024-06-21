<template>
  <BlogLayouts>
    <div class="flex flex-col lg:flex-row lg:space-x-10 mt-10">
      <div class="max-w-4xl bg-white rounded-lg shadow-md p-6 flex-1">
        <h1 class="text-3xl font-semibold mb-4">{{ blog.title }}</h1>
        <div class="text-gray-600 mb-4">
          <span>{{ formatDate(blog.created_at) }}</span>
          <span class="mx-2">•</span>
          <span>{{ blog.views }}x dilihat</span>
          <span class="mx-2">•</span>
          <span>{{ readTime }} menit estimasi waktu baca</span>
        </div>
        <img :src="blog.image" alt="Blog Image" class="w-full h-auto mb-4 rounded-lg">
        <div class="text-lg leading-relaxed" v-html="blog.content"></div>
      </div>

      <div class="related-blogs mt-10 lg:mt-0 lg:w-1/3">
        <h2 class="text-2xl font-semibold mb-4">Related Blogs</h2>
        <div class="grid md:grid-cols-1 gap-5">
          <div v-for="relatedBlog in relatedBlogs" :key="relatedBlog.id" class="related-blog-card bg-white p-4 rounded-lg shadow-md">
            <img :src="relatedBlog.image" alt="Related Blog Image" class="w-full h-40 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-semibold">{{ relatedBlog.title }}</h3>
            <p class="text-gray-600">{{ formatDate(relatedBlog.created_at) }}</p>
            <router-link :to="{ name: 'news-detail', params: { slug: relatedBlog.slug } }" class="text-blue-500 hover:underline">Read more</router-link>
          </div>
        </div>
      </div>
    </div>
  </BlogLayouts>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/Api.js';
import BlogLayouts from "@/components/BlogLayouts.vue";

const route = useRoute();
const blog = ref({});
const allBlogs = ref([]);
const readTime = ref(0);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locale = 'id-ID'; // Set the locale to 'id-ID' for Indonesian format
  return new Date(dateString).toLocaleDateString(locale, options);
};

const fetchBlogDetail = async (id) => {
  try {
    const response = await api.get(`/v1/blog/${id}`);
    blog.value = response.data.blog;
    readTime.value = response.data.readTime;

    // Set document title using blog title
    document.title = `${blog.value.title} | GASCPNS`;
  } catch (error) {
    console.error('Error fetching blog detail:', error);
  }
};

const fetchAllBlogs = async () => {
  try {
    const response = await api.get('/v1/blog');
    allBlogs.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching all blogs:', error);
  }
};

// Filter related blogs excluding the current blog
const relatedBlogs = computed(() => {
  return allBlogs.value.filter(b => b.id !== blog.value.id).slice(0, 3);
});

onMounted(async () => {
  await fetchBlogDetail(route.params.slug);
  await fetchAllBlogs();
});
</script>

<style scoped>
.related-blogs {
  max-width: 100%;
}
</style>
