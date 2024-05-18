<template>
  <MemberLayouts>
    <!-- v-for -->
    <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
      <div v-for="tryout in tryoutData" :key="tryout.id"
        class="w-full max-w-[300px] flex flex-col gap-4 bg-white rounded-xl p-3 shadow-sm justify-between"
      >
        <img :src="tryout.cover_path" class="w-full h-40" :alt="tryout.name" />
        <h1 class="text-xl font-semibold text-text-primary">{{ tryout.name }}</h1>
        <div class="flex flex-col space-y-2">
          <div class="flex gap-3 justify-between items-center">
            <div class="p-2 rounded-full bg-[#E0F3FE]">
              <Icon class="text-xl text-primary" icon="fa6-solid:book-open" />
            </div>
            <!-- badge premium -->
            <div class="px-4 py-1.5 rounded-md bg-primary text-white">
              <p class="text-sm font-semibold">Premium</p>
            </div>
          </div>
          <div class="flex gap-3 justify-between items-center">
            <div class="p-2 rounded-full bg-[#E0F3FE]">
              <Icon class="text-xl text-primary" icon="fluent:clock-24-filled" />
            </div>
            <div 
              v-if="tryout?.current_tryout?.finished_at !== null"
              class="flex gap-2 justify-between">
              <!-- <h1 class="text-md font-medium text-text-primary">Periode</h1> -->
              <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
                <!-- DATE FORMAT sale_start_date - sale_end_date -->
                <!-- {{ formatDate(tryout.sale_start_at) }} - {{ formatDate(tryout.sale_end_at) }} -->
                {{ countdown }}  (100 Menit)
              </p>
            </div>
            <div 
              v-if="tryout?.is_started === false"
              class="flex gap-2 justify-between">
              <!-- <h1 class="text-md font-medium text-text-primary">Periode</h1> -->
              <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
                <!-- DATE FORMAT sale_start_date - sale_end_date -->
                <!-- {{ formatDate(tryout.sale_start_at) }} - {{ formatDate(tryout.sale_end_at) }} -->
                100 Menit
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2 justify-between items-center">
              <div class="p-2 rounded-full bg-[#E0F3FE]">
                <Icon class="text-xl text-primary" icon="fluent:checkmark-circle-24-filled" />
              </div>
              <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
                {{ tryout.total_questions }} Soal
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <h1 v-if="tryout.price" class="text-[16px] font-semibold text-red-400" :class="{ 'line-through': formatRupiah(tryout.discount) }">
            Rp {{ formatRupiah(tryout.price) }}
          </h1>
          <div v-if="tryout.discount" class="px-4 py-1.5 rounded-full" :class="tryout.is_enrolled ? 'text-[#0BA7E3] bg-[#E0F3FE]' : 'bg-[#E0FEEE] text-[#22C55E]'">
            <p class="text-md font-semibold">Rp {{ formatRupiah(tryout.discount) }}</p>
          </div>
        </div>

        <button 
          v-if="tryout?.current_tryout?.status === 2 && tryout.is_started === true"
          class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
        >
          Lihat Hasil
        </button>

        <button 
          v-if="tryout?.current_tryout?.status === 2 && tryout.is_started === true"
          class="w-full rounded-full py-2 bg-gray-300 text-white font-semibold cursor-not-allowed"
        >
          Selesai
        </button>

        
        <button
          v-if="tryout.is_started === false || tryout?.current_tryout?.status === 1"
          class="w-full rounded-full py-2"
          :class="tryout.is_started ? 'bg-secondary text-white font-semibold hover:bg-[#FFA500]' : 'bg-primary text-white font-semibold hover:bg-secondary'"
          @click="tryout.is_started ? $router.push(`/member/tryout/${tryout.next}`) : startTryout(tryout.id)"
        >
          <template v-if="isLoading">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              Loading...
          </template>
          <template v-else>
            {{ tryout.is_started ? 'Lanjut Kerjakan' : 'Mulai' }}
          </template>
        </button>
      </div>
    </div>
    <!-- empty -->
    <div v-if="!tryoutData.length" class="w-full flex justify-center items-center">
      <!-- image -->
      <div class="flex flex-col items-center gap-4">
        <img src="../../assets/empty-folder.svg" class="w-96" />
        <h1 class="text-lg font-semibold text-text-primary">Kamu belum membeli Tryout</h1>
        <p class="text-sm font-medium text-text-quaternary text-center">Yuk beli Tryout sekarang dan mulai kerjakan Tryout yang kamu beli</p>
        <button class="bg-primary text-white font-semibold rounded-full py-2 px-4 hover:bg-secondary">Beli Tryout</button>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { formatRupiah } from "@/filters";
import { formatDate } from "@/filters";
import { Icon } from "@iconify/vue";
import { useToast } from 'vue-toastification';
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import axios from "axios";
import api from '@/api/Api.js'; // Mengimpor instansi Axios

const toast = useToast();
const isLoading = ref(false);
const tryoutData = ref([]);
const router = useRouter();
const countdown = ref(null);

const fetchTryouts = async () => {
  try {
    const response = await api.get("/v1/tryout");
    tryoutData.value = response.data.data;

  } catch (error) {
    console.error('Error fetching tryout details:', error);
    // Handle error, tampilkan pesan error, dll.
  }
};

const calculateCountdown = () => {
  // for each tryout, calculate the countdown
  tryoutData.value.forEach(tryout => {
    if (tryout.current_tryout.status === 1) {
      const finishedAt = new Date(tryout.current_tryout.finished_at);
      const x = setInterval(() => {
        const now = new Date();
        const difference = finishedAt.getTime() - now.getTime();

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdown.value = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

        if (difference < 0) {
          clearInterval(x);
          countdown.value = 'Waktu Habis';
        }
      }, 1000); 
    }
  });
};

watch(tryoutData, () => tryoutData.value.forEach(tryout => {
  if (tryout?.current_tryout?.status === 1) {
    calculateCountdown();
  }
}));
const currentTryoutId = ref(null); // Menyimpan tryoutId yang sedang aktif

const startTryout = async (tryoutId) => {
  isLoading.value = true;

  try {
    const response = await api.post(`/v1/tryout/${tryoutId}/start`);
    const data = response.data; // Menyimpan data response dari API

    console.log('Start tryout response:', data.data.id);

    // Menyimpan tryoutId yang sedang aktif di state atau variabel
    currentTryoutId.value = data.data.id;

    // Menampilkan informasi tryout yang dimulai
    toast.success(`Tryout berhasil dimulai! Selamat mengerjakan 🙂`);

    // Di sini Anda bisa melakukan navigasi ke halaman pengerjaan tryout. Menggunakan tryoutId yang didapat dari respons API
    router.push(`/member/tryout/${data.next}`); 
  } catch (error) {
    console.error('Error starting tryout:', error);
    toast.error('Gagal memulai tryout');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchTryouts();
});

// onclic

</script>
