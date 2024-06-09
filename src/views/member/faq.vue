<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <MemberLayouts>
    <section class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-16">
          <h2 class="text-4xl font-manrope text-center font-bold text-gray-900 leading-[3.25rem]">
            Frequently asked questions
          </h2>
          <h4 class="text-lg text-gray-500 text-center mt-4">
            Temukan jawaban atas pertanyaan yang paling sering ditanyakan tentang platform tryout GASCPNS.
          </h4>
        </div>
        <div class="accordion-group">
          <div
            v-for="(item, index) in faqs"
            :key="index"
            :class="{
              'accordion-active': activeIndex === index,
              'border-[#0BA7E3]': activeIndex === index,
              'bg-blue-50': activeIndex === index,
            }"
            class="accordion border border-solid border-gray-300 p-4 rounded-xl transition duration-500 mb-8 lg:p-4"
          >
            <button
              @click="toggleAccordion(index)"
              class="accordion-toggle group inline-flex items-center justify-between text-left text-lg font-normal leading-8 text-gray-900 w-full transition duration-500 hover:text-[#0BA7E3]"
            >
              <h5>{{ item.question }}</h5>
              <svg
                v-if="activeIndex !== index"
                class="w-6 h-6 text-gray-900 transition duration-500 group-hover:text-[#0BA7E3]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M12 18V6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-[#0BA7E3] transition duration-500 group-hover:text-[#0BA7E3]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <transition
              name="accordion"
              @enter="enter"
              @leave="leave"
            >
              <div
                v-if="activeIndex === index"
                class="accordion-content w-full overflow-hidden pr-4"
              >
                <p class="text-base text-gray-900 font-normal leading-6">
                  {{ item.answer }}
                </p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </MemberLayouts>
</template>

<script setup>
import { ref } from 'vue';
import MemberLayouts from "@/components/MemberLayouts.vue";

const activeIndex = ref(null);

const faqs = ref([
  {
    question: 'Bagaimana cara mendaftar di platform tryout CPNS ini?',
    answer: 
      "Untuk mendaftar, klik tombol 'Daftar' atau 'Buat Akun' di halaman utama. Isi formulir pendaftaran dengan informasi pribadi Anda, dan klik 'Buat Akun'. Verifikasi alamat email Anda jika diperlukan, kemudian masuk untuk mulai menggunakan platform.",
  },
  {
    question: 'Apakah saya bisa mencoba tryout secara gratis?',
    answer: 
      "Ya, kami menyediakan paket tryout gratis untuk pengguna baru. Anda dapat mencoba beberapa soal latihan tanpa biaya sebelum memutuskan untuk membeli paket premium.",
  },
  {
    question: 'Apa perbedaan antara paket gratis dan paket premium?',
    answer: 
      "Paket gratis biasanya menyediakan sejumlah soal terbatas dan fitur dasar. Paket premium memberikan akses penuh ke semua soal tryout, pembahasan soal, fitur analisis kinerja, dan materi tambahan lainnya.",
  },
  {
    question: 'Bagaimana cara mengakses tryout setelah mendaftar?',
    answer: 
      "Setelah mendaftar dan masuk, pilih menu 'Tryout CPNS' dari dashboard Anda. Pilih paket tryout yang tersedia dan mulai mengerjakan soal.",
  },
  {
    question: 'Bisakah saya mengulang tryout yang telah selesai?',
    answer: 
      "Ya, Anda dapat mengulang tryout yang telah selesai. Hasil percobaan sebelumnya akan tersimpan sehingga Anda dapat melihat kemajuan Anda dari waktu ke waktu.",
  },
  {
    question: 'Bagaimana cara melihat hasil dan analisis tryout?',
    answer: 
      "Setelah menyelesaikan tryout, Anda dapat melihat hasil dan analisis di bagian 'Riwayat Tryout' pada dashboard Anda. Kami menyediakan analisis terperinci tentang kinerja Anda di setiap sesi.",
  },
  {
    question: 'Apakah tersedia pembahasan soal setelah tryout selesai?',
    answer: 
      "Ya, setelah Anda menyelesaikan tryout, kami menyediakan pembahasan lengkap untuk setiap soal. Anda dapat melihat cara menyelesaikan soal dengan benar dan mempelajari konsep yang relevan.",
  },
  {
    question: 'Bagaimana jika saya lupa password?',
    answer: 
      "Jika Anda lupa password, klik 'Lupa Password' di halaman login. Masukkan alamat email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang password Anda.",
  },
  {
    question: 'Bagaimana cara memperbarui informasi pembayaran?',
    answer: 
      "Untuk memperbarui informasi pembayaran, masuk ke akun Anda dan pilih 'Pengaturan Akun'. Klik 'Informasi Pembayaran' dan perbarui detail pembayaran Anda sesuai instruksi.",
  },
  {
    question: 'Bagaimana cara menghubungi dukungan pelanggan?',
    answer: 
      "Jika Anda membutuhkan bantuan, Anda dapat menghubungi dukungan pelanggan melalui halaman 'Kontak Kami' di situs web kami. Isi formulir dukungan atau kirim email langsung ke support@tryoutcpns.com. Kami juga tersedia melalui telepon di nomor (123) 456-7890.",
  },
]);

const toggleAccordion = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const enter = (el) => {
  el.style.height = el.scrollHeight + 'px';
};

const leave = (el) => {
  el.style.height = '0';
};
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.5s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
}
</style>
