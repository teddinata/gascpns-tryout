<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MemberLayouts>
    <!-- v-for -->
    <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
      <div v-for="tryout in tryoutData" :key="tryout.id"
        class="w-full max-w-[300px] flex flex-col gap-4 bg-white rounded-xl p-3 shadow-sm justify-between"
      >
        <img :src="tryout.cover_path" class="w-full h-40" :alt="tryout.title" />
        <h1 class="text-xl font-semibold text-text-primary">{{ tryout.title }}</h1>
        <div class="flex flex-col space-y-2">
          <div class="flex gap-3 justify-between items-center">
            <div class="p-2 rounded-full bg-[#E0F3FE]">
              <Icon class="text-xl text-primary" icon="fa6-solid:book-open" />
            </div>
            <p class="text-sm font-medium text-text-primary">
              {{ formatDate(tryout.start_at) }} - {{ formatDate(tryout.end_at) }}
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
                {{ formatDate(tryout.sale_start_at) }} - {{ formatDate(tryout.sale_end_at) }}
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
          class="w-full rounded-full py-2"
          :class="tryout.is_started ? 'bg-secondary text-white font-semibold hover:bg-[#FFA500]' : 'bg-primary text-white font-semibold hover:bg-secondary'"
          @click="tryout.is_started ? $router.push(`/member/tryout/${tryout.id}`) : $router.push(`/member/tryout/${tryout.id}/detail`)"
        >
          {{ tryout.is_started ? 'Lanjut Kerjakan' : 'Mulai' }}
        </button>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { formatRupiah } from "@/filters";
import { formatDate } from "@/filters";
import { Icon } from "@iconify/vue";


import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import api from '@/api/Api.js'; // Mengimpor instansi Axios


const tryoutData = ref([]);

onMounted(async () => {
  try {
    const response = await api.get("/v1/tryout");
    tryoutData.value = response.data.data;
    // console.log('Tryout details:', response.data.data);
  } catch (error) {
    console.error(error);
  }
});


// onclic

</script>
