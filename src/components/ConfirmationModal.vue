<!-- components/ConfirmationModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Konfirmasi Pembayaran</h2>
      <p class="mb-4">Apakah Anda yakin ingin memilih metode pembayaran ini? Pilihan ini tidak dapat diubah setelah dikonfirmasi.</p>
      <div class="flex justify-end">
        <button @click="$emit('cancel')" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 mr-2">Batal</button>
        <button @click="$emit('confirm')" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Konfirmasi</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
};
</script>

<style scoped>
/* Style for modal */
</style>
