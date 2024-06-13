<template>
  <MemberLayouts>
    <section class="py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Transaksi Saya</h2>
        <p class="text-gray-600 mb-8">
          Berisi transaksi saya yang sudah, belum dan batal terbayar.
        </p>
        <div class="w-full">
          <div class="bg-white p-6 rounded-lg shadow">
            <TabGroup>
              <TabList class="flex space-x-1 bg-blue-900/20 p-1 rounded-lg justify-center">
                <Tab
                  class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  :class="{ 'bg-white shadow': activeTab === 'pending' }"
                  @click="activeTab = 'pending'"
                >
                  Menunggu Pembayaran
                </Tab>
                <Tab
                  class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  :class="{ 'bg-white shadow': activeTab === 'cancelled' }"
                  @click="activeTab = 'cancelled'"
                >
                  Pembayaran Batal
                </Tab>
                <Tab
                  class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  :class="{ 'bg-white shadow': activeTab === 'completed' }"
                  @click="activeTab = 'completed'"
                >
                  Pembayaran Berhasil
                </Tab>
              </TabList>
              <TabPanels class="mt-6">
                <TabPanel v-show="activeTab === 'pending'" class="bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <TransactionCard
                      v-for="transaction in transactions.pending"
                      :key="transaction.id"
                      :transaction="transaction"
                    />
                  </div>
                </TabPanel>

                <TabPanel v-show="activeTab === 'cancelled'" class="bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <TransactionCard
                      v-for="transaction in transactions.cancelled"
                      :key="transaction.id"
                      :transaction="transaction"
                    />
                  </div>
                </TabPanel>

                <TabPanel v-show="activeTab === 'completed'" class="bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <TransactionCard
                      v-for="transaction in transactions.completed"
                      :key="transaction.id"
                      :transaction="transaction"
                    />
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <div class="mt-4">
              <Pagination :current-page="currentPage" :last-page="lastPage" @change-page="fetchTransactionHistory" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberLayouts from '@/components/MemberLayouts.vue';
import TransactionCard from '@/components/member/dashboard/TransactionCard.vue';
import Pagination from '@/components/member/dashboard/Pagination.vue';
import api from '@/api/Api.js';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const activeTab = ref('pending');

const transactions = ref({
  pending: [],
  cancelled: [],
  completed: [],
});

const currentPage = ref(1);
const lastPage = ref(1);

const mapTransactionStatus = (status) => {
  if (status === 'PAID') return 'completed';
  if (status === 'EXPIRED') return 'cancelled';
  return 'pending';
};

const fetchTransactionHistory = async (page = 1) => {
  try {
    const response = await api.get(`/v1/transactions/history?page=${page}`);
    if (response.data.meta.code === 200) {
      const allTransactions = response.data.data.data;
      transactions.value.pending = allTransactions.filter(t => mapTransactionStatus(t.payment_status) === 'pending');
      transactions.value.cancelled = allTransactions.filter(t => mapTransactionStatus(t.payment_status) === 'cancelled');
      transactions.value.completed = allTransactions.filter(t => mapTransactionStatus(t.payment_status) === 'completed');

      currentPage.value = response.data.data.current_page;
      lastPage.value = response.data.data.last_page;

      console.log('Fetched transactions:', transactions.value);
    } else {
      console.error('Failed to fetch transaction history:', response.data.meta.message);
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  }
};

onMounted(() => {
  fetchTransactionHistory();
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
