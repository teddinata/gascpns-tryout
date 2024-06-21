<template>
  <MemberLayouts>
    <div class="container mx-auto py-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-4">Detail Transaksi Top-Up</h1>
        <div v-if="transaction">
          <p><strong>ID Transaksi:</strong> {{ transaction.id }}</p>
          <p><strong>Jumlah:</strong> {{ formatRupiah(transaction.amount) }}</p>
          <p><strong>Metode Pembayaran:</strong> {{ transaction.payment_method }}</p>
          <p v-if="transaction.payment_number"><strong>Nomor Pembayaran:</strong> {{ transaction.payment_number }}</p>
          <p v-if="transaction.payment_url"><strong>Link Pembayaran:</strong> <a :href="transaction.payment_url" target="_blank" class="text-blue-500">Klik di sini</a></p>
          <p><strong>Status Pembayaran:</strong> 
            <span v-if="transaction.payment_status === 'PAID'" class="px-2 py-1 bg-green-500 text-white rounded-md">Topup Sukses</span>
            <span v-else-if="transaction.payment_status === 'PENDING' ||  transaction.payment_status === 'UNPAID'" class="px-2 py-1 bg-yellow-500 text-white rounded-md">Menunggu Pembayaran</span>
            <span v-else class="px-2 py-1 bg-red-500 text-white rounded-md">Topup Gagal</span>
          </p>
          <p><strong>Waktu Kadaluarsa:</strong> {{ formatDateTime(transaction.payment_expired) }}</p>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';

const route = useRoute();
const transaction = ref(null);

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

onMounted(async () => {
  const transactionId = route.params.id;
  try {
    const response = await api.get(`/v1/topup/${transactionId}`);
    transaction.value = response.data.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
