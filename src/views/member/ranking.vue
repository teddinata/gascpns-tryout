<template>
  <MemberLayouts>
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 z-50">
      <div class="terminal-loader">
        <div class="terminal-header">
          <div class="terminal-title">Status</div>
          <div class="terminal-controls">
            <div class="control close"></div>
            <div class="control minimize"></div>
            <div class="control maximize"></div>
          </div>
        </div>
        <div class="text">Loading...</div>
      </div>        
    </div>

    <div id="app" class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-full mx-auto sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Rank</h2>
        
        <div class="flex items-center space-x-4 mb-8 justify-between">
          <!-- Dropdown Filter -->
          <select v-model="selectedPackageId" @change="fetchData" class="block w-40 md:w-72 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Pilih Paket</option>
            <option v-for="packageOption in packageOptions" :key="packageOption.id" :value="packageOption.id">
              {{ packageOption.name }}
            </option>
          </select>
          <!-- Search Input -->
          <input type="text" v-model="searchQuery" @input="filterData" placeholder="Cari Nama..." class="block w-32 md:w-64 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>
      </div>
  
      <div class="max-w-full mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div v-if="items.length === 0" class="text-center text-gray-500">Tidak ada data.</div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="header in headers" :key="header.value" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in filteredItems" :key="item.rank" :class="getRowClass(item)" class="hover:bg-gray-100">
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.rank }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.provinsi }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.twk }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.tiu }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.tkp }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.total }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ item.keterangan }}</td>
                </tr>                
              </tbody>
            </table>
      
            <!-- <div class="flex justify-between items-center py-3">
              <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-300 text-gray-600 hover:bg-gray-400">Previous</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-300 text-gray-600 hover:bg-gray-400">Next</button>
            </div> -->
          </div>
        </div>
  
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Previous</button>
          <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Next</button>
        </div>
  
        <div v-if="message" class="mt-4 p-4 rounded-md" :class="messageClass">{{ message }}</div>  
  
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
const loggedInUserName = computed(() => store.getters['auth/user'].name);


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
const currentPage = ref(1);
const totalPages = ref(1);
const totalParticipants = ref(0);
const passedParticipants = ref(0);
const failedParticipants = ref(0);
const isLoading = ref(false);

const fetchData = async (page = 1) => {
  if (!selectedPackageId.value) return;

  try {
    isLoading.value = true;
    const response = await api.get('/v1/rankings-by-package', {
      params: {
        package_id: selectedPackageId.value,
        page: page,
        search_name: searchQuery.value
      }
    });

    const responseData = response.data.data; // Akses ke data ranking
    items.value = Array.isArray(responseData.data) ? responseData.data : Object.values(responseData.data);
    filteredItems.value = items.value;
    currentPage.value = responseData.current_page;
    totalPages.value = responseData.last_page;

    // totalParticipants.value = responseData.total;
    // passedParticipants.value = Array.isArray(items.value) ? items.value.filter(item => item.keterangan === 'Lulus').length : 0;
    // failedParticipants.value = totalParticipants.value - passedParticipants.value;

    totalParticipants.value = response.data.total_participants;
    passedParticipants.value = response.data.passed_participants; // Total lulus
    failedParticipants.value = response.data.failed_participants; // Total tidak lulus

    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error);
    isLoading.value = false;
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
  fetchData(currentPage.value);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData(currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData(currentPage.value);
  }
};

// Ambil data paket saat komponen dipasang
onMounted(() => {
  fetchPackageOptions();
});

watch(selectedPackageId, () => fetchData(1));
watch(searchQuery, filterData);

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
.container {
  max-width: 800px;
}
.table-striped tbody tr:nth-child(odd) {
  background-color: #f9fafb; /* Light gray color for odd rows */
}

.table-striped tbody tr:hover {
  background-color: #f1f5f9; /* Slightly darker gray for hover effect */
}

.selected {
  border: 2px solid #1d4ed8; /* Tailwind primary color */
}
.bg-primary {
  background-color: #1d4ed8;
}
.customize-table th, .customize-table td {
  padding: 0.75rem;
}
.customize-table th {
  background-color: #f3f4f6;
  font-weight: bold;
}
.customize-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
.customize-table tbody tr:hover {
  background-color: #f1f5f9;
}
.customize-table tbody tr.highlight {
  background-color: #e3fcec;
}
.customize-table tbody tr.passed {
  background-color: #d1fae5;
  
}
.customize-table tbody tr.failed {
  background-color: #fee2e2;
}
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

/* .passed {
  background-color: green; /* Background color for "Lulus" 
  color: white;
} 

.failed {
  background-color: red; 
  color: white; 
} */

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

@keyframes blinkCursor {
  50% {
    border-right-color: transparent;
  }
}

@keyframes typeAndDelete {
  0%,
  10% {
    width: 0;
  }
  45%,
  55% {
    width: 14ch; /* adjust width based on content */
  }
  90%,
  100% {
    width: 0;
  }
}

.terminal-loader {
  border: 0.1em solid #333;
  background-color: #1a1a1a;
  color: #0f0;
  font-family: "Courier New", Courier, monospace;
  font-size: 1em;
  padding: 1.5em 1em;
  width: 30em;
  margin: 100px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.terminal-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5em;
  background-color: #333;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 0.4em;
  box-sizing: border-box;
}

.terminal-controls {
  float: right;
}

.control {
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.4em;
  border-radius: 50%;
  background-color: #777;
}

.control.close {
  background-color: #e33;
}

.control.minimize {
  background-color: #ee0;
}

.control.maximize {
  background-color: #0b0;
}

.terminal-title {
  float: left;
  line-height: 1.5em;
  color: #eee;
}

.text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 0.2em solid green; /* Cursor */
  animation: typeAndDelete 4s steps(28) infinite,
    blinkCursor 0.5s step-end infinite alternate;
  margin-top: 1.5em;
}

</style>