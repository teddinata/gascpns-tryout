<script setup>
import { Icon } from "@iconify/vue";
import { defineProps } from "vue";
import { formatRupiah } from "@/filters";
import { useRouter } from 'vue-router';
const soal = defineProps({
  cover_path: String,
  name: String,
  icon1: String,
  icon2: String,
  students_count: String,
  sale_start_at: String,
  sale_end_at: String,
  income: String,
  price: Number,
  discount: Number,
  button: String,
  is_enrolled: Boolean,
  slug: String,
  id: Number,
});

const redirectToPurchaseForm = () => {
  // router.push('/member/beli-paket-soal');
  router.push(`/member/paket/detail/${soal.slug}`);
};

const router = useRouter();



</script>
<template>
  <div
    class="w-full flex flex-col gap-4 bg-white rounded-xl p-3 shadow-lg justify-between
     hover:bg-gray-100 transition duration-200"
  >
    <img :src="soal.cover_path" class="w-full h-auto" :alt="soal.title" />
    <h1 class="text-xl font-semibold text-text-primary">{{ soal.name }}</h1>
    <div class="flex flex-col space-y-2">
      <div class="flex gap-3 justify-between items-center">
        <div class="p-2 rounded-full bg-[#E0F3FE]">
          <Icon class="text-xl text-primary" icon="fa6-solid:cart-shopping" />
        </div>
        <p class="text-sm font-medium text-text-quaternary">
          {{ parseInt(soal.students_count) + 200 }} Terjual
        </p>
      </div>
      <div class="flex gap-3 justify-between items-center">
        <div class="p-2 rounded-full bg-[#E0F3FE]">
          <Icon class="text-xl text-primary" icon="fluent:calendar-clock-24-filled" />
        </div>
        <div class="flex gap-2 justify-between">
          <!-- <h1 class="text-md font-medium text-text-primary">Periode</h1> -->
          <p class="text-sm font-medium text-text-quaternary mt-1 text-right w-full">
            <!-- DATE FORMAT sale_start_date - sale_end_date -->
            {{ formatDate(soal.sale_start_at) }} - {{ formatDate(soal.sale_end_at) }}
          </p>
        </div>
      </div>
    </div>
    <p v-if="soal.discount" class="text-green-500 font-bold text-2xl ml-2"> Rp {{ formatRupiah(soal.discount) }}</p>
    <div class="flex items-center justify-start ml-2 -mt-4"> 
      <h1 v-if="soal.price" class="font-semibold text-red-400" 
        :class="{ 'line-through': formatRupiah(soal.discount) }">
        Rp {{ formatRupiah(soal.price) }}
      </h1>
      <!-- discount percentage = price -> 10000, discount price 8500, then discount percentage is 15% -->
      <div v-if="soal.discount" 
        class="px-4 py-1.5 rounded-full ml-2" :class="soal.is_enrolled ? 'text-[#0BA7E3] bg-[#E0F3FE]' : 'bg-[#ee3a3a] text-white'">
        <p class="text-large font-semibold"> -{{ Math.round(((soal.price - soal.discount) / soal.price) * 100) }}%</p>
      </div>
    </div>
    <button
      class="w-full rounded-full py-2 text-white"
      :class="soal.is_enrolled ? 'bg-[#C2C3C6] cursor-not-allowed' : 'bg-primary hover:bg-secondary'"
      :disabled="soal.is_enrolled"
      @click="redirectToPurchaseForm"
    >
      {{ soal.is_enrolled ? 'Sudah Dibeli' : 'Beli' }}
    </button>
  </div>
</template>
<script>
const formatDateOld = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return `${day} ${months[month]} ${year}`;
};

// Contoh penggunaan
console.log(formatDate('2024-05-01')); // Output: 1 Mei 2024



</script>