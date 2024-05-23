<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MemberLayouts>
    <!-- <template> -->
      <div class="w-full mx-auto p-6 ">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">(CPNS) Premium</h1>
          <button class="py-2 px-4 bg-primary rounded-full text-white hover:bg-blue-600">Beli Paket Sekarang</button>
        </div>
        <p class="mb-6">Mulai belajar dari sekarang untuk meningkatkan pemahaman kamu menghadapi tes seleksi. Manfaatkan fasilitas belajar yang telah kami siapkan secara praktis dan eksklusif!</p>
        
          <!-- Features List -->
          <div class="grid grid-cols-2 gap-4">

            <div class="text-white">
              <div class="p-6 bg-gray-800 rounded-xl shadow-lg w-auto">
                <img src="../../assets/banner-tryout-fix-2.png"
                alt="Paket CPNS Premium" class="w-full h-40 rounded mb-4" 
                style="object-fit: cover; object-position: center; size: 20px;">
                <h2 class="text-xl font-semibold mb-2">Paket (CPNS) Premium</h2>
                <div class="flex items-center mb-2">
                  <span class="text-red-400 text-2xl font-bold">Rp149.000</span>
                  <span class="text-gray-400 line-through ml-2">Rp299.000</span>
                  <span class="text-green-500 ml-2">-50%</span>
                </div>
                <button 
                  @click="router.push('/member/beli-paket-soal/payment-method')"
                  class="w-full py-2 bg-primary text-white rounded-md hover:bg-blue-600">Beli Paket Sekarang</button>
                <button class="w-full mt-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Beli Bareng Teman?</button>
              </div>
            </div>

            <div>
              <ul class="list-none space-y-2">
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
                  <span class="text-green-500 mr-2">✔</span> Try Out Exclusive Platinum SKD Sistem CAT dengan Pembahasan
                </li>
                <li class="flex items-center">
                  <span class="text-green-500 mr-2">✔</span> Kunci dan Pembahasan Try Out Lengkap
                </li>
                <li class="flex items-center">
                  <span class="text-green-500 mr-2">✔</span> Materi SKD Terupdate
                </li>
                
                <li class="flex items-center">
                  <span class="text-red-500 mr-2">✖</span> Analisa Waktu Pengerjaan Try Out (Manajemen Waktu)
                </li>
                <li class="flex items-center">
                  <span class="text-red-500 mr-2">✖</span> Sebaran Data Nilai Try Out Pengguna Lain (Pesaing)
                </li>
              </ul>
            </div>

          </div>
          <div>
            <!-- <ul class="list-none space-y-2">
            </ul> -->
           
          
          </div>
    
        <!-- Sidebar -->
        
        
      </div>
    <!-- </template> -->
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/Api.js';

const router = useRouter();
const form = ref({
  package_id: '',
  quantity: 1,
  email: '',
});

const successMessage = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  try {
    const response = await api.post('/v1/buy-package', {
      package_id: form.value.package_id,
      quantity: form.value.quantity,
      email: form.value.email,
    });
    successMessage.value = 'Paket berhasil dibeli!';
    errorMessage.value = '';
  } catch (error) {
    successMessage.value = '';
    errorMessage.value = 'Gagal membeli paket.';
  }
};
</script>

