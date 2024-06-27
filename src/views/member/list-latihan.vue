<template>
  <MemberLayouts>
    <div id="app" class="p-4 sm:p-6 bg-gray-100 min-h-screen mt-8">
      <div class="header mb-6">
        <h2 class="text-lg sm:text-2xl font-bold mb-4">Latihan Soal CPNS</h2>
      </div>
      <TabGroup>
        <TabList class="flex space-x-1 bg-blue-900/20 p-1 rounded-lg">
          <Tab
            as="button"
            class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
            :class="{ 'bg-primary text-white': tab === 'Belum Dikerjakan', 'bg-white text-gray-800': tab !== 'Belum Dikerjakan' }"
            @click="tab = 'Belum Dikerjakan'"
          >
            Belum Diambil
          </Tab>
          <Tab
            as="button"
            class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
            :class="{ 'bg-primary text-white': tab === 'Dikerjakan', 'bg-white text-gray-800': tab !== 'Dikerjakan' }"
            @click="tab = 'Dikerjakan'"
          >
            Sudah Diambil
          </Tab>
        </TabList>
        <TabPanels class="mt-6">
          <TabPanel v-show="tab === 'Belum Dikerjakan'" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tes</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Soal</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Pengerjaan</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in filteredItems" :key="index">
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.judulTes }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.status }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.jumlahSoal }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.waktuPengerjaan }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <button
                        v-if="item.status === 'Belum Dikerjakan' && !item.is_enrolled"
                        @click="claimPackage(item.id)"
                        class="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-secondary"
                      >
                        Klaim
                      </button>
                      <button
                        v-else-if="item.status === 'Dikerjakan' && item.current_tryout && item.current_tryout.status === 1"
                        @click="$router.push(`/member/tryout/${item.next}`)"
                        class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
                      >
                        Lanjutkan Pengerjaan
                      </button>
                      <button
                        v-else-if="item.status === 'Dikerjakan' && item.current_tryout && item.current_tryout.status === 2"
                        @click="$router.push(`/member/tryout/${item.current_tryout.id}/summary`)"
                        class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
                      >
                        Lihat Hasil
                      </button>
                      <button
                        v-else
                        class="w-full rounded-full py-2"
                        :class="{
                          'bg-secondary text-white font-semibold hover:bg-[#FFA500]': item.is_started,
                          'bg-primary text-white font-semibold hover:bg-secondary': !item.is_started,
                        }"
                        @click="item.current_tryout === null ? startTryout(item.id) : $router.push(`/member/tryout/${item.current_tryout.tryout_details[0].id}`)"
                      >
                        <template v-if="isLoading">
                          <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                          </svg>
                          Loading...
                        </template>
                        <template v-else>
                          {{ item.current_tryout === null ? 'Mulai Pengerjaan' : 'Lihat Hasil' }}
                        </template>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredItems.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center">Tidak ada data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel v-show="tab === 'Dikerjakan'" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tes</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Soal</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Pengerjaan</th>
                    <th scope="col" class="px-2 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in filteredItems" :key="index">
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.judulTes }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.status }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.jumlahSoal }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">{{ item.waktuPengerjaan }}</td>
                    <td class="px-2 py-4 sm:px-6 whitespace-nowrap">
                      <button
                        v-if="item.status === 'Belum Dikerjakan' && !item.is_enrolled"
                        @click="claimPackage(item.id)"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Klaim
                      </button>
                      <button
                        v-else-if="item.status === 'Dikerjakan' && item.current_tryout && item.current_tryout.status === 1"
                        @click="$router.push(`/member/tryout/${item.next}`)"
                        class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
                      >
                        Lanjutkan Pengerjaan
                      </button>
                      <button
                        v-else-if="item.status === 'Dikerjakan' && item.current_tryout && item.current_tryout.status === 2"
                        @click="$router.push(`/member/tryout/${item.current_tryout.id}/summary`)"
                        class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
                      >
                        Lihat Hasil
                      </button>
                      <button
                        v-else
                        class="w-full rounded-full py-2"
                        :class="{
                          'bg-secondary text-white font-semibold hover:bg-[#FFA500]': item.is_started,
                          'bg-primary text-white font-semibold hover:bg-secondary': !item.is_started,
                        }"
                        @click="item.current_tryout === null ? startTryout(item.id) : $router.push(`/member/tryout/${item.current_tryout.tryout_details[0].id}`)"
                      >
                        <template v-if="isLoading">
                          <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                          </svg>
                          Loading...
                        </template>
                        <template v-else>
                          {{ item.current_tryout === null ? 'Mulai Pengerjaan' : 'Lihat Hasil' }}
                        </template>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredItems.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center">Tidak ada data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
    <!-- modal for alert claim success -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div class="modal-container bg-white rounded-lg shadow-xl max-w-sm">
        <div class="modal-header">
          <h2 class="text-lg font-semibold mb-4">Selamat! Try out gratis ini berhasil kamu klaim.</h2>
        </div>
        <div class="modal-body">
          <p class="mb-6 text-sm">Kamu bisa langsung memulai mengerjakan try out ini sekarang.</p>
        </div>
        <div class="modal-footer flex justify-end">
          <button @click="showSuccessModal = false" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Oke</button>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { ref, computed, onMounted } from 'vue';
import api from '@/api/Api.js'; // Mengimpor instansi Axios
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const router = useRouter(); 
const toast = useToast(); 
const tab = ref('Belum Dikerjakan');
const items = ref([]);
const isLoading = ref(false);
const showSuccessModal = ref(false);

// Fungsi untuk mengambil data dari API
const fetchFreeTryout = async () => {
    try {
        const response = await api.get('/v1/tryout/free');
        const tryouts = response.data.data; // Akses data tryout dari response
        items.value = tryouts.map(tryout => ({
            id: tryout.id, // Tambahkan id untuk klaim paket
            judulTes: tryout.name,
            status: tryout.is_enrolled ? 'Dikerjakan' : 'Belum Dikerjakan',
            jumlahSoal: tryout.total_question,
            waktuPengerjaan: `${tryout.total_duration} menit`,
            peringkatPembahasan: tryout.is_enrolled ? 'Lihat hasil' : 'Tidak tersedia',
            is_started: tryout.is_started,
            current_tryout: tryout.current_tryout,
            next: tryout.next
        }));
    } catch (error) {
        console.error('Error fetching free tryout data:', error);
    }
};

// Fungsi untuk klaim paket soal gratis
const claimPackage = async (packageId) => {
    try {
        await api.post('/v1/tryout/free/claim', { package_id: packageId });
        // Refresh data setelah klaim berhasil
        fetchFreeTryout();
        showSuccessModal.value = true;
    } catch (error) {
        console.error('Error claiming package:', error);
        alert('Gagal mengklaim paket soal.');
    }
};

// Fungsi untuk memulai latihan soal
const startTryout = async (tryoutId) => {
    try {
        isLoading.value = true;
        const response = await api.post(`/v1/tryout/${tryoutId}/start`);
        const data = response.data; // Menyimpan data response dari API
        isLoading.value = false;

        // Menampilkan informasi tryout yang dimulai
        toast.success(`Tryout berhasil dimulai! Selamat mengerjakan 🙂`);

        // Di sini Anda bisa melakukan navigasi ke halaman pengerjaan tryout. Menggunakan tryoutId yang didapat dari respons API
        router.push(`/member/tryout/${data.next}`); 
        // Tambahkan logika tambahan jika diperlukan, misalnya navigasi ke halaman soal
    } catch (error) {
        isLoading.value = false;
        console.error('Error starting tryout:', error);
        alert('Gagal memulai latihan soal.');
    }
};

// Ambil data saat komponen di-mount
onMounted(fetchFreeTryout);

const filteredItems = computed(() => {
    return items.value.filter(item => item.status === tab.value);
});
</script>

<style scoped>
/* Modal Container */
.modal-container {
  padding: 32px; /* Lebih banyak padding */
}

/* Modal Header */
.modal-header {
  border-bottom: 1px solid #e5e5e5; /* Garis pemisah tipis */
  padding-bottom: 16px; /* Jarak antara judul dan isi */
}

/* Modal Body */
.modal-body {
  padding: 16px 0; /* Jarak antara isi dan tombol */
}

/* Tombol */
.modal-footer button {
  border-radius: 8px; /* Tombol lebih membulat */
  font-weight: 500; /* Sedikit lebih tebal */
}
/** .table-wrapper {
  overflow-x: auto;
}

.tabs button {
  transition: all 0.3s ease;
}

.tabs button:hover {
  background-color: #0BA7E3;
  color: white;
} */
</style>
