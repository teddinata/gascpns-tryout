<template>
  <MemberLayouts>
    <div id="app" class="p-6 bg-gray-100 min-h-screen mt-8">
      <div class="header mb-6">
        <h2 class="text-2xl font-bold mb-4">Raport</h2>
      </div>
      <div class="summary grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p class="text-3xl font-bold">{{ totalTryouts }}</p>
          <p>Tryout Diikuti</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p class="text-3xl font-bold">{{ completedTryouts }}</p>
          <p>Tryout Dikerjakan</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <p class="text-3xl font-bold">{{ passingRate }}%</p>
          <p>Persentase Kelulusan</p>
        </div>
      </div>
      <div class="table-wrapper bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-bold mb-4">Tabel Raport</h3>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tryout</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TWK</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIU</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TKP</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(tryout, index) in items" :key="index" :class="getRowClass(tryout)">
              <td class="px-6 py-4 whitespace-nowrap">{{ tryout.package.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getScoreByCategory(tryout.categories, 1) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getScoreByCategory(tryout.categories, 2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getScoreByCategory(tryout.categories, 3) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getTotalScore(tryout.categories) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getKeterangan(tryout) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';

const items = ref([]);
const totalTryouts = ref(0);
const completedTryouts = ref(0);
const passingRate = ref(0);

// Fungsi untuk mengambil data dari API
const fetchRaportData = async () => {
  try {
    const response = await api.get('/v1/raport');
    const raportData = response.data.data;

    // Set nilai items
    items.value = raportData.tryouts;

    // Hitung statistik
    totalTryouts.value = raportData.totalTryouts;
    completedTryouts.value = raportData.completedTryouts;
    passingRate.value = raportData.passingRate;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fungsi untuk mendapatkan skor berdasarkan kategori
const getScoreByCategory = (categories, categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.score : 0;
};

// Fungsi untuk mendapatkan total skor
const getTotalScore = (categories) => {
  return categories.reduce((total, category) => total + category.score, 0);
};

// Fungsi untuk mendapatkan keterangan (LULUS/TIDAK LULUS) untuk setiap tryout
const getKeterangan = (item) => {
  const twkScore = getScoreByCategory(item.categories, 1);
  const tiuScore = getScoreByCategory(item.categories, 2);
  const tkpScore = getScoreByCategory(item.categories, 3);
  const totalScore = twkScore + tiuScore + tkpScore;

  if (twkScore < 85 || tiuScore < 65 || tkpScore < 166 || totalScore < 311) {
    return 'TIDAK LULUS';
  } else {
    return 'LULUS';
  }
};

// Fungsi untuk memberikan kelas pada baris berdasarkan keterangan
const getRowClass = (item) => {
  return getKeterangan(item) === 'LULUS' ? 'bg-green-100' : 'bg-red-100';
};

// Fungsi untuk mengatur data saat komponen dimounted
onMounted(() => {
  fetchRaportData();
});
</script>


<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.bg-green-100 {
  background-color: #d1fae5; /* Tailwind's bg-green-100 color */
}

.bg-red-100 {
  background-color: #fee2e2; /* Tailwind's bg-red-100 color */
}
</style>
