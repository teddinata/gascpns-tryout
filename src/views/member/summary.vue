<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MemberLayouts>
    <!-- <div class="container mx-auto p-4"> -->
      <h1 class="text-2xl font-semibold mb-4">Summary Hasil Tryout CPNS</h1>
      <div class="flex items-center w-60 mb-4">
        <button 
        @click="viewSummary"
        class="flex items-center bg-white text-primary border border-primary 
        py-2 px-4 rounded-full hover:bg-gray-100 transition-all duration-300"
      >
        <Icon icon="mdi:eye" class="mr-2" /> <!-- Menambahkan ikon -->
        Lihat Ringkasan
      </button>
      </div>

      <div v-if="loading" class="space-y-4">
        <div class="bg-gray-200 animate-pulse h-8 w-3/4 rounded"></div>
        <div class="bg-gray-200 animate-pulse h-6 w-1/2 rounded"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-200 animate-pulse h-24 rounded"></div>
          <div class="bg-gray-200 animate-pulse h-24 rounded"></div>
          <div class="bg-gray-200 animate-pulse h-24 rounded"></div>
          <div class="bg-gray-200 animate-pulse h-24 rounded"></div>
        </div>
      </div>
      
      <div v-else>
        <div class="summary-card p-4 bg-white rounded-lg shadow-md mb-4">
          <h2 class="text-xl font-semibold mb-2">Informasi Tryout</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <p class="text-gray-700">Nama Tryout:</p>
            <p class="text-gray-700 font-semibold">{{ tryoutSummary?.package?.name }}</p>
            <p class="text-gray-700">Tanggal Mengerjakan:</p>
            <p class="text-gray-700 font-semibold">{{ formatDateTime(tryoutSummary.started_at) }}</p>
            <p class="text-gray-700">Tanggal Selesai:</p>
            <p class="text-gray-700 font-semibold">{{ formatDateTime(tryoutSummary.finish_time) }}</p>
            <p class="text-gray-700">Waktu Pengerjaan Kamu selama:</p>
            <p class="text-gray-700 font-semibold">{{ tryoutSummary.duration }} Menit</p>
          </div>
        </div>

        <div class="score-card-grid grid grid-cols-1 md:grid-cols-3  gap-4">
          <div 
            v-for="(category, index) in tryoutSummary.categories" 
            :key="index" 
            class="score-card p-4 bg-white rounded-lg shadow-md flex flex-col items-start gap-4"
          >
            <div class="flex items-center">
              <Icon 
                v-if="category.name === 'TWK'"
                class="text-2xl text-primary mr-2"
                icon="mdi:book-open-page-variant"
              />
              <Icon 
                v-else-if="category.name === 'TIU'"
                class="text-2xl text-primary mr-2"
                icon="mdi:brain"
              />
              <Icon 
                v-else-if="category.name === 'TKP'"
                class="text-2xl text-primary mr-2"
                icon="mdi:account"
              />
              <div>
                <h2 class="text-xl font-semibold mb-2">{{ category.name }}</h2>
              </div>
            </div>   
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <p class="text-gray-700">Skor Kamu:</p>
              <p class="text-gray-700 font-semibold">{{ category.score }}</p>
              <p class="text-gray-700">Passing Grade:</p>
              <p class="text-gray-700 font-semibold">{{ category.passing_grade }}</p>
              <p class="text-gray-700">Status:</p>
              <!-- badge if passing grade then pass -->
              <p class="text-gray-700 font-semibold">
                <span 
                  v-if="category.score >= category.passing_grade"
                  class="bg-green-200 text-green-700 px-2 py-1 rounded-md"
                >
                  Lulus
                </span>
                <span 
                  v-else
                  class="bg-red-200 text-red-700 px-2 py-1 rounded-md"
                >
                  Tidak Lulus
                </span>
              </p>
            </div>
          </div>
        </div>
        
      </div>
    <!-- </div> -->
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDateTime } from '@/filters';
import api from '@/api/Api.js';
import MemberLayouts from "@/components/MemberLayouts.vue";

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const tryoutSummary = ref({});

const calculateDuration = (start, finish) => {
  const startDate = new Date(start);
  const finishDate = new Date(finish);
  const diff = finishDate - startDate;
  return Math.floor(diff / 60000);
};

const fetchSummary = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/v1/tryout/${route.params.tryoutId}/summary`);
    tryoutSummary.value = response.data.data;
    tryoutSummary.value.duration = calculateDuration(tryoutSummary.value.started_at, tryoutSummary.value.finish_time);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSummary();
});

const viewSummary = () => {
  const tryoutDetailsId = tryoutSummary.value.next;
  router.push(`/member/tryout/summary/${tryoutDetailsId}`);
};
</script>



<style scoped>
.container {
  max-width: 800px;
}

.summary-card,
.score-card {
  margin-bottom: 20px;
}

.score-card-grid {
  display: grid;
  gap: 20px;
}

.score-card {
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-primary {
  color: #1a73e8;
}

@media (min-width: 768px) {
  .score-card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

