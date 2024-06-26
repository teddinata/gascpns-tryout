<template>
  <MemberLayouts>
    <div class="container mx-auto py-8">

      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
        <div class="terminal-loader">
          <div class="terminal-header">
            <div class="terminal-title">Status</div>
            <div class="terminal-controls">
              <div class="control close"></div>
              <div class="control minimize"></div>
              <div class="control maximize"></div>
            </div>
          </div>
          <div class="text">Transaksi anda sedang diproses...</div>
        </div>        
      </div>

      <h1 class="text-3xl font-bold mb-6">Top-Up Saldo</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
          <label for="amount" class="block text-gray-700 font-bold mb-2">Jumlah Top-Up</label>
          <input v-model="formattedAmount" @input="formatAmount" type="text" id="amount" class="w-full p-2 border border-gray-300 rounded-md">
          <span class="text-gray-500 text-sm">Minimal topup Rp20.000</span>
        </div>
        <button @click="createTransaction" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Lanjutkan</button>
      </div>
      <div v-if="message" class="mt-4 p-4 rounded-md" :class="messageClass">{{ message }}</div>

      <div v-if="transactionId" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Pilih Metode Pembayaran</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="selectPaymentMethod('VA')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200" :disabled="confirmedPayment">Virtual Account</button>
          <button @click="selectPaymentMethod('EWALLET')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200" :disabled="confirmedPayment">E-Wallet</button>
          <button @click="selectPaymentMethod('QRIS')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200" :disabled="confirmedPayment">QRIS</button>
        </div>
      </div>

      <div v-if="paymentMethod === 'VA' && !confirmedPayment" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Pilih Bank</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button @click="showConfirmationModal('MANDIRI')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">Mandiri</button>
          <button @click="showConfirmationModal('BSI')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">BSI</button>
          <button @click="showConfirmationModal('BRI')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">BRI</button>
          <button @click="showConfirmationModal('BNI')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">BNI</button>
        </div>
      </div>

      <div v-if="paymentMethod === 'EWALLET' && !confirmedPayment" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Pilih E-Wallet</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="showConfirmationModal('DANA')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">DANA</button>
          <button @click="showConfirmationModal('OVO')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">OVO</button>
          <button @click="showConfirmationModal('LINKAJA')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">LinkAja</button>
          <button @click="showConfirmationModal('SHOPEEPAY')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">ShopeePay</button>
          <button @click="showConfirmationModal('ASTRAPAY')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">AstraPay</button>
        </div>
      </div>

      <div v-if="paymentMethod === 'QRIS' && !confirmedPayment" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Pilih QRIS</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="showConfirmationModal('QRIS')" class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200">QRIS</button>
        </div>
      </div>

      <div v-if="transactionDetail" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Detail Transaksi Top-Up</h2>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <p><strong>ID Transaksi:</strong> {{ transactionDetail.id }}</p>
          <p><strong>Jumlah:</strong> Rp{{ formatRupiah(transactionDetail.amount) }}</p>
          <p><strong>Metode Pembayaran:</strong> {{ transactionDetail.payment_method }}</p>
          <p v-if="transactionDetail.payment_channel === 'VA'"><strong>Nomor Pembayaran:</strong> {{ transactionDetail.payment_number }}</p>
          <p v-if="transactionDetail.payment_channel === 'VA'"><strong>Bank:</strong> {{ transactionDetail.bank_code }}</p>
          <p v-if="transactionDetail.payment_channel === 'EWALLET'"><strong>E-Wallet:</strong> {{ transactionDetail.payment_method }}</p>
          <p v-if="transactionDetail.payment_channel === 'EWALLET' && transactionDetail.payment_method === 'EWALLET-OVO'"><strong>Nomor OVO:</strong> {{ transactionDetail.mobile_number }}</p>
          <p v-if="transactionDetail.payment_channel === 'EWALLET' && transactionDetail.payment_method !== 'EWALLET-OVO' && transactionDetail.payment_method !== 'EWALLET-SHOPEEPAY'"><strong>Buka di HP:</strong> <a :href="transactionDetail.payment_number" target="_blank" class="text-blue-500">Klik di sini</a></p>
          
          <p v-if="transactionDetail.payment_url"><strong>Buka di Laptop:</strong> <a :href="transactionDetail.payment_url" target="_blank" class="text-blue-500">Klik di sini</a></p>
          <p><strong>Status Pembayaran:</strong> {{ transactionDetail.payment_status }}</p>
          <p><strong>Waktu Kadaluarsa:</strong> {{ formatDateTime(transactionDetail.payment_expired) }}</p>
          <div v-if="transactionDetail?.payment_method == 'QRIS' || transactionDetail?.payment_method == 'EWALLET-SHOPEEPAY'"
            class="mt-4 flex flex-col items-center">
            <qrcode-vue :value="transactionDetail?.payment_number" :size="200" />
            <p class="font-semibold mt-4">Scan QR Code untuk pembayaran</p>
          </div>
          <button 
            @click="checkPaymentStatus" 
            :class="{
              'bg-gray-400 hover:bg-gray-600 cursor-not-allowed mt-8': transactionDetail?.payment_status == 'EXPIRED' || transactionDetail?.payment_status == 'PAID' || transactionDetail?.payment_status == 'CANCELLED',
              'bg-blue-500 hover:bg-blue-700 mt-8': transactionDetail?.payment_status !== 'EXPIRED' && transactionDetail?.payment_status !== 'PAID' || transactionDetail?.payment_status !== 'CANCELLED'
            }"
            class="flex py-2 px-4 rounded-md text-white mr-2 items-center mt-8"
            :disabled="transactionDetail?.payment_status == 'EXPIRED' || transactionDetail?.payment_status == 'PAID' || transactionDetail?.payment_status == 'CANCELLED'">
            <!-- icon check -->
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Cek Pembayaranmu
          </button>
        </div>
      </div>

      <confirmation-modal v-if="showModal" @confirm="confirmPaymentMethod" @cancel="cancelPaymentMethod" />
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';
import { formatDateTime } from '@/filters';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import QrcodeVue from 'qrcode.vue';
import { set } from 'date-fns';
import { is } from 'date-fns/locale';

const amount = ref('');
const formattedAmount = ref('');
const transactionId = ref(null);
const paymentMethod = ref('');
const message = ref('');
const messageClass = ref('');
const transactionDetail = ref(null);
const confirmedPayment = ref(false);
const showModal = ref(false);
const selectedBankOrEwallet = ref('');
const store = useStore();
const router = useRouter();
const isLoading = ref(false);

const createTransaction = async () => {
  try {
    const response = await api.post('/v1/topup/create', { amount: parseInt(amount.value.toString().replace(/\./g, '')) });
    transactionId.value = response.data.data.id;
    message.value = 'Transaksi berhasil dibuat, silakan pilih metode pembayaran.';
    messageClass.value = 'bg-green-100 text-green-800';
  } catch (error) {
    console.error(error);
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat membuat transaksi.';
    messageClass.value = 'bg-red-100 text-red-800';
  }
};

const selectPaymentMethod = (method) => {
  paymentMethod.value = method;
};

const showConfirmationModal = (method) => {
  console.log(`Showing confirmation modal for method: ${method}`); // Debugging log
  selectedBankOrEwallet.value = method;
  showModal.value = true;
};

const confirmPaymentMethod = async () => {
  showModal.value = false;
  confirmedPayment.value = true;

  if (paymentMethod.value === 'VA') {
    proceedToVAPayment(selectedBankOrEwallet.value);
  } else if (paymentMethod.value === 'EWALLET') {
    proceedToEwalletPayment(selectedBankOrEwallet.value);
  } else if (paymentMethod.value === 'QRIS') {
    proceedToQRISPayment(selectedBankOrEwallet.value);
  }
};

const cancelPaymentMethod = () => {
  showModal.value = false;
};

const proceedToEwalletPayment = async (ewalletType) => {
  try {
    const requestData = {
      transaction_id: transactionId.value,
      payment_method: 'EWALLET',
      ewallet_type: ewalletType,
    };

    if (ewalletType === 'OVO') {
      const mobileNumber = prompt("Masukkan nomor OVO Anda (e.g., +628123123123):");
      requestData.mobile_number = mobileNumber;
    } else if (['DANA', 'LINKAJA', 'SHOPEEPAY', 'ASTRAPAY'].includes(ewalletType)) {
      requestData.success_redirect_url = 'https://app.gascpns.com/member/transaksi/success';
    }
    isLoading.value = true;
    const response = await api.post('/v1/topup/payment', requestData);
    transactionDetail.value = response.data.transaction;
    message.value = 'Metode pembayaran berhasil dipilih, silakan selesaikan pembayaran Anda.';
    messageClass.value = 'bg-green-100 text-green-800';
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat memilih metode pembayaran.';
    messageClass.value = 'bg-red-100 text-red-800';
    isLoading.value = false;
  }
};

const proceedToVAPayment = async (bank) => {
  try {
    const requestData = {
      transaction_id: transactionId.value,
      payment_method: 'VA',
      bank_code: bank,
    };

    isLoading.value = true; 
    const response = await api.post('/v1/topup/payment', requestData);
    transactionDetail.value = response.data.transaction;
    message.value = 'Metode pembayaran berhasil dipilih, silakan selesaikan pembayaran Anda.';
    messageClass.value = 'bg-green-100 text-green-800';
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat memilih metode pembayaran.';
    messageClass.value = 'bg-red-100 text-red-800';
    isLoading.value = false;
  }
};

// proceed QRIS payment
const proceedToQRISPayment = async (QRIS) => {
  try {
    const requestData = {
      transaction_id: transactionId.value,
      payment_method: QRIS,
    };

    isLoading.value = true;
    const response = await api.post('/v1/topup/payment', requestData);
    transactionDetail.value = response.data.transaction;
    message.value = 'Metode pembayaran berhasil dipilih, silakan selesaikan pembayaran Anda.';
    messageClass.value = 'bg-green-100 text-green-800';
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat memilih metode pembayaran.';
    messageClass.value = 'bg-red-100 text-red-800';
    isLoading.value = false;
  }
};

const checkPaymentStatus = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/v1/topup/check`,  { params: { transaction_id: transactionId.value } });
    transactionDetail.value.payment_status = response.data.status;
    message.value = response.data.message;
    messageClass.value = 'bg-yellow-100 text-yellow-800';
    isLoading.value = false;
    if (response.data.status === 'PAID') {
      message.value = 'Pembayaran berhasil, saldo Anda akan bertambah dalam beberapa saat.';
      messageClass.value = 'bg-green-100 text-green-800';
      setTimeout(() => {
        router.go();
      }, 3000);
    }
  } catch (error) {
    console.error(error);
    message.value = error.response?.data?.message || 'Terjadi kesalahan saat memeriksa status pembayaran.';
    messageClass.value = 'bg-red-100 text-red-800';
    isLoading.value = false;
  }
};

const formatAmount = () => {
  const unformattedAmount = formattedAmount.value.replace(/\D/g, '');
  amount.value = unformattedAmount ? parseInt(unformattedAmount) : '';
  formattedAmount.value = formatRupiah(amount.value.toString());
};

const formatRupiah = (amount) => {
  if (!amount) return '';
  const amountStr = amount.toString(); // Ubah amount menjadi string
  const formatted = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formatted;
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

@keyframes blinkCursor {
  50% {
    border-right-color: transparent;
  }
}

@keyframes typeAndDelete {
  0%,
  10% {
    width: 0;
  }
  45%,
  55% {
    width: 6.2em;
  } /* adjust width based on content */
  90%,
  100% {
    width: 0;
  }
}

.terminal-loader {
  border: 0.1em solid #333;
  background-color: #1a1a1a;
  color: #0f0;
  font-family: "Courier New", Courier, monospace;
  font-size: 1em;
  padding: 1.5em 1em;
  width: 12em;
  margin: 100px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.terminal-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5em;
  background-color: #333;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 0.4em;
  box-sizing: border-box;
}

.terminal-controls {
  float: right;
}

.control {
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.4em;
  border-radius: 50%;
  background-color: #777;
}

.control.close {
  background-color: #e33;
}

.control.minimize {
  background-color: #ee0;
}

.control.maximize {
  background-color: #0b0;
}

.terminal-title {
  float: left;
  line-height: 1.5em;
  color: #eee;
}

.text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 0.2em solid green; /* Cursor */
  animation: typeAndDelete 4s steps(11) infinite,
    blinkCursor 0.5s step-end infinite alternate;
  margin-top: 1.5em;
}

</style>
