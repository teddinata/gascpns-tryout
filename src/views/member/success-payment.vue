<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MemberLayouts>
    <div class="w-full flex justify-center items-center h-screen gap-4">
      <!-- image -->
      <div class="flex flex-col items-center gap-4">
        <img src="../../assets/success-payment.svg" class="w-96" />
        <h1 class="text-lg font-semibold text-text-primary">Selamat, pembayaran kamu berhasil!</h1>
        <p class="text-sm font-medium text-text-quaternary text-center">Kamu bisa langsung mulai belajar dengan tryout yang sudah kamu beli.</p>
        <!-- button start tryout with icon -->
        <button 
          @click="router.push({ name: 'my-tryout' })"
          class="flex items-center gap-2 bg-primary text-white font-semibold rounded-full py-2 px-4 hover:bg-secondary">
          <Icon icon="fa-solid:play" class="text-lg"></Icon>
          <span>Mulai Tryout</span>
        </button>
        <!-- button lihat transaksi with icon -->
        <button 
          @click="router.push({ name: 'riwayat-transaksi' })"
          class="flex items-center gap-2 bg-secondary text-white font-semibold rounded-full py-2 px-4 hover:bg-primary">
          <Icon icon="fa-solid:receipt" class="text-lg"></Icon>
          <span>Lihat Transaksi</span>
        </button>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
