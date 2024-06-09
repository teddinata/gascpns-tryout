<template>
  <MemberLayouts>
    <div class="w-full mx-auto p-6 ">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">{{ paket.name }}</h1>
        <button @click="redirectToPurchaseForm" 
          class="flex items-center py-2 px-4 bg-primary rounded-full text-white hover:bg-blue-600">
          <Icon icon="fa-solid:shopping-cart" class="text-xl"></Icon>
          <p class="ml-2">Beli Sekarang</p>
        </button>
      </div>
      <p class="mb-6">{{ paket.description }}</p>
      
      <!-- Features List -->
      <div class="grid grid-cols-2 gap-10">
        <div class="text-white">
          <div class="p-6 bg-gray-800 rounded-xl shadow-lg w-auto">
            <img :src="paket.cover_path" alt="Paket CPNS Premium" class="w-full h-auto rounded mb-4" style="object-fit: cover; object-position: center; size: 20px;">
            <h2 class="text-xl font-semibold mb-2">{{ paket.name }} 
            <span v-if="paket.is_premium == 0"
              class="bg-blue-100 text-blue-800 text-xs font-medium ms-2 px-2.5 py-0.5 
              rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">PREMIUM</span>
              <span 
                v-else-if="paket.is_premium == 1"
                class="bg-yellow-100 text-yellow-800 text-xs font-medium ms-2 px-2.5 py-0.5
                rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">FREE</span>
            </h2>
            <div class="flex items-center mb-2">
              <span v-if="paket.discount" class="text-red-400 text-2xl font-bold">Rp {{ formatRupiah(paket.discount) }}</span>
              <span v-if="paket.discount" class="text-gray-400 line-through ml-2">Rp {{ formatRupiah(paket.price) }}</span>
              <span v-if="paket.discount" class="text-green-500 ml-2">-{{ Math.round(((paket.price - paket.discount) / paket.price) * 100) }}%</span>
              <span v-else class="text-red-400 text-2xl font-bold">Rp {{ formatRupiah(paket.price) }}</span>
            </div>
            <button @click="purchaseForSelf" class="w-full py-2 bg-primary text-white rounded-md hover:bg-blue-600 mt-2">Beli Paket Sekarang</button>
            <button @click="toggleFriendPurchase" class="w-full mt-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Beli Untuk Teman?</button>
          </div>
          
        </div>
        <div>
          <ul class="list-none space-y-2">
            <!-- <li v-for="feature in paket.features" :key="feature.id" class="flex items-center">
              <span v-if="feature.available" class="text-green-500 mr-2">✔</span>
              <span v-else class="text-red-500 mr-2">✖</span>
              {{ feature.name }}
            </li> -->
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Try Out Premium SKD Sistem CAT
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Latihan Soal SKD / Mini Try Out (TWK, TIU dan TKP)
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Ranking Try Out Nasional dan Daerah
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Kunci dan Pembahasan Try Out Lengkap
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Materi SKD Terupdate
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Try Out Exclusive Platinum SKD Sistem CAT dengan Pembahasan
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✔</span> Analisa Waktu Pengerjaan Try Out (Manajemen Waktu)
            </li>
            <li class="flex items-center">
              <span class="text-red-500 mr-2">✖</span> Video Materi SKD (TWK, TIU dan TKP)
            </li>
            <li class="flex items-center">
              <span class="text-red-500 mr-2">✖</span> Video Series SKD
            </li>
            <li class="flex items-center">
              <span class="text-red-500 mr-2">✖</span> Sebaran Data Nilai Try Out Pengguna Lain (Pesaing)
            </li>
            <li class="flex items-center">
              <span class="text-red-500 mr-2">✖</span> Kalkulator TIU
            </li>
          </ul>
          <!-- Form Beli Bareng Teman -->
          <div v-if="showFriendPurchaseForm" class="mt-4 p-4 bg-gray-800 rounded-xl shadow-lg w-auto">
            <form @submit.prevent="purchaseForFriends">
              <div v-for="(email, index) in friendEmails" :key="index" class="mb-2">
                <input 
                  v-model="friendEmails[index]" 
                  type="email" 
                  placeholder="Masukkan email teman" 
                  class="w-full py-2 px-4 bg-gray-800 text-white rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-600 border border-gray-700"
                />
              </div>
              <button type="button" @click="addEmailField" class="w-full mt-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">Tambah Email</button>
              <button type="submit" class="w-full mt-2 py-2 bg-primary text-white rounded-md hover:bg-blue-600">Kirim Pembelian</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/Api.js';
import { formatRupiah } from "@/filters";
import { Icon } from '@iconify/vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';


const toast = useToast();
const router = useRouter();
const store = useStore();

let showFriendPurchaseForm = ref(false);
let friendEmails = ref(['']);

let user = {};
const paket = ref({});

const toggleFriendPurchase = () => {
  showFriendPurchaseForm.value = !showFriendPurchaseForm.value;
};

const addEmailField = () => {
  friendEmails.value.push('');
};

const purchaseForFriends = async () => {
  try {
    if (typeof paket.value === 'object' && paket.value !== null) {
      // Pastikan paket memiliki properti id
      if (paket.value.id) {
        // Siapkan data untuk dikirim ke endpoint pembelian
        const requestData = {
          package_id: paket.value.id,
          quantity: friendEmails.value.length,
          email: friendEmails.value
        };

        // Kirim permintaan POST ke endpoint pembelian
        const response = await api.post('/v1/tryout/transactions/store', requestData);
        const transactionId = response.data.data.id;

        // Simpan transactionId ke Local Storage
        localStorage.setItem('transactionId', transactionId);

        // Tampilkan pesan sukses jika pembelian berhasil
        toast.success(`Berhasil membeli paket soal ${paket.value.name} untuk teman-teman Anda`);

        // Navigasikan ke halaman pembayaran
        router.push({ name: 'PaymentMethod' });

      } else {
        throw new Error('Package id is missing.');
      }
    } else {
      // Tampilkan pesan kesalahan jika paket bukan objek yang valid
      console.error('Data paket tidak valid:', paket.value);
    }
  } catch (error) {
    console.error('Gagal menyimpan transaksi:', error);
    toast.error('Gagal membeli paket soal untuk teman: ' + error.response.data.meta.message);
  }
};

const redirectToPurchaseForm = () => {
  // Navigasi ke halaman pembelian dengan slug paket
  router.push(`/member/beli-paket-soal/${paket.value.slug}/payment-method`);
};

const purchaseForSelf = async () => {
    user = store.getters['auth/user'];

  try {
    if (typeof paket.value === 'object' && paket.value !== null) {
      // Pastikan paket memiliki properti id dan email yang diperlukan
      if (paket.value.id && user.email) {
        // Siapkan data untuk dikirim ke endpoint pembelian
        const requestData = {
          package_id: paket.value.id,
          quantity: 1,
          email: [user.email]
        };

        // Kirim permintaan POST ke endpoint pembelian
        const response = await api.post('/v1/tryout/transactions/store', requestData);
        const transactionId = response.data.data.id;

        // Simpan transactionId ke Vuex store
        // store.dispatch('setTransactionId', transactionId);
        // Simpan transactionId ke Local Storage
        localStorage.setItem('transactionId', transactionId);
        
        // Tampilkan pesan sukses jika pembelian berhasil
        toast.success(`Berhasil membeli paket soal ${paket.value.name}`);

        // Navigasikan ke halaman pembayaran
        router.push({ name: 'PaymentMethod' });

        // Redirect pengguna ke halaman checkout
        // router.push(`/member/paket/${paket.value.slug}/checkout`);
        // router.push({ name: 'PaymentMethod', params: { transactionId } });
      } else {
        throw new Error('Package id or user email is missing.');
      }
    } else {
      // Tampilkan pesan kesalahan jika paket bukan objek yang valid
      console.error('Data paket tidak valid:', paket.value);
    }
  } catch (error) {
    console.error('Gagal menyimpan transaksi:', error);
    toast.error('Gagal membeli paket soal : ' + error.message);
  }
};

onMounted(async () => {
  try {
    // ambil data id paket dari slug
    const slug = router.currentRoute.value.params.slug;
    const response = await api.get(`/v1/package/${slug}`); // Endpoint API untuk mendapatkan detail paket berdasarkan slug
    paket.value = response.data.data;
  } catch (error) {
    console.error('Gagal memuat detail paket:', error);
  }
});
</script>
