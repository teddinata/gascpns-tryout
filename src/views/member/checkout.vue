<template>
  <MemberLayouts>
    <div class="w-full mx-auto p-6" v-if="transactionData.length > 0">
      <!-- Metode Pembayaran -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold">Checkout</h1>
      </div>
      <div class="p-4 rounded-lg shadow-2xl items-center bg-white mb-6">
        <div class="flex items-center gap-4 justify-between">
          <h1 class="text-xl font-bold">Metode Pembayaran</h1>
          <div @click="changePaymentMethod" class="flex items-center gap-2 cursor-pointer">
            <button class="text-blue-500 text-end justify-end hover:text-blue-600">
              Ganti Metode Pembayaran
            </button>
            <Icon icon="fa-solid:chevron-right" class="text-sm text-blue-500" />
          </div>  
        </div>
        <div class="flex items-center">
          <img 
            :src="transactionData[0].payment_method === 'QRIS' ? ('../../../../src/assets/qris.png') : transactionData[0].payment_image" 
            alt="Metode Pembayaran"
            class="w-20 h-20 object-contain" />
          <h2 class="text-lg ml-4 mt-3 font-semibold items-center">
            <span v-if="transactionData[0].payment_channel === 'Virtual Account'"> Virtual Account {{ transactionData[0].payment_method }}</span>
            <span v-else>{{ transactionData[0].payment_method }}</span>
          </h2>
        </div>
      </div>
  
      <!-- Kode Promo -->
      <div class="p-4 rounded-lg shadow-2xl items-center bg-white">
        <div class="flex items-center gap-4 justify-between">
          <h3 class="text-lg font-semibold">Kode Promo / Voucher yang digunakan</h3>
          <!-- <button @click="applyPromoCode" class="text-blue-500">Lihat Voucher Saya</button> -->
        </div>
        <div class="mt-4 flex flex-col card p-4 rounded-lg shadow-2xl bg-white">
          <input v-model="transactionData[0].voucher_code"
            type="text" disabled class="p-2 border rounded w-full font-extrabold text-lg"
            placeholder="Tidak menggunakan kode promo" />
          <p v-if="promoApplied" class="text-green-500 mt-2">Kode voucher berhasil digunakan!</p>
        </div>
      </div>
  
      <!-- Checkout Pembelian -->
      <div class="mt-10">
        <h3 class="text-lg font-semibold">Checkout Pembelian</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Informasi Paket -->
          <div class="p-4 rounded-lg shadow-2xl bg-white">
            <div class="flex flex-col md:flex-row items-center mb-6 shadow-2xl bg-white p-4">
              <img 
                v-if="transactionData[0].package.cover_path" 
                :src="transactionData[0].package.cover_path" 
                alt="Paket CPNS Premium" 
                class="w-full md:w-40 rounded mb-4 md:mb-0 md:mr-4" 
                style="object-fit: cover; object-position: center; border-radius: 10px; border: 1px solid #000000;" 
              />
              <div class="flex flex-col text-center md:text-left">
                <h4 class="text-lg font-semibold mb-2">{{ transactionData[0].package.name }}</h4>
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start">
                  <p v-if="transactionData[0].package.discount" class="text-red-400 font-semibold">
                    Rp {{ formatRupiah(transactionData[0].package.discount) }}
                  </p>
                  <p v-if="transactionData[0].package.discount" class="text-gray-400 line-through md:ml-2 mt-2 md:mt-0">
                    Rp {{ formatRupiah(transactionData[0].package.price) }}
                  </p>
                  <span v-else class="text-red-400 mt-2 md:mt-0">Rp {{ formatRupiah(transactionData[0].package.price) }}</span>
                </div>
                <span class="text-black mt-2">Jumlah:
                  <span class="text-black font-semibold">x{{ totalQuantity }}</span>
                </span>
              </div>
            </div>
          </div>          

         <!-- Rincian Pembayaran -->
        <div class="p-4 rounded-lg shadow-2xl bg-white">
          <h4 class="text-lg font-semibold mb-2">Rincian Pembayaran</h4>
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <div class="flex items-center">
              <span class="text-gray-700">Rp {{ formatRupiah(subtotal) }}</span>
            </div>
          </div>
          <div class="flex justify-between mb-2">
            <span>Diskon Kode Promo</span>
            <!-- if discount amount not null then show data discount -->
            <span v-if="discountAmount !== 0" class="text-red-400">- Rp{{ formatRupiah(discountAmount) }}</span>
            <!-- if discount amount null then show data discount -->
            <span v-else class="text-red-400">- Rp{{ formatRupiah(discount) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span>Pajak</span>
            <span>Rp{{ formatRupiah(totalTax) }}</span>
          </div>
          <div class="flex justify-between font-semibold">
            <span>Total Pembayaran</span>
            <span>Rp{{ formatRupiah(totalPayment) }}</span>
          </div>
          <button 
            @click="proceedToPaymentModal" 
            class="mt-4 w-full py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600">
            Lanjut Pembayaran
          </button>
        </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>

    <!-- modal konfirmasi ganti pembayaran -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" v-if="showChangePaymentMethodModal">
      <div class="bg-white p-6 rounded-lg shadow-2xl">
        <h1 class="text-xl font-bold mb-4">Ganti Metode Pembayaran</h1>
        <p class="text-gray-500 mb-4">Apakah kamu yakin ingin mengganti metode pembayaran?</p>
        <div class="flex justify-end gap-4">
          <button @click="showChangePaymentMethodModal = false" class="text-blue-500">Batal</button>
          <button 
            @click="confirmChangePaymentMethod"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Yakin</button>
        </div>
      </div>
    </div>

    <!-- modal konfirmasi lanjutkan pembayaran -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" v-if="showProceedToPaymentModal">
      <div class="bg-white p-6 rounded-lg shadow-2xl">
        <h1 class="text-xl font-bold mb-4">Lanjutkan Pembayaran</h1>
        <p class="text-gray-500 mb-2">Apakah kamu sudah yakin ingin melanjutkan pembayaran?</p>
        <p class="text-gray-500 mb-4">Kamu tidak bisa mengubah metode pembayaran setelah melanjutkan pembayaran.</p>
        <p class="text-gray-500">Total pembayaran: <strong> Rp{{ formatRupiah(totalPayment) }}</strong></p>
        <p class="text-gray-500 mb-2">Metode pembayaran: <strong>{{ transactionData[0].payment_method }}</strong></p>
        <div class="flex justify-end gap-4">
          <button @click="showProceedToPaymentModal = false" class="text-blue-500">Batal</button>
          <button 
            @click="confirmProceedToPayment"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Yakin</button>
        </div>
      </div>
    </div>

  </MemberLayouts>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MemberLayouts from "@/components/MemberLayouts.vue";
import RameanCard from "@/components/member/dashboard/RameanCard.vue";
import PackageCard from "@/components/member/dashboard/PackageCard.vue";
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import { mapGetters } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/api/Api.js';
import { formatRupiah } from '@/filters';


const store = useStore();
const router = useRouter();
const transactionData = ref({});

const showChangePaymentMethodModal = ref(false);
const showProceedToPaymentModal = ref(false);

const changePaymentMethod = () => {
  showChangePaymentMethodModal.value = true;
};

const confirmChangePaymentMethod = () => {
  router.push({ name: 'PaymentMethod' })
  showChangePaymentMethodModal.value = false;
};

const proceedToPaymentModal = () => {
  showProceedToPaymentModal.value = true;
};

const confirmProceedToPayment = () => { 
  router.push({ name: 'Payment', params: { invoiceId: transactionData.value[0].invoice_id } });
  showProceedToPaymentModal.value = false;
};

const fetchTransaction = async () => {
  // Fetch transaction data from API
  // use endpoint api/v1/tryout/transactions/:id
  // const transactionId = localStorage.getItem('transactionId');
  
  // try {
  //   const response = await api.get(`/v1/tryout/transactions/${transactionId}`);
  //   transactionData.value = response.data.data;
  //   // console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }
  const transactionIds = JSON.parse(localStorage.getItem('transactionIds'));
  const promises = transactionIds.map(id => api.get(`/v1/tryout/transactions/${id}`));
  try {
    const responses = await Promise.all(promises);
    transactionData.value = responses.map(response => response.data.data);
  } catch (error) {
    console.error(error);
  }
};

// Hitung total quantity, subtotal, pajak, dan total pembayaran
const totalQuantity = computed(() => transactionData.value.length);
// const subtotal = computed(() => transactionData.value.reduce((acc, trx) => acc + trx.total_amount, 0));
const subtotal = computed(() => {
  return transactionData.value.reduce((acc, trx) => {
    const price = trx.discount_price !== null ? trx.discount_price : trx.original_price;
    return acc + price;
  }, 0);
});
const totalTax = computed(() => {
  return transactionData.value.reduce((acc, trx) => acc + trx.tax, 0);
});
// count disccount_amount
const discountAmount = computed(() => {
  return transactionData.value.reduce((acc, trx) => acc + trx.discount_amount, 0);
});
const totalPayment = computed(() => {
  return subtotal.value + totalTax.value - discountAmount.value;
});

// Menggunakan mapGetters untuk mengambil data selected payment method dari store
const selectedPaymentMethod = computed(() => store.getters.getSelectedPaymentMethod);
// console.log(selectedPaymentMethod);

const selectedProduct = ref({
  name: 'CPNS Premium',
  price: 149000
});

const rameanItems = ref([
  { id: 1, name: 'Ramean untuk 2 orang', originalPrice: 392000, discountPrice: 292000 },
  { id: 2, name: 'Ramean untuk 3 orang', originalPrice: 579000, discountPrice: 432000 },
  { id: 3, name: 'Ramean untuk 4 orang', originalPrice: 784000, discountPrice: 568000 },
]);

const additionalPackage = ref({
  id: 4,
  name: 'Bimbel SKD CPNS #28',
  originalPrice: 249000,
  discountPrice: 224000,
  imageUrl: 'https://example.com/bimbel-skd.jpg'
});

const promoCode = ref('');
const promoApplied = ref(false);

// const subtotal = computed(() => {
//   return selectedProduct.value.price;
// });

const discount = computed(() => {
  return promoApplied.value ? 15000 : 0; // Contoh diskon Rp 15.000
});

const adminFee = ref(938);

// const totalPayment = computed(() => {
//   return subtotal.value - discount.value + adminFee.value;
// });


const selectRameanItem = (item) => {
  console.log('Ramean item selected:', item);
};

const selectAdditionalPackage = (pkg) => {
  console.log('Additional package selected:', pkg);
};

const applyPromoCode = () => {
  promoApplied.value = true;
};

const proceedToPayment = () => {
  console.log('Proceed to payment clicked');
};

onMounted(() => {
  fetchTransaction();
});
</script>

<style scoped>
.bg-primary {
  background-color: #1e40af; /* Custom blue color */
}

.bg-gray-800 {
  background-color: #2d3748; /* Custom dark gray color */
}

.bg-gray-700 {
  background-color: #4a5568; /* Custom medium gray color */
}

.text-blue-500 {
  color: #3b82f6; /* Custom blue color */
}

.text-blue-600:hover {
  color: #2563eb; /* Custom darker blue color */
}
</style>