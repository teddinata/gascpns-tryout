<template>
  <MemberLayouts>
    <!-- Tab Navigation -->
    <div class="tabs flex mb-4 mx-8 mt-8">
      <button 
        @click="activeTab = 'myTryouts'" 
        :class="{ 'bg-primary text-white': activeTab === 'myTryouts', 'text-primary bg-white': activeTab !== 'myTryouts' }" 
        class="px-4 py-2 rounded-t-lg focus:outline-none"
        >Tryout Saya</button>
      <button 
        @click="activeTab = 'buyTryouts'" 
        :class="{ 'bg-primary text-white': activeTab === 'buyTryouts', 'text-primary bg-white': activeTab !== 'buyTryouts' }" 
        class="px-4 py-2 rounded-t-lg focus:outline-none"
        >Beli Tryout</button>
    </div>

    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 w-full">
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

    <!-- Tryout Cards -->
    <div v-else-if="filteredTryouts && filteredTryouts.length && activeTab === 'myTryouts'"
      class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mx-8 mt-8">
        <div v-for="tryout in filteredTryouts" :key="tryout.id"
          class="w-full max-w-[300px] flex flex-col gap-4 bg-white rounded-xl p-3 shadow-lg justify-between"
        >
          <!-- Konten tryout -->
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
                v-if="tryout?.current_tryout !== null"
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
            <div
              v-if="tryout?.is_started === false"
              class="flex flex-col gap-2">
              <div class="flex gap-2 justify-between items-center">
                <div class="p-2 rounded-full bg-[#E0F3FE]">
                  <Icon class="text-xl text-primary" icon="fluent:calendar-clock-24-filled" />
                  
                </div>
                <!-- Mulai pada -->
                <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
                Mulai: <strong>{{ formatDate(tryout.start_at) }}</strong> 
                </p>
              </div>
            </div>
            <div
              v-if="tryout?.is_started === false"
              class="flex flex-col gap-2">
              <div class="flex gap-2 justify-between items-center">
                <div class="p-2 rounded-full bg-red-100">
                  <Icon class="text-xl text-red-400" icon="fluent:calendar-clock-24-filled" />
                </div>
                <!-- Mulai pada -->
                <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
                Berakhir: <strong>{{ formatDate(tryout.end_at) }}</strong> 
                </p>
              </div>
            </div>
            <div
              v-if="tryout?.is_started === true"
              class="flex flex-col gap-2">
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
            v-if="tryout?.current_tryout?.status === 1 && tryout.is_started === true"
            class="w-full rounded-full py-2 bg-[#FFA500] text-white font-semibold hover:bg-yellow-500"
            @click="$router.push(`/member/tryout/${tryout.next}`)"
          >
            Lanjutkan Pengerjaan
          </button>

          <button 
            v-if="tryout?.current_tryout?.status === 2 && tryout.is_started === true"
            class="w-full rounded-full py-2 bg-gray-700 text-white font-semibold hover:bg-gray-500"
            @click="$router.push(`/member/tryout/${tryout.current_tryout.id}/summary`)"
          >
            Lihat Hasil
          </button>

          <button 
            v-if="tryout?.current_tryout?.status === 2 && tryout.is_started === true"
            class="w-full rounded-full py-2 bg-gray-300 text-white font-semibold cursor-not-allowed"
          >
            Selesai
          </button>

           <!-- Tombol beli tryout -->
          <button 
            v-if="activeTab === 'buyTryouts'" 
            class="w-full rounded-full py-2 bg-primary text-white font-semibold hover:bg-secondary"
            @click="buyTryout(tryout.id)"
          >
            Beli Sekarang
          </button>
          
          <button
            v-if="tryout?.is_started === false"
            class="w-full rounded-full py-2"
            :class="{
              'bg-secondary text-white font-semibold hover:bg-[#FFA500]': tryout.is_started,
              'bg-primary text-white font-semibold hover:bg-secondary': !tryout.is_started,
              'disabled:opacity-50 cursor-not-allowed': startAt > new Date() && !tryout.is_started,
            }"
            :disabled="startAt > new Date()"
            :title="startAt > new Date() ? 'Tryout belum dimulai' : ''"
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

      <!-- <div v-if="activeTab === 'buyTryouts'">
        TEST
      </div> -->
    </div>
        

    <!-- Empty Tryout -->
    <div v-else-if="!isLoading && (!filteredTryouts || !filteredTryouts.length) && activeTab === 'myTryouts'" class="w-full flex justify-center items-center">
      <!-- image -->
      <div class="flex flex-col items-center gap-4">
        <img src="../../assets/empty-folder.svg" class="w-96" />
        <h1 class="text-lg font-semibold text-text-primary">Kamu belum membeli Tryout</h1>
        <p class="text-sm font-medium text-text-quaternary text-center">Yuk beli Tryout sekarang dan mulai kerjakan Tryout yang kamu beli</p>
        <button class="bg-primary text-white font-semibold rounded-full py-2 px-4 hover:bg-secondary">Beli Tryout</button>
      </div>
    </div>

    <!-- Buy Tryouts -->
    <div v-else-if="!isLoading && filteredTryouts && filteredTryouts.length && activeTab === 'buyTryouts'" 
      class="flex gap-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mx-8 mt-8">
      <div v-for="tryout in buyTryouts" :key="tryout.id"
        class="w-full max-w-[300px] flex flex-col gap-4 bg-white shadow-lg rounded-xl p-3"
      >
        <!-- Konten kartu pembelian tryout -->
         <!-- Konten tryout -->
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
               v-if="tryout?.current_tryout !== null"
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
           <div
             v-if="tryout?.is_started === false"
             class="flex flex-col gap-2">
             <div class="flex gap-2 justify-between items-center">
               <div class="p-2 rounded-full bg-[#E0F3FE]">
                 <Icon class="text-xl text-primary" icon="fluent:calendar-clock-24-filled" />
                 
               </div>
               <!-- Mulai pada -->
               <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
               Mulai: <strong>{{ formatDate(tryout.start_at) }}</strong> 
               </p>
             </div>
           </div>
           <div
             v-if="tryout?.is_started === false"
             class="flex flex-col gap-2">
             <div class="flex gap-2 justify-between items-center">
               <div class="p-2 rounded-full bg-red-100">
                 <Icon class="text-xl text-red-400" icon="fluent:calendar-clock-24-filled" />
               </div>
               <!-- Mulai pada -->
               <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
               Berakhir: <strong>{{ formatDate(tryout.end_at) }}</strong> 
               </p>
             </div>
           </div>
           <div
             v-if="tryout?.is_started === true"
             class="flex flex-col gap-2">
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

          <!-- Tombol beli tryout -->
         <button 
           v-if="activeTab === 'buyTryouts'" 
           class="w-full rounded-full py-2 bg-primary text-white font-semibold hover:bg-secondary"
           @click="buyTryout(tryout.slug)"
         >
           Beli Sekarang
         </button>
         
        <!-- Ganti dengan konten yang sesuai dari buyTryouts -->
      </div>
    </div>

    <!-- Empty Buy Tryouts -->
    <div v-else-if="!isLoading && (!filteredTryouts || !filteredTryouts.length) && activeTab === 'buyTryouts'" class="w-full flex justify-center items-center">
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
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";

import axios from "axios";
import api from '@/api/Api.js'; // Mengimpor instansi Axios

const toast = useToast();
const isLoading = ref(true);
const tryoutData = ref([]);
const router = useRouter();
const countdown = ref(null);
const activeTab = ref('myTryouts'); // Atau tab default yang Anda inginkan
const myTryouts = ref([]);
const buyTryouts = ref([])
let startAt = null;
let startAtString = null;

const fetchTryouts = async () => {
  try {
    const responseMyTryouts = await api.get('/v1/tryout');
    myTryouts.value = responseMyTryouts.data.data;

    const responseBuyTryouts = await api.get('/v1/tryout/favorite');
    buyTryouts.value = responseBuyTryouts.data.data.data;
  } catch (error) {
    console.error('Error fetching tryout data:', error);
  } finally {
    isLoading.value = false;
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

    // console.log('Start tryout response:', data.data.id);

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
const filteredTryouts = computed(() => {
  return activeTab.value === 'myTryouts' ? myTryouts.value : buyTryouts.value;
});

// buyTryout function to detail page
const buyTryout = (slug) => {
  router.push(`/member/paket/detail/${slug}`);
};


onMounted(fetchTryouts);
</script>

<style scoped>
.tabs button {
  transition: all 0.3s ease;
}

.tabs button:hover {
  background-color: #0BA7E3; /* Tailwind's blue-600 color */
  color: white;
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