<script setup>
import { Icon } from "@iconify/vue";
import { defineProps } from "vue";
import { formatRupiah } from "@/filters";
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
});


</script>
<template>
  <div
    class="w-full max-w-[300px] flex flex-col gap-4 bg-white rounded-xl p-3 shadow-sm justify-between"
  >
    <img :src="soal.cover_path" class="w-full h-40" :alt="soal.title" />
    <h1 class="text-xl font-semibold text-text-primary">{{ soal.name }}</h1>
    <div class="flex flex-col space-y-2">
      <div class="flex gap-3 justify-between items-center">
        <div class="p-2 rounded-full bg-[#E0F3FE]">
          <Icon class="text-xl text-primary" icon="fa6-solid:cart-shopping" />
        </div>
        <p class="text-sm font-medium text-text-quaternary">
          {{ soal.students_count }} Terjual
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
    <div class="flex items-center justify-between">
      <h1 v-if="soal.price" class="text-[16px] font-semibold text-red-400" :class="{ 'line-through': formatRupiah(soal.discount) }">
        Rp {{ formatRupiah(soal.price) }}
      </h1>
      <div v-if="soal.discount" class="px-4 py-1.5 rounded-full" :class="soal.is_enrolled ? 'text-[#0BA7E3] bg-[#E0F3FE]' : 'bg-[#E0FEEE] text-[#22C55E]'">
        <p class="text-md font-semibold">Rp {{ formatRupiah(soal.discount) }}</p>
      </div>
    </div>
    <button
      class="w-full rounded-full py-2 text-white"
      :class="soal.is_enrolled ? 'bg-[#C2C3C6] cursor-not-allowed' : 'bg-primary hover:bg-secondary'"
      :disabled="soal.is_enrolled"
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