<template>
  <MemberLayouts>
    <div id="app" class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-full mx-auto sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Rank</h2>
        
        <div class="flex items-center space-x-4 mb-8 justify-between">
          <!-- Dropdown Filter -->
          <select v-model="selectedPackageId" @change="fetchData" class="block w-72 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Pilih Paket</option>
            <option v-for="packageOption in packageOptions" :key="packageOption.id" :value="packageOption.id">
              {{ packageOption.name }}
            </option>
          </select>
          <!-- Search Input -->
          <input type="text" v-model="searchQuery" @input="filterData" placeholder="Cari Nama..." class="block w-64 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>
      </div>
  
      <div class="max-w-full mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <EasyDataTable
            :headers="headers"
            :items="filteredItems"
            :row-class="getRowClass"
            table-class-name="customize-table"
          />

        </div>
        <div class="bg-white p-6 rounded-lg mt-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-lg font-semibold mb-2">Total Peserta:</p>
              <p>{{ totalParticipants }}</p>
            </div>
            <div>
              <p class="text-lg font-semibold mb-2">Peserta Lulus:</p>
              <p>{{ passedParticipants }}</p>
            </div>
            <div>
              <p class="text-lg font-semibold mb-2">Peserta Tidak Lulus:</p>
              <p>{{ failedParticipants }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg mt-8">
          <p class="text-lg font-semibold mb-4">Informasi</p>
          <ul class="list-disc pl-6">
            <li>Halaman Ranking ini selalu diperbarui setiap kali ada peserta yang mengumpulkan pengerjaan paket soal, sehingga peringkatmu bisa berubah sewaktu-waktu.</li>
            <li>Halaman Ranking ini hanya diperbarui selama periode pengerjaan setiap paket soal.</li>
            <li>Untuk bisa lulus, kamu harus mencapai Passing Grade berikut:
              <ul class="list-disc pl-6">
                <li>TWK (Tes Wawasan Kebangsaan): minimal 65 poin</li>
                <li>TIU (Tes Intelegensi Umum): minimal 80 poin</li>
                <li>TKP (Tes Karakteristik Pribadi): minimal 166 poin</li>
              </ul>
            </li>
            <li>Hasil keseluruhan peringkat dilihat dari berapa kali kamu lulus dan jumlah poin yang kamu dapatkan.</li>
          </ul>
        </div>        
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import api from '@/api/Api.js';

const store = useStore();

const totalParticipants = ref(0);
const passedParticipants = ref(0);
const failedParticipants = ref(0);

const headers = ref([
  { text: "RANK", value: "rank" },
  { text: "NAMA", value: "name"},
  { text: "PROVINSI", value: "provinsi"},
  { text: "TWK", value: "twk"},
  { text: "TIU", value: "tiu"},
  { text: "TKP", value: "tkp", sortable: true},
  { text: "TOTAL", value: "total", width: 200},
  { text: "KETERANGAN", value: "keterangan"},
]);

const items = ref([]);
const filteredItems = ref([]);
const packageOptions = ref([]);
const selectedPackageId = ref('');
const searchQuery = ref('');

const loggedInUserName = computed(() => store.state.user.name); // Ambil nama user dari Vuex

const fetchData = async () => {
  if (!selectedPackageId.value) return;

  try {
    const response = await api.get('/v1/rankings-by-package', {
      params: {
        package_id: selectedPackageId.value,
      }
    });

    const data = response.data.data.data; // Akses ke data ranking
    items.value = data;
    filteredItems.value = data;

    totalParticipants.value = data.length;
    passedParticipants.value = data.filter(item => item.keterangan === 'Lulus').length;
    failedParticipants.value = totalParticipants.value - passedParticipants.value;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchPackageOptions = async () => {
  try {
    const response = await api.get('/v1/packages');
    packageOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
  }
};

const filterData = () => {
  filteredItems.value = items.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

// Ambil data paket saat komponen dipasang
onMounted(() => {
  fetchPackageOptions();
});

watch(selectedPackageId, fetchData);
watch(searchQuery, filterData);

// Function to return row class based on the logged-in user's name and keterangan
const getRowClass = (item) => {
  const classes = [];

  if (item.name === loggedInUserName.value) {
    classes.push('highlight');
  }

  if (item.keterangan === 'Lulus') {
    classes.push('passed');
  } else if (item.keterangan === 'Tidak Lulus') {
    classes.push('failed');
  }

  return classes.join(' ');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.summary {
  display: flex;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.info {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.highlight {
  background-color: yellow; /* Highlight color */
}

.passed {
  background-color: green; /* Background color for "Lulus" */
  color: white; /* Text color for better readability */
}

.failed {
  background-color: red; /* Background color for "Tidak Lulus" */
  color: white; /* Text color for better readability */
}

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 18px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #2d3a4f;
  --easy-table-header-background-color: #fff;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #4c5d7a;
  --easy-table-body-even-row-background-color: #fff;

  --easy-table-body-row-font-color: #2d3a4f;
  --easy-table-body-row-background-color: #fff;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 18px;

  --easy-table-body-row-hover-font-color: #fff;
  --easy-table-body-row-hover-background-color: #2d3a4f;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #fff;
  --easy-table-footer-font-color: #2d3a4f;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;


  --easy-table-scrollbar-track-color: #445269;
  --easy-table-scrollbar-color: #445269;
  --easy-table-scrollbar-thumb-color: #445269;;
  --easy-table-scrollbar-corner-color: #445269;

  --easy-table-loading-mask-background-color: #2d3a4f;

  --easy-table-no-data-font-color: #c0c7d2;
}

</style>