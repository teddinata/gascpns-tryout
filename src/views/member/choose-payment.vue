<template>
  <MemberLayouts>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Pilih Metode Pembayaran</h1>
      <p class="text-gray-400">Kamu bisa memilih metode pembayaran sesuai dengan yang kamu mau.</p>
    </div>

    <h3 class="text-lg font-semibold">Virtual Account / Bank Transfer</h3>
    
    <!-- Metode Pembayaran -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <PaymentMethodCard
        v-for="method in paymentMethods"
        :key="method.name"
        :method="method"
        :selectedMethodId="selectedMethodId"
        @update:selectedMethodId="updateSelectedMethodId"
      />
    </div>

    <h3 class="text-lg font-semibold mt-10">E-Wallet / Dompet Digital</h3>

    <!-- Metode Pembayaran -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <PaymentMethodCard
        v-for="method in wallets"
        :key="method.name"
        :method="method"
        :selectedMethodId="selectedMethodId"
        @update:selectedMethodId="updateSelectedMethodId"
      />
    </div>

    <h3 class="text-lg font-semibold mt-10">QRIS</h3>

    <!-- Metode Pembayaran -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <PaymentMethodCard
        :method="qrisMethod"
        :selectedMethodId="selectedMethodId"
        @update:selectedMethodId="updateSelectedMethodId"
      />
    </div>

    <!-- Button -->
    <div class="mt-6">
      <button class="py-2 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600">Selanjutnya</button>
    </div>
  </div>
</MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import PaymentMethodCard from '@/components/member/dashboard/PaymentMethodCard.vue';
import { ref, onMounted, computed } from 'vue';
import api from '@/api/Api.js'; // Mengimpor instansi Axios
// image logo from src/assets/images/qris.png
import qrisLogo from '@/assets/qris.png';

const paymentMethods = ref([]);
const wallets = ref([]);
const selectedMethodId = ref(null);

const fetchBankPaymentMethods = async () => {
  try {
    const response = await api.get('/banks');
    if (response.data.success) {
      paymentMethods.value = response.data.data.map(bank => ({
        id: bank.id,
        name: bank.name,
        logo: bank.logo,
        adminFee: 'Rp3.500', // Default admin fee, adjust as needed
        note: '',
      }));
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
  }
};

const fetchWalletPaymentMethods = async () => {
  try {
    const response = await api.get('/ewallets');
    if (response.data.success) {
      wallets.value = response.data.data.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        logo: wallet.logo,
        adminFee: 'Rp3.500', // Default admin fee, adjust as needed
        note: '',
      }));
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
  }
};

const qrisMethod = ref({
  id: 999, // Static ID for QRIS
  name: 'QRIS',
  // get logo from src/assets/images/qris.png
  logo: qrisLogo,
  adminFee: 'Rp1.043',
  note: 'Scan QR code to pay'
});

const updateSelectedMethodId = (id) => {
  selectedMethodId.value = id;
};



onMounted(() => {
  fetchBankPaymentMethods();
  fetchWalletPaymentMethods();
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
