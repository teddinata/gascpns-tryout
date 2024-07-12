<template>
  <MemberLayouts>
    <div class="container mx-auto py-8 px-4">
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 class="text-3xl font-bold mb-6">Profil Saya</h1>
        <div class="flex flex-col sm:flex-row items-center mb-6">
          <img :src="user.avatar" alt="Profile Picture" class="h-20 w-20 object-cover rounded-full mb-4 sm:mb-0">
          <div class="text-center sm:text-left sm:ml-6">
            <h2 class="text-xl font-semibold mb-2">
              {{ user.name }}
              <span class="ml-2 bg-yellow-100 text-yellow-700 p-2 hidden md:inline-block 
                rounded-lg text-sm cursor-pointer" @click="copyReferralCode">
                {{ user.referral_code }}
                <Icon icon="mdi:clipboard" class="w-4 h-4 inline ml-1" />
              </span>
            </h2>
            <p class="text-gray-600 mb-1">{{ user.email }}</p>
            <p class="text-gray-600 mb-3">Usia: {{ user.age }}</p>
            <router-link to="/member/profile" class="inline-flex items-center bg-blue-500 rounded-full text-white px-4 py-2 shadow hover:bg-blue-700 mt-2">
              <Icon icon="mdi:pencil" class="w-4 h-4 mr-2" />
              Edit Profil
            </router-link>
          </div>
        </div>
  
        <!-- Referred By Section -->
        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-semibold text-gray-800 mb-4">Referred By</h3>
          <p class="text-gray-700">
            Kamu direferensikan oleh: 
            <span v-if="user.referrer">
              <strong>{{ user.referrer.referred_by.name }}</strong> dengan kode referral <strong>{{ user.referrer.referred_by.referral_code }}</strong>
            </span>
            <span v-else>
              <strong>Tidak ada</strong>
            </span>
          </p>
        </div>
  
        <!-- Referral Section -->
        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-semibold text-gray-800 mb-4">Teman yang menggunakan kode referral kamu</h3>
          <p class="text-gray-700 mb-4">
            Kamu telah mereferensikan <strong>{{ user.referrals ? user.referrals.length : 0 }}</strong> teman.
          </p>
          <ul class="list-disc pl-5">
            <li v-for="referral in user.referrals" :key="referral.id" class="text-gray-700 mb-1">
              {{ referral.user.name }} (Kode Referral: {{ referral.referral_code }})
            </li>
          </ul>
        </div>
  
        <div class="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 class="text-2xl font-semibold text-blue-800 mb-4">Ajak Teman dan Dapatkan Keuntungan!</h3>
          <p class="text-gray-700 mb-4">
            Bagikan kode referral kamu kepada teman-teman. Temanmu akan mendapatkan saldo bonus sebesar <strong>Rp10.000</strong> ketika mendaftar menggunakan kodemu. 
            Kamu juga akan mendapatkan saldo bonus sebesar <strong>Rp10.000</strong> setiap kali temanmu berhasil mendaftar dan verifikasi.
            Semakin banyak teman yang kamu ajak, semakin banyak keuntungan yang kamu dapatkan!
          </p>
          <div class="bg-yellow-100 text-yellow-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between">
            <div class="text-center sm:text-left">
              <span class="font-semibold">Kode Referral Kamu:</span>
              <span class="block font-mono mt-2">{{ user.referral_code }}</span>
            </div>
            <button @click="copyReferralCode" class="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-4 sm:mt-0 sm:ml-4">
              Salin Kode
            </button>
          </div>
        </div>
        <router-link to="/member/topup" class="mt-4 bg-green-700 rounded-full text-white px-4 py-2 shadow hover:bg-green-800 flex items-center justify-center">
          <Icon icon="mdi:cash" class="w-6 h-6 mr-2" />
          Top-Up Saldo
        </router-link>
      </div>
  
      <!-- Riwayat Pengisian Saldo -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Riwayat Pengisian Saldo</h2>
        <div v-if="topupHistory.length === 0" class="text-gray-600">Belum ada riwayat pengisian saldo.</div>
        <div v-else class="space-y-4">
          <div v-for="history in topupHistory" :key="history.id" class="bg-gray-100 p-4 rounded-lg shadow cursor-pointer" @click="goToTransactionDetail(history.id)">
            <div class="flex flex-col sm:flex-row justify-between items-center">
              <div class="mb-4 sm:mb-0 sm:mr-4">
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
import { Icon } from "@iconify/vue";

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
