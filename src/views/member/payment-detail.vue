<template>
  <MemberLayouts>
    <div class="w-full mx-auto p-6">
      <!-- Pesan Keberhasilan -->
      <div class="bg-green-100 text-green-800 p-4 rounded mb-6">
        <p class="font-semibold">Berhasil!</p>
        <p>Transaksi berhasil dibuat, mohon untuk melakukan pembayaran sebelum batas waktu berakhir.</p>
      </div>

      <!-- Detail Transaksi -->
      <div class="bg-white p-6 rounded-lg shadow-2xl">
        <div class="flex items-center mb-6">
          <img 
            v-if="transactionData[0]?.package?.cover_path"
            :src="transactionData[0]?.package?.cover_path"
            alt="Paket SKD CPNS Premium" class="w-40 h-40 object-contain mr-4" />
          <div>
            <h2 class="text-xl font-semibold">{{ transactionData[0]?.package?.name }}</h2>
            <p class="text-lg font-bold">Total Pembayaran</p>
            <p class="text-2xl font-bold text-green-600">Rp{{ formatRupiah(totalPayment) }}</p>
          </div>
        </div>

        <!-- Informasi Transaksi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-gray-600">Order ID</p>
            <p class="font-semibold">#{{ transactionData[0]?.invoice_code }}</p>
          </div>
          <div>
            <p class="text-gray-600">Status Pembayaran</p>
            <p 
              v-if="transactionData[0]?.payment_status == 'PENDING' || transactionData[0]?.payment_status == 'UNPAID'"
              class="font-semibold text-red-500">Menunggu Pembayaran
            </p>
            <p 
              v-else-if="transactionData[0]?.payment_status == 'PAID'"
              class="font-semibold text-green-500">Pembayaran Berhasil
            </p>
            <p 
              v-else-if="transactionData[0]?.payment_status == 'EXPIRED'"
              class="font-semibold text-red-500">Pembayaran Kadaluarsa    
            </p>
            <p 
              v-else-if="transactionData[0]?.payment_status == 'CANCELLED'"
              class="font-semibold text-red-500">Pembayaran dibatalkan oleh pengguna
            </p>
          </div>
          <div>
            <p class="text-gray-600">Metode Pembayaran</p>
            <div class="flex items-center -mt-2">
              <img 
                v-if="transactionData[0]?.payment_method === 'QRIS'"
                src="../../../src/assets/qris.png"
                alt="Logo Pembayaran" class="w-16 h-16 object-contain mr-2" />
              <img 
                v-else
                :src="transactionData[0]?.payment_image" 
                alt="Logo Pembayaran" class="w-16 h-16 object-contain mr-2" />
              <span v-if="transactionData[0]?.payment_channel === 'Virtual Account'"> Virtual Account {{ transactionData[0]?.payment_method }}</span>
              <span v-else>{{ transactionData[0]?.payment_method }}</span>
            </div>
          </div>
          <div>
            <p class="text-gray-600">Nomor Pembayaran</p>
            <p
              v-if="transactionData[0]?.payment_channel == 'Virtual Account'" 
              class="font-semibold flex items-center mt-2">
              {{ transactionData[0]?.payment_number }}
              <button 
                @click="copyToClipboard(transactionData[0]?.payment_number)"
                class="ml-2 text-blue-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6z"></path>
                </svg>
              </button>
            </p>

            <!-- button if payment channel is EWALLET -->
            <p
              v-else-if="transactionData[0]?.payment_channel == 'ID_DANA' || transactionData[0]?.payment_channel == 'ID_LINKAJA'"
              class="font-semibold flex flex-col items-start">
              <a 
                v-if="transactionData[0]?.payment_channel == 'ID_DANA' || transactionData[0]?.payment_channel == 'ID_LINKAJA'"
                :href="transactionData[0]?.payment_number"
                target="_blank"
                class="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md">
                Buka Aplikasi di HP
              </a>
              <!-- text information -->
              <span class="mt-2">
                Salin link di atas dan buka di browser untuk melanjutkan pembayaran
              </span>
            </p>

             <!-- QR code if payment channel is QRIS -->
            <div v-else-if="transactionData[0]?.payment_channel == 'QRIS'" class="mt-4 flex flex-col items-center">
              <qrcode-vue :value="transactionData[0]?.payment_number" :size="200" />
              <p class="font-semibold mt-4">Scan QR Code untuk pembayaran</p>
            </div>
          </div>
          <div>
            <div v-if="transactionData[0]?.payment_status === 'PAID'">
              <p class="text-gray-600">Dibayarkan pada</p>
              <p class="font-semibold text-green-500">{{ formatDateTime(transactionData[0]?.payment_date) }}</p>
            </div>
            <div v-else>
              <p class="text-gray-600">Batas Pembayaran</p>
              <p class="font-semibold text-red-500">{{ paymentDeadline }}</p>
            </div>
          </div>
          <div>
            <p class="text-gray-600">Kode Promo</p>
            <p class="font-semibold">{{ transactionData[0]?.voucher_code ?? '-' }}</p>
          </div>
        </div>

        <!-- Detail Pembayaran -->
        <div class="grid grid-cols-1 gap-4 mb-6">
          <div class="p-4 rounded-lg shadow-2xl bg-white">
            <div class="flex justify-between">
              <h4 class="text-lg font-semibold mb-2">{{ transactionData[0]?.package?.name }}</h4>
              <div class="flex items-center">
                <span v-if="transactionData[0]?.package?.discount" class="text-red-400 font-semibold">Rp {{ formatRupiah(transactionData[0]?.package?.discount) }}</span>
                <span v-if="transactionData[0]?.package?.discount" class="text-gray-400 line-through ml-2">Rp {{ formatRupiah(transactionData[0]?.package?.price) }}</span>
                <span v-if="transactionData[0]?.package?.discount" class="text-green-500 ml-2 font-semibold">-{{ Math.round(((transactionData[0]?.package?.price - transactionData[0]?.package?.discount) / transactionData[0]?.package?.price) * 100) }}%</span>
                <span v-else class="text-red-400">Rp {{ formatRupiah(transactionData[0]?.package?.price) }}</span>
              </div>
            </div>
            <div class="flex justify-between">
              <span>Diskon Promo/Referral</span>
              <span>-Rp0</span>
            </div>
            <div class="flex justify-between">
              <span>Biaya Admin</span>
              <span>Rp0</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span>Total Pembayaran</span>
              <span>Rp{{ formatRupiah(totalPayment) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Jumlah</span>
              <span>x{{ totalQuantity }}</span>
            </div>
          </div>
        </div>

        <!-- Accordion Tata Cara Pembayaran -->
        <div v-if="transactionData[0]?.payment_channel === 'Virtual Account'" class="accordion mt-4 mb-4">
          <h2 class="text-xl font-bold mb-4">Instruksi Pembayaran</h2>
          <div v-if="loading" class="text-center">Loading...</div>
          <div v-if="error" class="text-red-500">{{ error }}</div>
          <div v-for="(methods, methodName) in paymentInstructions" :key="methodName" class="mb-4">
            <button 
              @click="toggleAccordion(methodName)" 
              class="w-full flex justify-between items-center p-4 bg-blue-500 text-white font-semibold rounded-md">
              {{ methodName }}
              <span v-if="isAccordionOpen(methodName)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <span v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 10.293a1 1 0 011.414 0L10 13.586l3.293-3.293a1 1 111.414 1.414L10 16.414l-4.707-4.707a1 1 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </button>
            <div v-if="isAccordionOpen(methodName)" class="p-4 bg-gray-100 rounded-md mt-2">
              <div v-for="instruction in methods" :key="instruction.id" class="mb-4">
                <h3 class="text-lg font-semibold">{{ instruction.title }}</h3>
                <p class="whitespace-pre-line">{{ instruction.instructions }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Pembatalan -->
        <div class="flex justify-between mt-4">

        <button 
          @click="showCancelModal = true" 
          :class="{
            'bg-gray-400 hover:bg-gray-600 cursor-not-allowed': transactionData[0]?.payment_status == 'EXPIRED' || transactionData[0]?.payment_status == 'PAID' || transactionData[0]?.payment_status == 'CANCELLED',
            'bg-red-500 hover:bg-red-700': transactionData[0]?.payment_status !== 'EXPIRED' && transactionData[0]?.payment_status !== 'PAID' || transactionData[0]?.payment_status !== 'CANCELLED'
          }"
          class="flex items-center py-2 px-4 rounded-md text-white"
          :disabled="transactionData[0]?.payment_status == 'EXPIRED' || transactionData[0]?.payment_status == 'PAID' || transactionData[0]?.payment_status == 'CANCELLED'">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Batalkan Pembelian
        </button>
    
        <button 
          @click="fetchTransaction" 
          :class="{
            'bg-gray-400 hover:bg-gray-600 cursor-not-allowed': transactionData[0]?.payment_status == 'EXPIRED' || transactionData[0]?.payment_status == 'PAID' || transactionData[0]?.payment_status == 'CANCELLED',
            'bg-blue-500 hover:bg-blue-700': transactionData[0]?.payment_status !== 'EXPIRED' && transactionData[0]?.payment_status !== 'PAID' || transactionData[0]?.payment_status !== 'CANCELLED'
          }"
          class="flex py-2 px-4 rounded-md text-white mr-2 items-center"
          :disabled="transactionData[0]?.payment_status == 'EXPIRED' || transactionData[0]?.payment_status == 'PAID' || transactionData[0]?.payment_status == 'CANCELLED'">
          <!-- icon check -->
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Cek Pembayaranmu
        </button>
    
        </div>
      </div>
    </div>
    <!-- Modal Konfirmasi -->
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Konfirmasi Pembatalan</h3>
        <p class="text-gray-600 mb-6">Apakah Kamu yakin ingin membatalkan pembelian ini?</p>
        <br />
        <p class="text-gray-600 mb-6">Setelah pembelian dibatalkan, kamu tidak bisa melanjutkan pembayaran.</p>
        <div class="flex justify-end space-x-4">
          <button @click="showCancelModal = false" class="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400">Tidak</button>
          <button @click="confirmCancel" class="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600">Ya, Batalkan</button>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/api/Api.js';
import { formatRupiah, formatDateTime } from '@/filters';
import QrcodeVue from 'qrcode.vue';
import { useToast } from 'vue-toastification';

import MemberLayouts from "@/components/MemberLayouts.vue";

const router = useRouter();
const transactionData = ref([]);
const paymentInstructions = ref({});
const openAccordions = ref([]);
const loading = ref(true);
const error = ref(null);
const showCancelModal = ref(false);
const toast = useToast();

const paymentDeadline = ref('');

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor pembayaran berhasil disalin!');
  }, (err) => {
    alert('Gagal menyalin nomor pembayaran!');
  });
};

const fetchTransaction = async () => {
  const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
  const promises = transactionIds.map(id => api.get(`/v1/tryout/transactions/${id}`));
  try {
    const responses = await Promise.all(promises);
    transactionData.value = responses.map(response => response.data.data);
    startCountdown(transactionData.value[0].payment_expired);

    if (transactionData.value[0].payment_status === 'PAID') {
      router.push({ name: 'payment-success' });
    }
  } catch (error) {
    console.error(error);
  }
};

const startCountdown = (paymentExpired) => {
  const countdown = () => {
    const now = new Date().getTime();
    const distance = new Date(paymentExpired).getTime() - now;

    if (distance < 0) {
      paymentDeadline.value = '00 : 00 : 00';
      clearInterval(interval);
    } else {
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      paymentDeadline.value = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    }
  };

  const interval = setInterval(countdown, 1000);
  countdown(); // Run it initially
};

const confirmCancel = async () => {
  try {
    const response = await api.post(`/v1/tryout/transactions/${transactionData.value[0].id}/cancel`);
    if (response.data.meta.status === 'success') {
      toast.success('Transaksi berhasil dibatalkan');
      transactionData.value.forEach(trx => trx.payment_status = 'CANCELLED');
      window.location.reload();
    } else {
      toast.error('Gagal membatalkan transaksi');
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat membatalkan transaksi');
  } finally {
    showCancelModal.value = false;
  }
};

const openApp = (paymentNumber) => {
  // Open app with payment number
  console.log('Open app with payment number:', paymentNumber);
};

const fetchPaymentInstructions = async () => {
  const bankCode = transactionData.value[0]?.payment_method;
  loading.value = true;
  try {
    const response = await api.get(`/payment-instructions/${bankCode}`);
    paymentInstructions.value = response.data.data;
  } catch (err) {
    error.value = 'Failed to load payment instructions.';
  } finally {
    loading.value = false;
  }
};

const toggleAccordion = (methodName) => {
  if (openAccordions.value.includes(methodName)) {
    openAccordions.value = openAccordions.value.filter(name => name !== methodName);
  } else {
    openAccordions.value.push(methodName);
  }
};

const isAccordionOpen = (methodName) => {
  return openAccordions.value.includes(methodName);
};

const totalQuantity = computed(() => transactionData.value.length);
const totalPayment = computed(() => transactionData.value.reduce((acc, trx) => acc + trx.total_amount, 0));

async function fetchData() { 
  loading.value = true;

  try {
    await fetchTransaction(); 
    fetchPaymentInstructions();
  } catch (error) {
    console.error(error);
    error.value = "Failed to load transaction data or payment instructions." 
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.mt-2 {
  margin-top: 0.5rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-gray-600 {
  color: #4b5563;
}
.font-semibold {
  font-weight: 600;
}
.rounded-md {
  border-radius: 0.375rem;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: #ffffff;
}
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}
.p-2 {
  padding: 0.5rem;
}
.rounded {
  border-radius: 0.25rem;
}
.mt-4 {
  margin-top: 1rem;
}

/* Accordion */
.accordion {
  margin-top: 1rem;
}
.accordion-item {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}
.accordion-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.accordion-button {
  background-color: #f9fafb;
  border: none;
  padding: 1rem;
  width: 100%;
  text-align: left;
}
.accordion-button:focus {
  outline: none;
}
.accordion-collapse {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
.accordion-body {
  white-space: pre-wrap;
}

.fixed {
  z-index: 1050;
}

.modal-content {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background-color: #f8f8f8;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e5e5e5;
  background-color: #f8f8f8;
}
</style>
