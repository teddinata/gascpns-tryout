<template>
  <MemberLayouts>
    <div class="container mx-auto py-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-4">Profil Saya</h1>
        <div class="flex items-center mb-4">
          <img :src="user.avatar" alt="Profile Picture" class="h-20 w-20 object-cover rounded-full mr-4">
          <div>
            <h2 class="text-xl font-semibold flex items-center">
              {{ user.name }}
              <span class="ml-4 bg-yellow-100 text-yellow-700 p-2 rounded-lg text-sm cursor-pointer" @click="copyReferralCode">
                {{ user.referral_code }}
                <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6z"></path>
                </svg>
              </span>
            </h2>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-gray-600">Usia: {{ user.age }}</p>
          </div>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 class="text-xl font-bold mb-2">Saldo Anda</h3>
          <p class="text-2xl font-semibold text-green-600">{{ formatRupiah(user.wallet_balance) }}</p>
        </div>
        <router-link to="/member/topup" class="mt-4 inline-block bg-primary rounded-full text-white px-4 py-2 shadow hover:bg-blue-700">Top-Up Saldo</router-link>
      </div>
      
      <!-- Riwayat Pengisian Saldo -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Riwayat Pengisian Saldo</h2>
        <div v-if="topupHistory.length === 0" class="text-gray-600">Belum ada riwayat pengisian saldo.</div>
        <div v-else class="space-y-4">
          <div v-for="history in topupHistory" :key="history.id" class="bg-gray-100 p-4 rounded-lg shadow cursor-pointer" @click="goToTransactionDetail(history.id)">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold">ID Transaksi: {{ history.id }}</h3>
                <p class="text-gray-600">Jumlah: {{ formatRupiah(history.amount) }}</p>
                <p class="text-gray-600">Metode Pembayaran: {{ history.payment_method }}</p>
                <p class="text-gray-600 mt-2">Status:
                  <span v-if="history.payment_status === 'PAID'" class="px-2 py-1 bg-green-500 text-white rounded-md">Topup Sukses</span>
                  <span v-else-if="history.payment_status === 'PENDING' ||  history.payment_status === 'UNPAID'" class="px-2 py-1 bg-yellow-500 text-white rounded-md">Menunggu Pembayaran</span>
                  <span v-else class="px-2 py-1 bg-red-500 text-white rounded-md">Topup Gagal</span>
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ formatDateTime(history.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';
import { useToast } from 'vue-toastification';

const store = useStore();
const router = useRouter();
const toast = useToast();
const user = ref({});
const topupHistory = ref([]);

const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const goToTransactionDetail = (id) => {
  router.push({ name: 'topup-detail', params: { id } });
};

const copyReferralCode = () => {
  navigator.clipboard.writeText(user.value.referral_code)
    .then(() => {
      toast.success('Kode referral berhasil disalin!');
    })
    .catch(err => {
      toast.error('Gagal menyalin kode referral');
      console.error('Failed to copy referral code:', err);
    });
};

onMounted(async () => {
  if (!store.state.auth.user) {
    router.push('/login');
  } else {
    user.value = store.state.auth.user;
    try {
      const response = await api.get('/v1/topup/history');
      topupHistory.value = response.data.data;
    } catch (error) {
      console.error('Error fetching top-up history:', error);
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.bg-yellow-100 {
  background-color: #FEF3C7;
}

.text-yellow-700 {
  color: #B45309;
}
</style>
