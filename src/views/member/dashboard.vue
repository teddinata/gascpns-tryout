<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import DashboardCard from "@/components/member/dashboard/dashboardCard.vue";
import SoalCard from "@/components/member/dashboard/soalCard.vue";
import MemberLayouts from "@/components/MemberLayouts.vue";
import { formatRupiah } from "@/filters";

import { ref, onMounted, computed } from "vue";
import axios from "axios";
import api from '@/api/Api.js'; // Mengimpor instansi Axios

const soalData = ref([]);
const blogData = ref([]);
const dashboardData = ref({});

onMounted(async () => {
  try {
    const responseSoal = await api.get(`/v1/tryout/favorite`);
    soalData.value = responseSoal.data.data.data;
    console.log('Soal details:', soalData.value[0].discount);
    
    const responseBlog = await api.get(`/v1/blog`);
    blogData.value = responseBlog.data.data.data;
    console.log('Blog details:', blogData.value);

    const dashboard = await api.get(`/v1/dashboard`);
    dashboardData.value = dashboard.data.data;
    console.log('Dashboard details:', dashboard.data.data);
  } catch (error) {
    console.error('Error fetching details:', error);
    // Handle error, tampilkan pesan error, dll.
  }
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locale = 'id-ID'; // Set the locale to 'id-ID' for Indonesian format
  return new Date(dateString).toLocaleDateString(locale, options);
};

const truncateContent = (content) => {
  const div = document.createElement('div');
  div.innerHTML = content;
  const text = div.textContent || div.innerText || '';
  const words = text.split(' ');
  if (words.length > 50) {
    return words.slice(0, 50).join(' ') + '...';
  }
  return text;
};

const truncatedBlogData = computed(() => {
  return blogData.value.map(blog => ({
    ...blog,
    truncatedContent: truncateContent(blog.content),
  }));
});
</script>

<template>
  <MemberLayouts>
    <div class="flex flex-col space-y-10">
      <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <DashboardCard
          title="Paket Tryoutmu"
          icon="mage:message-question-mark-fill"
          :content="dashboardData.total_purchased_package"
          content-color="text-text-primary"
          bg-icon-color="bg-[#E0F3FE]"
          icon-color="text-primary"
        />
        <!-- <DashboardCard
          title="Rangking Terakhir"
          icon="fa6-solid:ranking-star"
          content="10"
          content-color="text-text-primary"
          bg-icon-color="bg-[#FDFEE0]"
          icon-color="text-[#E8C444]"
        /> -->
        <DashboardCard
          title="Tryout Dikerjakan"
          icon="mage:message-question-mark-fill"
          :content="dashboardData.total_tryout_worked"
          content-color="text-text-primary"
          bg-icon-color="bg-[#FEE0E0]"
          icon-color="text-[#E30B3F]"
        />
        <DashboardCard
          title="Transaksi Kamu"
          icon="fa6-solid:money-bill-wave"
          :content="formatRupiah(dashboardData.total_transaction)"
          content-color="text-text-primary"
          bg-icon-color="bg-[#E0FEE0]"
          icon-color="text-[#0BE361]"
        />
        <DashboardCard
          title="Total User"
          icon="mage:users-fill"
          :content="dashboardData.total_user"
          content-color="text-text-primary"
          bg-icon-color="bg-[#E0FEEE]"
          icon-color="text-[#0BE361]"
        />
      </div>
      <div class="flex flex-col space-y-4">
        <h1 class="text-lg font-medium text-black">Soal Favorite</h1>
        <div class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
          <SoalCard v-for="soal in soalData"
              :key="soal.id"
              :slug="soal.slug"
              v-bind="soal" 
              />
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <h1 class="text-lg font-medium text-black">Info Terbaru</h1>
        <div class="grid md:grid-cols-3 grid-cols-1 gap-5">
          <router-link
            v-for="blog in truncatedBlogData"
            :key="blog.id"
            :to="{ name: 'news-detail', params: { slug: blog.slug } }"
            class="bg-white rounded-lg shadow-lg p-4 block hover:bg-gray-100 transition duration-200"
          >
            <img :src="blog.image" alt="Blog Image" class="w-full h-48 object-cover rounded-lg">
            <div class="p-4">
              <h2 class="font-semibold text-lg mb-2">{{ blog.title }}</h2>
              <div class="text-gray-700 mb-4 truncate-ellipsis">{{ blog.truncatedContent }}</div>
              <div class="flex justify-between items-center text-gray-500 text-sm">
                <span>{{ formatDate(blog.created_at) }}</span>
                <span>{{ blog.views }} views</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<style>
.truncate-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
}
</style>
