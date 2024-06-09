<template>
  <MemberLayouts>
    <div class="w-full flex justify-center items-center">
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

</script>