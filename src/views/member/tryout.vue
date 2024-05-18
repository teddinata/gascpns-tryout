<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/Api.js';

const store = useStore();
const router = useRouter();
const toast = useToast();
const currentTryoutId = ref(null);
const isLoading = ref(false);
const navigationData = ref(null);
const questionDetail = ref(null);
const selectedAnswer = ref(null);
const route = useRoute();
// show confirmation dialog before finishing the tryout
const showConfirmationModal = ref(false);

import MemberLayouts from "@/components/MemberLayouts.vue";

// const numbers = Array.from({ length: 110 }, (_, index) => index + 1);

// Example data structure to store the status of each question
const questionStatus = [
  { status: "correct" },
  { status: "passed" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //11-20
  { status: "correct" },
  { status: "unanswered" },
  { status: "passed" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "unanswered" },
  { status: "unanswered" },
  { status: "unanswered" },
  //21-30
  { status: "correct" },
  { status: "unanswered" },
  { status: "unanswered" },
  { status: "passed" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //31-40
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //41-50
  { status: "correct" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "passed" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //51-60
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "wrong" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //61-70
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "unanswered" },
  { status: "wrong" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //71-80
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "wrong" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  //81-90
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "wrong" },
  { status: "correct" },
  { status: "correct" },
  //91-100
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "correct" },
  { status: "correct" },
  //100-110
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "correct" },
  { status: "passed" },
  { status: "correct" },
];
// Computed property to determine the class for each button
const getButtonClass = (index) => {
  const status = questionStatus[index]?.status;
  switch (status) {
    case "correct":
      return "bg-[#22C55E] text-white border-none"; // Green for correct
    case "wrong":
      return "bg-[#F90A0A] text-white border-none"; // Red for wrong
    case "passed":
      return "bg-[#FBBF24] text-white border-none"; // Yellow for passed
    default:
      return "bg-transparent text-[#90989F]"; // Transparent for unanswered
  }
};


const countdown = ref('');

const numbers = Array.from(Array(100).keys()).map((i) => (i + 1).toString().padStart(2, '0'));

const getQuestionDetail = async (tryoutDetailsId) => {
  try {
    const response = await api.get(`/v1/tryout/${tryoutDetailsId}`);
    questionDetail.value = response.data;

    // Mapping jawaban ke label A, B, C, D, E
    if (questionDetail.value.data.answers) {
          // Mapping jawaban ke label A, B, C, D, E
          questionDetail.value.data.answers = questionDetail.value.data.answers.map((answer, index) => {
            return {
              label: String.fromCharCode(65 + index),
              text: answer.answer, // Assuming the answer text is in `answer.answer`
              id: answer.id,
              score: answer.score,
            };
          });

          questionDetail.value.data.answers.forEach(answer => {
            if (answer.id === questionDetail.value.data.course_answer_id) {
              selectedAnswer.value = answer.id;
            }
          });
        }
    console.log('Question detail:', questionDetail.value.data.answers);

    // mendgecek data selectedAnswer dari data answer untuk menampilkan jawaban yang sudah dipilih
    // if (questionDetail.value.data.answer !== null) {
    //   selectedAnswer.value = questionDetail.value.data.answer.id;
    // }
    // Get navigation data after getting question detail
    getNavigationData(response.data.data.tryout_id);
  } catch (error) {
    console.error('Error getting question detail:', error);
    toast.error('Gagal mendapatkan detail soal');
  }
};

const goToQuestion = (tryoutDetailsId) => {
  router.push(`/member/tryout/${tryoutDetailsId}`);
  getQuestionDetail(tryoutDetailsId);
};

const getNavigationData = async (currentTryoutId) => {
  try {
    isLoading.value = true;
    const response = await api.get(`/v1/tryout/${currentTryoutId}/navigate`);
    navigationData.value = response.data.data;
    console.log('Navigation data:', navigationData.value);
    startCountdown(response.data.data.finished_at);
  } catch (error) {
    console.error('Error getting question data:', error);
    toast.error('Gagal mendapatkan data navigasi');
  } finally {
    isLoading.value = false;
  }
};

const startCountdown = (finishedAt) => {
  const countDownDate = new Date(finishedAt).getTime();
  const x = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.value = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

    if (distance < 0) {
      clearInterval(x);
      countdown.value = 'EXPIRED';
    }
  }, 1000);
};

const saveAndNextQuestion = async () => {

  const tryoutDetailsId = route.params.tryoutDetailsId;

  if (!selectedAnswer.value) {
    toast.error('Pilih jawaban terlebih dahulu!');
    return;
  }

  try {
    const response = await api.post(`/v1/tryout/${tryoutDetailsId}/answer`, {
      answer_id: selectedAnswer.value 
    });
    
    if (response.data.meta.code === 200) {
      if (response.data.data.next !== null) {
        router.push(`/member/tryout/${response.data.data.next}`);
        getQuestionDetail(response.data.data.next);
      } else {
        toast.success('Jawaban berhasil disimpan');
        finishModal();
      }
    } else {
      toast.error('Gagal menyimpan jawaban. Silakan coba lagi');
    }
  } catch (error) {
    console.error('Error saving answer:', error.response.data.meta.message);
    toast.error(error.response.data.meta.message +'.' + ' Gagal menyimpan jawaban.');
  }
};

const finishModal = () => {
  showConfirmationModal.value = true;
};

const cancelFinish = () => {
  showConfirmationModal.value = false;
  // reload
  getQuestionDetail(route.params.tryoutDetailsId);
};

const saveAndFinishTryout = async () => {
  
  try {
    // Mendapatkan tryoutDetailsId dari parameter rute
    const tryoutDetailsId = route.params.tryoutDetailsId;

    // Panggil endpoint untuk menyimpan jawaban
    if (!selectedAnswer.value) {
      toast.error('Pilih jawaban terlebih dahulu!');
      return;
    }

    const responseSave = await api.post(`/v1/tryout/${tryoutDetailsId}/answer`, {
      answer_id: selectedAnswer.value 
    });

    // mendapatkan data tryout_id dari responseSave
    const tryoutId = responseSave.data.data.tryout_id;

   

    if (responseSave.data.meta.code === 200) {
      toast.success('Jawaban berhasil disimpan');

      // Konfirmasi sebelum menyelesaikan tryout
      // const confirmFinish = confirm('Apakah Anda yakin ingin menyelesaikan tryout?');

      // if (confirmFinish) {
        // Panggil endpoint untuk menyelesaikan tryout dengan tryoutId yang diperoleh
        const responseFinish = await api.post(`/v1/tryout/${tryoutId}/finish`);

        if (responseFinish.data.meta.code === 200) {
          toast.success('Tryout berhasil diselesaikan');
          router.push('/member/my-tryout');
        // } else {
        //   toast.error('Gagal menyelesaikan tryout. Silakan coba lagi');
        // }
      } else {
        toast.info('Proses penyelesaian tryout dibatalkan.');
      }
    } else {
      toast.error('Gagal menyimpan jawaban. Silakan coba lagi');
    }
  } catch (error) {
    console.error('Error saving or finishing tryout:', error.response.data.meta.message);
    toast.error('Terjadi kesalahan saat menyimpan atau menyelesaikan tryout: ' + error.response.data.meta.message);
  }
};

const finishTryout = async () => {
  try {
    // get tryout_id from getquestionDetail
    const tryoutId = questionDetail.value.data.tryout_id;
    const response = await api.post(`/v1/tryout/${tryoutId}/finish`);
    if (response.data.meta.code === 200) {
      toast.success('Tryout berhasil diselesaikan');
      router.push('/member/my-tryout');
    } else {
      toast.error('Gagal menyelesaikan tryout. ' + response.data.meta.message);
    }
  } catch (error) {
    console.error('Error finishing tryout:', error);
    toast.error('Terjadi kesalahan saat menyimpan atau menyelesaikan tryout: ' + error.response.data.meta.message);
  }
};


onMounted(() => {
  const tryoutDetailsId = route.params.tryoutDetailsId;
  if (tryoutDetailsId) {
    getQuestionDetail(tryoutDetailsId);
  } else {
    console.log(route.params)
    toast.error('ID detail tryout tidak ditemukan di parameter URL');
  }
});
</script>

<template>
  <MemberLayouts>
    <div class="px-16 grid grid-cols-5 gap-10">
      <div class="flex flex-col space-y-7 col-span-3">
        <ol>
          <li class="list-decimal-1">
            <div class="flex items-center gap-4">
              <h2> Pertanyaan</h2>
              <img src="/public/arrow-circle-right.svg" class="-ml-2 w-6 rotate-90" />
            </div>

            <div v-if="questionDetail?.data?.image">
              <img :src="questionDetail?.data?.image" class="w-auto h-[300px] object-cover" />
            </div>

            <div v-html="questionDetail?.data?.question" class="question-content"></div>
            <div class="flex gap-4 items-center">
              <div class="flex flex-col space-y-3 pt-4">
                <div
                    v-for="(answer) in questionDetail?.data?.answers"
                    :key="answer.id"
                    class="group flex items-center justify-between rounded-full w-full border border-slate-600 p-[18px_20px] gap-[14px] transition-all duration-300 cursor-pointer"
                    :class="{
                        'border-[#EEEEEE]': selectedAnswer !== answer.id,
                        'border-2 border-[#0A090B] bg-secondary text-white': selectedAnswer === answer.id,
                        'hover:bg-secondary hover:text-white hover:border-none': selectedAnswer !== answer.id
                    }"
                    @click="selectedAnswer = answer.id"
                >
                <!-- {{ selectedAnswer === answer.id}} -->
                  <div class="flex items-center gap-[14px]">
                    <span class="font-semibold text-xl leading-[30px]">{{ answer.label }}.</span>
                    <span class="font-semibold text-xl leading-[30px]">{{ answer.text }}</span>
                  </div>
                  <!-- <div v-if="selectedAnswer === answer.id">
                    <img src="/public/tick-circle.svg" style="color: #22C55E;" />
                  </div> -->
                  <!-- <input
                    type="radio"
                    :name="`answer_${questionDetail?.data?.id}`"
                    :id="answer.id"
                    :value="answer.id"
                    v-model="selectedAnswer"
                    class="hidden"
                  /> -->
                </div>
                <!-- button simpan dan lanjutkan -->
             <button
             class="bg-primary text-white rounded-full py-4 px-4 hover:bg-secondary" 
             @click="saveAndNextQuestion" v-if="questionDetail?.data?.next !== null"
           >
             Simpan dan Lanjutkan
           </button>
            <button
              class="bg-secondary text-white rounded-full py-4 px-4 hover:bg-primary"
              @click="saveAndNextQuestion" v-else
            >
              Selesai dan Kirim Tryout
            </button>
              </div>
              
            </div>
          </li>
        </ol>
      </div>
      <div class="flex flex-col gap-3 w-[500px] ">
        <div
          class="bg-white drop-shadow-md flex flex-col space-y-5 px-10 py-5 rounded-lg"
        >
          <div class="flex justify-end">
            <div
              class="text-primary flex items-center gap-4 px-3 py-2 rounded-lg"
            >
              <img src="/countdown-blue.svg" />
              <p>{{ countdown }}</p>
            </div>
          </div>
          <div
            class="flex flex-wrap justify-start items-center gap-3 max-w-[440px]"
          >
            <button
              v-for="(number) in navigationData?.tryout_details"
              :key="number"
              :class="[
                'aspect-square',
                'w-[30px]',
                'h-[30px]',
                'rounded-md',
                'border',
                'border-[#90989F]',
                'text-xs',
                number.answer ? 'bg-green-500' : 'bg-transparent',
              ]"
              @click="goToQuestion(number.id)"
            >
              {{ number.question_number }}
            </button>
             
          </div>
          
        </div>
        <div
          class="w-fit bg-white drop-shadow-md flex flex-col space-y-5 px-10 py-5 rounded-lg"
        >
          <ul class="list-inside">
            <p>Informasi Pengerjaan Soal :</p>
            <li class="list-disc pl-2">
              Halaman Ranking ini selalu diupdate setiap ada peserta yang
              mengumpulkan pengerjaan paket soal, sehingga sewaktu waktu ranking
              kamu dapat berubah.
            </li>
          </ul>
          <div class="flex flex-col space-y-3">
            <p>Keterangan Warna :</p>
            <div class="w-full flex flex-wrap gap-12 text-sm">
              <div class="flex items-center gap-4">
                <img src="/done.svg" alt="done" class="w-5 h-5" />
                <p>Sudah Dikerjakan</p>
              </div>
              <!-- <div class="flex items-center gap-4">
                <img src="/wrong-indicator.svg" alt="done" class="w-5 h-5" />
                <p>Jawaban Salah</p>
              </div> -->
              <!-- <div class="flex items-center gap-4">
                <img src="/skip.svg" alt="done" class="w-5 h-5" />
                <p>Dilewati</p>
              </div> -->
              <div class="flex items-center gap-4">
                <img src="/blank.svg" alt="done" class="w-5 h-5" />
                <p>Belum diisi</p>
              </div>
            </div>
          </div>
        </div>
        <button
            class="bg-secondary text-white rounded-full py-4 px-4 hover:bg-primary"
            :class="{ 'opacity-50 cursor-not-allowed': questionDetail?.data?.unanswered_questions > 0 }"
            :disabled="questionDetail?.data?.unanswered_questions > 0"
            @click="finishModal"
            :title="questionDetail?.data?.unanswered_questions > 0 ? 'Jawaban kamu belum lengkap' : 'Kamu bisa kirim tryout'"
          >
            Selesai dan Kirim Tryout
          </button>
      </div>
    </div>
  </MemberLayouts>
  <div v-if="showConfirmationModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="modal-container bg-white rounded-lg shadow-xl max-w-sm">
      <div class="modal-header">
        <h2 class="text-lg font-semibold mb-4">Konfirmasi Penyelesaian Tryout</h2>
      </div>
      <div class="modal-body">
        <p class="mb-4 text-sm">Apakah Kamu yakin ingin menyelesaikan tryout?</p>
        <p class="mb-6 text-sm">Kamu tidak bisa mengubah jawaban setelah menyelesaikan tryout.</p>
      </div>
      <div class="modal-footer flex justify-end">
        <button @click="cancelFinish" class="mr-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400 hover:bg-gray-200">Batal</button>
        <button @click="finishTryout" class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Ya, Selesaikan</button>
      </div>
    </div>
  </div>
  
  
  
</template>

<style scoped>
.question-content {
  font-size: 24px; /* Ukuran font yang diinginkan */
  line-height: 1.5; /* Menyesuaikan tinggi baris jika diperlukan */
}

.question-content p {
  font-size: 24px; /* Ukuran font yang diinginkan */
  line-height: 1.5; /* Menyesuaikan tinggi baris jika diperlukan */
}

/* Modal Container */
.modal-container {
  padding: 32px; /* Lebih banyak padding */
}

/* Modal Header */
.modal-header {
  border-bottom: 1px solid #e5e5e5; /* Garis pemisah tipis */
  padding-bottom: 16px; /* Jarak antara judul dan isi */
}

/* Modal Body */
.modal-body {
  padding: 16px 0; /* Jarak antara isi dan tombol */
}

/* Tombol */
.modal-footer button {
  border-radius: 8px; /* Tombol lebih membulat */
  font-weight: 500; /* Sedikit lebih tebal */
}

</style>