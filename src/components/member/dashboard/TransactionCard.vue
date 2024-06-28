<template>
  <div class="border p-4 rounded-lg mb-4 bg-white shadow-sm">
    <div class="flex flex-col sm:flex-row items-center mb-4">
      <img :src="transaction.package.cover_path" alt="Package Image" class="h-20 w-20 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4">
      <div class="flex-grow w-full">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-2">
          <div>
            <div class="mb-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold" v-if="transaction.payment_status === 'CANCELLED'">Transaksi Dibatalkan Pengguna</div>
            <div class="mb-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold" v-if="transaction.payment_status === 'EXPIRED'">Pembayaran Dibatalkan Sistem</div>
            <div class="mb-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold" v-if="transaction.payment_status === 'PAID'">Pembayaran Berhasil</div>
            <div class="mb-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold" v-if="transaction.payment_status === 'UNPAID'">Menunggu Pembayaran</div>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
            <div>{{ formatDateTime(transaction.created_at) }}</div>
            <span>|</span>
            <div>#{{ transaction.invoice_code }}</div>
          </div>
        </div>
        <div class="text-lg font-semibold mb-1">{{ transaction.package.name }}</div>
        <div class="text-gray-500 text-sm mb-4">Metode Pembayaran: <strong>{{ transaction.payment_method }}</strong></div>
      </div>
    </div>

    <div class="border-b border-gray-200 mb-4"></div>
    <div class="flex flex-col sm:flex-row justify-between items-center">
      <div class="hidden md:flex gap-2 mb-4 sm:mb-0">
        <button class="bg-primary text-white px-4 py-2 rounded-full shadow hover:bg-blue-700" @click.stop="buyPackageAgain">Beli Paket Lagi</button>
        <button class="bg-secondary text-white px-4 py-2 rounded-full shadow hover:bg-green-700" @click.stop="goToTransactionDetail(transaction.id)">Lihat Invoice</button>
      </div>
      <div class="w-full md:hidden mb-4 sm:mb-0">
        <button class="bg-primary w-full text-white px-4 py-2 rounded-full shadow hover:bg-blue-700" @click.stop="buyPackageAgain">Beli Paket Lagi</button>
      </div>
      <div class="w-full md:hidden mb-4 sm:mb-0">
        <button class="bg-secondary w-full text-white px-4 py-2 rounded-full shadow hover:bg-green-700" @click.stop="goToTransactionDetail(transaction.id)">Lihat Invoice</button>
      </div>
      <div class="text-lg font-semibold text-gray-900">{{ formatRupiah(transaction.total_amount) }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatRupiah } from "@/filters";
import { useRouter } from 'vue-router';
import { formatDateTime } from '@/filters';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToTransactionDetail = () => {
  if (props.transaction.payment_status === 'UNPAID') {
    router.push({ path: `/member/transaksi/${props.transaction.invoice_code}/payment` });
  } else {
    router.push({ name: 'detail-transaksi', params: { id: props.transaction.id } });
  }
};

const buyPackageAgain = () => {
  router.push({ name: 'detail', params: { slug: props.transaction.package.slug } });
};
</script>

<style scoped>
.bg-primary {
  background-color: #1d90ff;
}

.bg-primary:hover {
  background-color: #0056b3;
}

.bg-secondary {
  background-color: #4caf50;
}

.bg-secondary:hover {
  background-color: #388e3c;
}

.flex-grow {
  flex-grow: 1;
}
</style>
