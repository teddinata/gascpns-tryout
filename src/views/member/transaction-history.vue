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
                  :class="{ 'bg-primary text-white': activeTab === 'pending', 'bg-white text-gray-800': activeTab !== 'pending' }"
                  @click="activeTab = 'pending'"
                >
                  Menunggu Pembayaran
                </Tab>
                <Tab
                  class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  :class="{ 'bg-primary text-white': activeTab === 'cancelled', 'bg-white text-gray-800': activeTab !== 'cancelled' }"
                  @click="activeTab = 'cancelled'"
                >
                  Pembayaran Batal
                </Tab>
                <Tab
                  class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  :class="{ 'bg-primary text-white': activeTab === 'completed', 'bg-white text-gray-800': activeTab !== 'completed' }"
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
                    <div v-observe-visibility="loadMorePending" class="h-10"></div>
                  </div>
                </TabPanel>

                <TabPanel v-show="activeTab === 'cancelled'" class="bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <TransactionCard
                      v-for="transaction in transactions.cancelled"
                      :key="transaction.id"
                      :transaction="transaction"
                    />
                    <div v-observe-visibility="loadMoreCancelled" class="h-10"></div>
                  </div>
                </TabPanel>

                <TabPanel v-show="activeTab === 'completed'" class="bg-white p-6 rounded-lg shadow-md">
                  <div>
                    <TransactionCard
                      v-for="transaction in transactions.completed"
                      :key="transaction.id"
                      :transaction="transaction"
                    />
                    <div v-observe-visibility="loadMoreCompleted" class="h-10"></div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
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
import api from '@/api/Api.js';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import { ObserveVisibility } from 'vue-observe-visibility';

const activeTab = ref('pending');

const transactions = ref({
  pending: [],
  cancelled: [],
  completed: [],
});

const currentPage = ref({
  pending: 1,
  cancelled: 1,
  completed: 1,
});

const lastPage = ref({
  pending: 1,
  cancelled: 1,
  completed: 1,
});

const loading = ref({
  pending: false,
  cancelled: false,
  completed: false,
});

const mapTransactionStatus = (status) => {
  if (status === 'PAID') return 'completed';
  if (status === 'EXPIRED' || status === 'CANCELLED') return 'cancelled';
  return 'pending';
};

const fetchTransactionHistory = async (page = 1, status = 'pending') => {
  if (loading.value[status] || currentPage.value[status] > lastPage.value[status]) return;

  loading.value[status] = true;
  
  try {
    const response = await api.get(`/v1/transactions/history?page=${page}`);
    if (response.data.meta.code === 200) {
      const allTransactions = response.data.data.data;
      const newTransactions = allTransactions.filter(t => mapTransactionStatus(t.payment_status) === status);
      transactions.value[status] = transactions.value[status].concat(newTransactions);

      currentPage.value[status] = response.data.data.current_page;
      lastPage.value[status] = response.data.data.last_page;

      console.log(`Fetched ${status} transactions:`, transactions.value[status]);
    } else {
      console.error('Failed to fetch transaction history:', response.data.meta.message);
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  } finally {
    loading.value[status] = false;
  }
};

const loadMorePending = (isVisible) => {
  if (isVisible && currentPage.value.pending < lastPage.value.pending) {
    fetchTransactionHistory(currentPage.value.pending + 1, 'pending');
  }
};

const loadMoreCancelled = (isVisible) => {
  if (isVisible && currentPage.value.cancelled < lastPage.value.cancelled) {
    fetchTransactionHistory(currentPage.value.cancelled + 1, 'cancelled');
  }
};

const loadMoreCompleted = (isVisible) => {
  if (isVisible && currentPage.value.completed < lastPage.value.completed) {
    fetchTransactionHistory(currentPage.value.completed + 1, 'completed');
  }
};

onMounted(() => {
  fetchTransactionHistory(1, 'pending');
  fetchTransactionHistory(1, 'cancelled');
  fetchTransactionHistory(1, 'completed');
});
</script>


<style scoped>
/* Add any additional styles here */
</style>
