<template>
  <MemberLayouts>
    <div class="w-full flex justify-center items-center">
      <!-- image -->
      <div class="flex flex-col items-center gap-4">
        <img src="../../assets/empty-folder.svg" class="w-96" />
        <h1 class="text-lg font-semibold text-text-primary">OOps! Kamu tersesat</h1>
        <p class="text-sm font-medium text-text-quaternary text-center">Halaman yang kamu cari tidak ditemukan.</p>
        <button 
          @click="$router.push('/member/dashboard')"
          class="bg-primary text-white font-semibold rounded-full py-2 px-4 hover:bg-secondary">Ke Dashboard</button>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";

</script>