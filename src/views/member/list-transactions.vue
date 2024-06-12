<template>
  <MemberLayouts>
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bayar</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Bayar</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in transactionHistory" :key="index" class="hover:bg-gray-100 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  {{ item.invoice_code }}
                  <div class="text-xs text-text-quaternary">{{ formatDateTime(item.created_at) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-text-primary">{{ item.package.name }}</div>
                <div class="text-xs text-text-quaternary">{{ item.package.total_question }} soal, {{ item.package.total_duration }} menit</div>              </td>
              <td class="px-6 py-4 whitespace-nowrap">Rp{{ formatRupiah(item.total_amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-text-primary">{{ item.payment_method === 'WALLET' ? 'GAS Koin' : item.payment_method }}</div>
                <span v-if="item.payment_status === 'PAID'" class="mt-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Lunas</span>
                <span v-else-if="item.payment_status === 'PENDING'" class="mt-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Menunggu Pembayaran</span>
                <span v-else-if="item.payment_status === 'EXPIRED'" class="mt-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Dibatalkan</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <router-link :to="{ name: 'detail-transaksi', params: { id: item.id } }">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors duration-200">Detail</button>
                  </router-link>
                </td>
            </tr>
            <tr v-if="transactionHistory.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <img src="../../assets/empty-folder.svg" class="w-32 mx-auto mb-4" />
                <h1 class="text-lg font-semibold text-text-primary mb-2">Kamu belum membeli Tryout</h1>
                <p class="text-sm font-medium text-text-quaternary mb-4">Yuk beli Tryout sekarang dan mulai kerjakan Tryout yang kamu beli</p>
                <router-link to="/member/my-tryout">
                  <button class="bg-primary text-white font-semibold rounded-full py-2 px-4 hover:bg-secondary transition-colors duration-200">Beli Tryout</button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="totalItems > 0" class="py-4 px-6">
          <ul class="flex justify-center space-x-2">
            <li>
              <button
                @click="fetchPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </li>
            <li v-for="page in totalPages" :key="page">
              <button
                @click="fetchPage(page)"
                :class="{'bg-blue-500 text-white': currentPage === page, 'bg-gray-200 hover:bg-gray-300': currentPage !== page}"
                class="px-3 py-1 rounded-full"
              >
                {{ page }}
              </button>
            </li>
            <li>
              <button
                @click="fetchPage(currentPage + 1)"
                :disabled="currentPage === lastPage"
                class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js'; // Mengimpor instansi Axios
import { formatDateTime, formatRupiah } from "@/filters";
import { useRouter } from 'vue-router';

const transactionHistory = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);
const totalPages = ref([]);
const router = useRouter();

const fetchTransactionHistory = async (page = 1) => {
  try {
    const response = await api.get(`/v1/transactions/history?page=${page}`);
    if (response.data.meta.code === 200) {
      transactionHistory.value = response.data.data.data;
      currentPage.value = response.data.data.current_page;
      lastPage.value = response.data.data.last_page;
      totalItems.value = response.data.data.total;

      // Update total pages
      totalPages.value = Array.from({ length: lastPage.value }, (_, i) => i + 1);
    } else {
      console.error('Failed to fetch transaction history:', response.data.meta.message);
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  }
};

const statusClasses = (status) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'FAILED':
      return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
};

const fetchPage = (page) => {
  if (page > 0 && page <= lastPage.value) {
    fetchTransactionHistory(page);
  }
};

onMounted(() => {
  fetchTransactionHistory();
});
</script>

<style scoped>
.bg-primary {
  background-color: #3b82f6; /* Replace with your primary color */
}

.hover\:bg-secondary:hover {
  background-color: #6366f1; /* Replace with your secondary color */
}

.text-text-primary {
  color: #111827; /* Replace with your primary text color */
}

.text-text-quaternary {
  color: #6b7280; /* Replace with your quaternary text color */
}

.block {
  display: block;
}

.mt-1 {
  margin-top: 0.25rem;
}
</style>
