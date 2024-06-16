<template>
  <MemberLayouts>
    <div class="max-w-7xl p-6">

      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
          <div class="wheel"></div>
          <div class="hamster">
            <div class="hamster__body">
              <div class="hamster__head">
                <div class="hamster__ear"></div>
                <div class="hamster__eye"></div>
                <div class="hamster__nose"></div>
              </div>
              <div class="hamster__limb hamster__limb--fr"></div>
              <div class="hamster__limb hamster__limb--fl"></div>
              <div class="hamster__limb hamster__limb--br"></div>
              <div class="hamster__limb hamster__limb--bl"></div>
              <div class="hamster__tail"></div>
            </div>
          </div>
          <div class="spoke"></div>
        </div>
      </div>

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold">Pilih Metode Pembayaran</h1>
        <p class="text-gray-400">Kamu bisa memilih metode pembayaran sesuai dengan yang kamu mau.</p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6">
        <div class="flex justify-between">
        <ul class="flex border-b">
          <li class="mr-1">
            <a
              @click="selectedTab = 'bank'"
              :class="['inline-block px-4 py-2', selectedTab === 'bank' ? 'bg-white border-l border-t border-r rounded-t text-blue-700 font-semibold' : 'bg-gray-200 text-gray-500']"
              href="#">Bank</a>
          </li>
          <li class="mr-1">
            <a
              @click="selectedTab = 'ewallet'"
              :class="['inline-block px-4 py-2', selectedTab === 'ewallet' ? 'bg-white border-l border-t border-r rounded-t text-blue-700 font-semibold' : 'bg-gray-200 text-gray-500']"
              href="#">E-Wallet</a>
          </li>
          <li class="mr-1">
            <a
              @click="selectedTab = 'qris'"
              :class="['inline-block px-4 py-2', selectedTab === 'qris' ? 'bg-white border-l border-t border-r rounded-t text-blue-700 font-semibold' : 'bg-gray-200 text-gray-500']"
              href="#">QRIS</a>
          </li>
          <li class="mr-1">
            <a
              @click="selectedTab = 'saldo'"
              :class="['inline-block px-4 py-2', selectedTab === 'saldo' ? 'bg-white border-l border-t border-r rounded-t text-blue-700 font-semibold' : 'bg-gray-200 text-gray-500']"
              href="#">Saldo</a>
          </li>
        </ul>
        
          <!-- Button -->
          <div>
            <button @click="openConfirmationModal" 
                    :disabled="!isPaymentMethodSelected"
                    :class="['flex items-center py-2 px-4 rounded-full text-white hover:bg-blue-600',
                             isPaymentMethodSelected ? 'bg-primary' : 'bg-slate-500 cursor-not-allowed']">
              <p class="mr-4">Lanjutkan Pembayaran</p>
              <Icon icon="fa-solid:arrow-right" class="text-xl"></Icon>
            </button>
          </div>          
        </div>
      </div>

      <!-- Tab Content -->
      <div v-if="selectedTab === 'bank'">
        <h3 class="text-lg font-semibold">Virtual Account / Bank Transfer</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <PaymentMethodCard
            v-for="method in paymentMethods"
            :key="method.id"
            :method="method"
            :selectedMethodId="selectedMethodId"
            @update:selectedMethodId="updateSelectedMethodId"
          />
        </div>
      </div>

      <div v-if="selectedTab === 'ewallet'">
        <h3 class="text-lg font-semibold">E-Wallet / Dompet Digital</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <PaymentMethodCard
            v-for="method in wallets"
            :key="method.id"
            :method="method"
            :selectedMethodId="selectedMethodId"
            @update:selectedMethodId="updateSelectedMethodId"
          />
        </div>
      </div>

      <div v-if="selectedTab === 'qris'">
        <h3 class="text-lg font-semibold">QRIS</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <PaymentMethodCard
            :method="qrisMethod"
            :selectedMethodId="selectedMethodId"
            @update:selectedMethodId="updateSelectedMethodId"
          />
        </div>
      </div>

      <div v-if="selectedTab === 'saldo'">
        <h3 class="text-lg font-semibold">Saldo</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            @click="updateSelectedMethodId('saldo')"
            :method="saldoMethod"
            :class="{ 'selected': selectedMethodId === 'saldo' }"
            class="payment-method-card relative cursor-pointer p-4 bg-white rounded-lg shadow-md flex flex-col">
            <div class="flex items-center mb-4">
              <Icon class="text-xl text-primary mr-1" icon="fa6-solid:wallet" />
              <h2 class="text-lg font-semibold">Saldo GASKoin Anda</h2>
            </div> 
            <p class="text-2xl font-bold">Rp {{ formatRupiah(user.wallet_balance) }}</p>
            <p class="text-gray-400">Saldo saat ini</p>
            <div v-if="selectedMethodId === 'saldo'" class="absolute top-2 right-2 text-primary">
              <Icon icon="fa-solid:check-circle" class="text-xl" />
            </div>
          </div>
        </div>
      </div>
      
    
      
    </div>

    <!-- Modal for confirmation -->
    <div v-if="showConfirmationModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h2 class="text-lg font-semibold mb-4">Konfirmasi Pembayaran</h2>
        <p class="mb-4">Apakah Anda yakin ingin melanjutkan pembayaran dengan metode <span class="font-bold">{{ selectedMethodName }}</span>?</p>

        <!-- if selected payment method use saldo -->
        <div v-if="selectedMethodId === 'saldo'" class="mt-4">
          <p class="text-gray-400">Saldo GASKoin Anda saat ini: <span class="font-bold">Rp {{ formatRupiah(user.wallet_balance) }}</span></p>
          <p class="text-gray-600">Pembayaranmu akan langsung diproses menggunakan saldo GASKoin. Pastikan saldo GASKoin Anda mencukupi untuk melakukan pembayaran.</p>
          <p class="text-gray-600">Kamu tidak dapat mengembalikan saldo GASKoin yang sudah digunakan untuk pembayaran.</p>
        </div>

        <div class="flex justify-end">
          <button @click="cancelPayment" class="px-4 py-2 bg-gray-400 text-white rounded-lg mr-4">Batal</button>
          <button @click="confirmPayment" class="px-4 py-2 bg-primary text-white rounded-lg">Ya, Lanjutkan</button>
        </div>

        
      </div>
    </div>

  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import PaymentMethodCard from '@/components/member/dashboard/PaymentMethodCard.vue';
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/Api.js';
import qrisLogo from '@/assets/qris.png';
import { useRoute, useRouter } from 'vue-router';
import { formatRupiah } from "@/filters";
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';


const route = useRoute();
const router = useRouter();
const store = useStore();
const toast = useToast();
const paymentMethods = ref([]);
const wallets = ref([]);
const selectedMethodId = ref(null);
const selectedTab = ref('bank'); // Default selected tab
const { transactionId } = route.params;
const showConfirmationModal = ref(false);
const isLoading = ref(false);

const user = store.getters['auth/user'];

const openConfirmationModal = () => {
  showConfirmationModal.value = true;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
};

const confirmPayment = () => {
  closeConfirmationModal();
  proceedToPayment();
};

const cancelPayment = () => {
  closeConfirmationModal();
};

const isPaymentMethodSelected = ref(false);

const updateSelectedMethodId = (id) => {
  selectedMethodId.value = id;
  isPaymentMethodSelected.value = true;
};

const resetSelectedMethodId = () => {
  selectedMethodId.value = null;
  isPaymentMethodSelected.value = false;
};

const fetchBankPaymentMethods = async () => {
  try {
    const response = await api.get('/banks');
    if (response.data.success) {
      paymentMethods.value = response.data.data.map(bank => ({
        id: `bank-${bank.id}`, // Add a prefix to make the ID unique
        name: bank.name,
        logo: bank.logo,
        code: bank.code,
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
        id: `ewallet-${wallet.id}`, // Add a prefix to make the ID unique
        name: wallet.name,
        logo: wallet.logo,
        code: wallet.code,
        adminFee: 'Rp3.500', // Default admin fee, adjust as needed
        note: '',
      }));
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
  }
};

const qrisMethod = ref({
  id: 'qris-999', // Static ID for QRIS with prefix
  name: 'QRIS',
  logo: qrisLogo,
  adminFee: 'Rp1.043',
  note: 'Scan QR code to pay'
});

const saldoMethod = ref({
  id: 'saldo-999', // Static ID for Saldo with prefix
  name: 'Saldo GASKoin Anda',
  logo: qrisLogo,
  adminFee: 'Rp0',
  note: 'Saldo saat ini'
});


const selectedMethodName = computed(() => {
  if (selectedMethodId.value) {
    if (selectedTab.value === 'bank') {
      const selectedMethod = paymentMethods.value.find(method => method.id === selectedMethodId.value);
      return selectedMethod ? selectedMethod.name : '';
    } else if (selectedTab.value === 'ewallet') {
      const selectedMethod = wallets.value.find(method => method.id === selectedMethodId.value);
      return selectedMethod ? selectedMethod.name : '';
    } else if (selectedTab.value === 'qris') {
      const selectedMethod = qrisMethod.value;
      return selectedMethod ? selectedMethod.name : '';
    } else if (selectedTab.value === 'saldo') {
      const selectedMethod = saldoMethod.value;
      return selectedMethod ? selectedMethod.name : '';
    }
  }
  return '';
});

const getSelectedMethod = () => {
  if (selectedMethodId.value) {
    if (selectedTab.value === 'bank') {
      return paymentMethods.value.find(method => method.id === selectedMethodId.value);
    } else if (selectedTab.value === 'ewallet') {
      return wallets.value.find(method => method.id === selectedMethodId.value);
    } else if (selectedTab.value === 'qris') {
      return qrisMethod.value;
    } else if (selectedTab.value === 'saldo') {
      return saldoMethod.value;
    }
  }
  return null;
};

const proceedToPayment = () => {
  const selectedMethod = getSelectedMethod();
  if (selectedMethod) {
    if (selectedMethod.id.startsWith('bank')) {
      proceedToBankPayment(selectedMethod);
    } else if (selectedMethod.id.startsWith('ewallet')) {
      proceedToEwalletPayment(selectedMethod);
    } else if (selectedMethod.id.startsWith('qris')) {
      proceedToQrisPayment(selectedMethod);
    } else if (selectedMethod.id.startsWith('saldo')) {
      proceedSaldoPayment(selectedMethod);
    } else {
      console.error('Unknown payment method:', selectedMethod);
    }
  } else {
    console.error('No payment method selected.');
  }
};

const proceedToBankPayment = async (method) => {
  try {
    isLoading.value = true;
    const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
    const requestData = {
      transaction_ids: transactionIds,
      payment_method: 'VA',
      bank_code: method.code,
    };
    const response = await api.post('/v1/tryout/transactions/va-payment', requestData);

    router.push({ name: 'Checkout' });
    isLoading.value = false;
  } catch (error) {
    toast.error('Pemilihan metode pembayaran gagal: ' + error.response.data.meta.message);
    console.error('Failed to process bank payment:', error);
    isLoading.value = false;
  }
};

const proceedToEwalletPayment = async (method) => {
  try {
    isLoading.value = true;
    const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
    const requestData = {
      transaction_ids: transactionIds,
      payment_method: 'EWALLET',
      ewallet_type: method.code,
    };

    if (method.code === 'OVO') {
      const mobileNumber = prompt("Please enter your OVO mobile number (e.g., +628123123123):");
      requestData.mobile_number = mobileNumber;
    } else if (['DANA', 'LINKAJA'].includes(method.code)) {
      requestData.success_redirect_url = 'https://staging.gascpns.com/member/transaksi/success';
      requestData.failure_redirect_url = 'https://staging.gascpns.com/member/notfound';
    }

    const response = await api.post('/v1/tryout/transactions/ewallet', requestData);

    router.push({ name: 'Checkout' });
    isLoading.value = false;

    // Simpan data transaksi ke Vuex setelah transaksi berhasil
    // store.dispatch('auth/saveTransactionData', response.data.data);
    // Handle response for e-wallet payment
  } catch (error) {
    toast.error('Pemilihan metode pembayaran gagal: ' + error.response.data.meta.message);
    console.error('Failed to process e-wallet payment:', error);
  }
};

const proceedToQrisPayment = async (method) => {
  try {
    isLoading.value = true;
    const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
    const requestData = {
      transaction_ids: transactionIds,
      payment_method: 'QRIS',
    };
    const response = await api.post('/v1/tryout/transactions/qris', requestData);

    router.push({ name: 'Checkout' });

    isLoading.value = false;

    // Simpan data transaksi ke Vuex setelah transaksi berhasil
    // store.dispatch('auth/saveTransactionData', response.data.data);
  } catch (error) {
    toast.error('Pemilihan metode pembayaran gagal: ' + error.response.data.meta.message);
    console.error('Failed to process QRIS payment:', error);
  }
};

const proceedSaldoPayment = async (method) => {
  try {
    isLoading.value = true;
    const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
    const requestData = {
      transaction_ids: transactionIds,
      payment_method: 'WALLET',
    };
    const response = await api.post('/v1/tryout/transactions/saldo', requestData);

    if (response.data.meta.code === 200) {
      toast.success('Pembayaran berhasil! Silahkan cek halaman Tryout Anda untuk melakukan pengerjaan soal.');
      router.push({ name: 'Dashboard Member' });
      isLoading.value = false;
    } else {
      toast.error('Pembayaran gagal! Silahkan coba lagi atau hubungi customer service kami.');
    }


    // Handle response for QRIS payment

    // Simpan data transaksi ke Vuex setelah transaksi berhasil
    // store.dispatch('auth/saveTransactionData', response.data.data);
  } catch (error) {
    toast.error('Pembayaran gagal: ' + error.response.data.meta.message);
    console.error('Failed to process QRIS payment:', error);
  }
};


onMounted(() => {
  fetchBankPaymentMethods();
  fetchWalletPaymentMethods();
});

</script>

<style scoped>
.payment-method-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.payment-method-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.payment-method-card.selected {
  border: 2px solid #3b82f6; /* Tailwind blue-500 */
}

.wheel-and-hamster {
  --dur: 1s;
  position: relative;
  width: 12em;
  height: 12em;
  font-size: 14px;
}

.wheel,
.hamster,
.hamster div,
.spoke {
  position: absolute;
}

.wheel,
.spoke {
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wheel {
  background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
  z-index: 2;
}

.hamster {
  animation: hamster var(--dur) ease-in-out infinite;
  top: 50%;
  left: calc(50% - 3.5em);
  width: 7em;
  height: 3.75em;
  transform: rotate(4deg) translate(-0.8em,1.85em);
  transform-origin: 50% 0;
  z-index: 1;
}

.hamster__head {
  animation: hamsterHead var(--dur) ease-in-out infinite;
  background: hsl(30,90%,55%);
  border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
  box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
		0.75em -1.55em 0 hsl(30,90%,90%) inset;
  top: 0;
  left: -2em;
  width: 2.75em;
  height: 2.5em;
  transform-origin: 100% 50%;
}

.hamster__ear {
  animation: hamsterEar var(--dur) ease-in-out infinite;
  background: hsl(0,90%,85%);
  border-radius: 50%;
  box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
  top: -0.25em;
  right: -0.25em;
  width: 0.75em;
  height: 0.75em;
  transform-origin: 50% 75%;
}

.hamster__eye {
  animation: hamsterEye var(--dur) linear infinite;
  background-color: hsl(0,0%,0%);
  border-radius: 50%;
  top: 0.375em;
  left: 1.25em;
  width: 0.5em;
  height: 0.5em;
}

.hamster__nose {
  background: hsl(0,90%,75%);
  border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
  top: 0.75em;
  left: 0;
  width: 0.2em;
  height: 0.25em;
}

.hamster__body {
  animation: hamsterBody var(--dur) ease-in-out infinite;
  background: hsl(30,90%,90%);
  border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
  box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
		0.15em -0.5em 0 hsl(30,90%,80%) inset;
  top: 0.25em;
  left: 2em;
  width: 4.5em;
  height: 3em;
  transform-origin: 17% 50%;
  transform-style: preserve-3d;
}

.hamster__limb--fr,
.hamster__limb--fl {
  clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
  top: 2em;
  left: 0.5em;
  width: 1em;
  height: 1.5em;
  transform-origin: 50% 0;
}

.hamster__limb--fr {
  animation: hamsterFRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
  transform: rotate(15deg) translateZ(-1px);
}

.hamster__limb--fl {
  animation: hamsterFLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
  transform: rotate(15deg);
}

.hamster__limb--br,
.hamster__limb--bl {
  border-radius: 0.75em 0.75em 0 0;
  clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
  top: 1em;
  left: 2.8em;
  width: 1.5em;
  height: 2.5em;
  transform-origin: 50% 30%;
}

.hamster__limb--br {
  animation: hamsterBRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
  transform: rotate(-25deg) translateZ(-1px);
}

.hamster__limb--bl {
  animation: hamsterBLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
  transform: rotate(-25deg);
}

.hamster__tail {
  animation: hamsterTail var(--dur) linear infinite;
  background: hsl(0,90%,85%);
  border-radius: 0.25em 50% 50% 0.25em;
  box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
  top: 1.5em;
  right: -0.5em;
  width: 1em;
  height: 0.5em;
  transform: rotate(30deg) translateZ(-1px);
  transform-origin: 0.25em 0.25em;
}

.spoke {
  animation: spoke var(--dur) linear infinite;
  background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
		linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
}

/* Animations */
@keyframes hamster {
  from, to {
    transform: rotate(4deg) translate(-0.8em,1.85em);
  }

  50% {
    transform: rotate(0) translate(-0.8em,1.85em);
  }
}

@keyframes hamsterHead {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(8deg);
  }
}

@keyframes hamsterEye {
  from, 90%, to {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0);
  }
}

@keyframes hamsterEar {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(12deg);
  }
}

@keyframes hamsterBody {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-2deg);
  }
}

@keyframes hamsterFRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(50deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-30deg) translateZ(-1px);
  }
}

@keyframes hamsterFLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-30deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(50deg);
  }
}

@keyframes hamsterBRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-60deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(20deg) translateZ(-1px);
  }
}

@keyframes hamsterBLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(20deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-60deg);
  }
}

@keyframes hamsterTail {
  from, 25%, 50%, 75%, to {
    transform: rotate(30deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(10deg) translateZ(-1px);
  }
}

@keyframes spoke {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-1turn);
  }
}

</style>