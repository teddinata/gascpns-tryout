<template>
  <MemberLayouts>
    <section class="py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Bantuan</h2>
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Panduan Pengguna</h3>
          <p class="text-gray-700 mb-2">Pelajari cara menggunakan platform kami dengan panduan pengguna berikut:</p>
          <ul class="list-disc list-inside text-gray-700">
            <li><a href="#" class="text-blue-500 hover:underline">Cara mendaftar akun baru</a></li>
            <li><a href="#" class="text-blue-500 hover:underline">Cara mengikuti tryout</a></li>
            <li><a href="#" class="text-blue-500 hover:underline">Cara melihat hasil tryout</a></li>
          </ul>
        </div>

        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">FAQ</h3>
          <div v-for="faq in faqs" :key="faq.question" class="mb-4">
            <button class="text-left w-full bg-gray-100 px-4 py-2 rounded-lg" @click="toggleFaq(faq)">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 font-semibold">{{ faq.question }}</span>
                <svg v-if="faq.open" class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 10a1 1 0 012 0v6a1 1 0 11-2 0v-6zm8-1a1 1 0 100 2h6a1 1 0 100-2h-6z" clip-rule="evenodd"/></svg>
                <svg v-else class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v6a1 1 0 11-2 0V6a1 1 0 011-1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v6a1 1 0 11-2 0V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
              </div>
            </button>
            <div v-if="faq.open" class="mt-2 px-4 py-2 bg-gray-50 rounded-lg">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Kontak Dukungan</h3>
          <p class="text-gray-700 mb-2">Jika Anda memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan kami:</p>
          <ul class="list-disc list-inside text-gray-700">
            <li class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 3.87a10 10 0 1114.09 14.12 10 10 0 01-14.1-14.13zm2.46 1.72c-.35.05-.69.14-1.01.26-.23.08-.45.2-.66.34a1.88 1.88 0 00-.65.74c-.3.54-.38 1.22-.25 1.82a9.02 9.02 0 003.15 5.35c.76.67 1.62 1.24 2.54 1.7.92.46 1.89.82 2.89 1.08.66.17 1.36.27 2.03.31.56.03 1.15-.02 1.7-.15.6-.14 1.16-.43 1.58-.91.3-.33.52-.71.68-1.13.13-.33.24-.67.32-1.02.1-.38.03-.8-.22-1.1-.16-.2-.37-.36-.6-.47-.48-.21-1.02-.1-1.48.2-.24.16-.42.38-.64.57-.24.22-.55.3-.86.28-.26-.01-.53-.08-.78-.15-.72-.2-1.39-.53-2.03-.93-1.09-.65-2.02-1.48-2.88-2.35a9.08 9.08 0 01-1.45-1.86c-.21-.39-.43-.78-.52-1.21-.12-.55.2-1.18.7-1.43.28-.13.6-.13.88-.08.23.04.45.14.66.25.2.1.4.22.59.35.34.21.7.41 1.03.63.33.22.66.45.98.69.22.16.48.32.76.3.36-.03.62-.38.8-.68.17-.3.31-.61.44-.92.12-.28.2-.57.27-.87.1-.44.1-.9.01-1.35-.1-.5-.33-.99-.7-1.36-.58-.61-1.36-.88-2.16-1.07-.54-.12-1.1-.22-1.64-.28zM19.25 19.88l.74.74-1.77 1.77-.74-.74a10 10 0 001.77-1.77z"/></svg>
              <a href="mailto:help@gascpns.com" class="text-blue-500 hover:underline">help@gascpns.com</a>
            </li>
            <li class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a7.92 7.92 0 01-4.69-1.55l.59-.88a1.73 1.73 0 00.39-1.3l-.12-1a3.73 3.73 0 01.34-1.7l1.65-.65a1.73 1.73 0 001.1-.84l.24-.51a3.73 3.73 0 011.39-1.39l.51-.24a1.73 1.73 0 00.84-1.1l.65-1.65a3.73 3.73 0 011.7-.34l1 .12a1.73 1.73 0 001.3-.39l.88-.59a7.92 7.92 0 011.55 4.69 7.92 7.92 0 01-4.69 4.69l-.88-.59a1.73 1.73 0 00-1.3-.39l-1-.12a3.73 3.73 0 01-1.7-.34l-.65 1.65a1.73 1.73 0 00-.84 1.1l-.24.51a3.73 3.73 0 01-1.39 1.39l-.51.24a1.73 1.73 0 00-1.1.84l-1.65.65a3.73 3.73 0 01-1.7.34l-1-.12a1.73 1.73 0 00-1.3.39l-.59.88A7.92 7.92 0 0112 20z"/></svg>
              <a href="tel:+6285183002434" class="text-blue-500 hover:underline">+62 851 8300 2434</a>
            </li>
            <li class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a7.92 7.92 0 01-4.69-1.55l.59-.88a1.73 1.73 0 00.39-1.3l-.12-1a3.73 3.73 0 01.34-1.7l1.65-.65a1.73 1.73 0 001.1-.84l.24-.51a3.73 3.73 0 011.39-1.39l.51-.24a1.73 1.73 0 00.84-1.1l.65-1.65a3.73 3.73 0 011.7-.34l1 .12a1.73 1.73 0 001.3-.39l.88-.59a7.92 7.92 0 011.55 4.69 7.92 7.92 0 01-4.69 4.69l-.88-.59a1.73 1.73 0 00-1.3-.39l-1-.12a3.73 3.73 0 01-1.7-.34l-.65 1.65a1.73 1.73 0 00-.84 1.1l-.24.51a3.73 3.73 0 01-1.39 1.39l-.51.24a1.73 1.73 0 00-1.1.84l-1.65.65a3.73 3.73 0 01-1.7.34l-1-.12a1.73 1.73 0 00-1.3.39l-.59.88A7.92 7.92 0 0112 20z"/></svg>
              <a href="https://wa.me/6285183002434" class="text-blue-500 hover:underline">Chat WhatsApp</a>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4">Pemecahan Masalah</h3>
          <p class="text-gray-700 mb-2">Berikut adalah beberapa solusi untuk masalah umum:</p>
          <ul class="list-disc list-inside text-gray-700">
            <li><a href="#" class="text-blue-500 hover:underline">Masalah login</a></li>
            <li><a href="#" class="text-blue-500 hover:underline">Masalah pembayaran</a></li>
            <li><a href="#" class="text-blue-500 hover:underline">Masalah hasil tryout</a></li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 class="text-xl font-semibold mb-4">Informasi</h3>
          <p class="text-gray-700">Dapatkan bantuan via chat lebih cepat</p>
          <p class="text-gray-700">Fitur akan segera siap digunakan</p>
        </div>
      </div>
    </section>
  </MemberLayouts>
</template>

<script setup>
import { ref } from 'vue';
import MemberLayouts from "@/components/MemberLayouts.vue";

const faqs = ref([
  {
    question: 'Bagaimana cara mengatur ulang kata sandi saya?',
    answer: 'Untuk mengatur ulang kata sandi Anda, pergi ke halaman login dan klik "Lupa kata sandi". Ikuti instruksi untuk mengatur ulang kata sandi Anda melalui email.',
    open: false
  },
  {
    question: 'Bagaimana cara memperbarui informasi penagihan saya?',
    answer: 'Untuk memperbarui informasi penagihan Anda, pergi ke pengaturan akun dan klik "Informasi penagihan". Dari sana, Anda dapat memperbarui detail pembayaran Anda.',
    open: false
  },
  {
    question: 'Bagaimana cara menghubungi dukungan pelanggan?',
    answer: 'Untuk menghubungi dukungan pelanggan, kunjungi halaman "Kontak Kami" dan isi formulir dukungan. Anda juga dapat menghubungi kami melalui email atau telepon.',
    open: false
  },
  {
    question: 'Bagaimana cara menghapus akun saya?',
    answer: 'Untuk menghapus akun Anda, pergi ke pengaturan akun dan klik "Hapus akun". Ikuti instruksi untuk menghapus akun Anda secara permanen.',
    open: false
  },
]);

const toggleFaq = (faq) => {
  faq.open = !faq.open;
};
</script>

<style scoped>
.bg-primary {
  background-color: #1d90ff;
}

.text-gray-700 {
  color: #4a4a4a;
}

.mb-4 {
  margin-bottom: 1rem;
}

.vue-select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  background-color: white;
}

.vue-select input[type="search"] {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>
