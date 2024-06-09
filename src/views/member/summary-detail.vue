<!-- eslint-disable vue/multi-word-component-names -->
<!-- <script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/api/Api.js';

const store = useStore();
const router = useRouter();
const toast = useToast();

const currentTryoutId = ref(null);
const isLoading = ref(false);
const navigationData = ref(null);

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


const getNavigationData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/v1/tryout/50/navigate`);
    navigationData.value = response.data;
    startCountdown(response.data.data.finished_at);
  } catch (error) {
    console.error('Error getting question data:', error);
    toast.error('Gagal mendapatkan data soal');
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

onMounted(() => {
  getNavigationData();
});
</script> -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/Api.js';
import MemberLayouts from "@/components/MemberLayouts.vue";

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
    const response = await api.get(`/v1/tryout/summary/${tryoutDetailsId}`);
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

const timeTaken = computed(() => {
  if (questionDetail.value?.data?.start_time && questionDetail.value?.data?.end_time) {
    const createdAt = new Date(questionDetail.value.data.start_time);
    const updatedAt = new Date(questionDetail.value.data.end_time);
    const diffInSeconds = (updatedAt - createdAt) / 1000;
    const diffInMinutes = diffInSeconds / 60;

    // Return time in minutes if more than a minute, otherwise return in seconds
    return diffInMinutes >= 1 ? `${Math.floor(diffInMinutes)} menit` : `${Math.floor(diffInSeconds)} detik`;
  }
  return '0 detik';
});

const goToQuestion = (tryoutDetailsId) => {
  router.push(`/member/tryout/summary/${tryoutDetailsId}`);
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
            <div class="flex items-center mt-4 mb-4 gap-4">
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
                  class="flex items-center gap-2 radio-answer">
                  <input
                    type="radio"
                    disabled
                    :id="answer.id"
                    name="answer"
                    v-model="selectedAnswer"
                    :value="answer.id"
                    class="w-0 h-0 opacity-0"
                  />
                  <label :for="answer.id" class="radio-label flex items-center gap-4 text-lg">
                    <span class="radio-button gap-2"></span>
                    {{ answer.label }}. {{ answer.text }}
                  </label>
                  <img v-if="answer.score === 5" src="/true.svg" alt="true answer" />
                  <img v-else src="/wrong.svg" alt="wrong answer" />
                </div>
              </div>
              <!-- <div class="flex flex-col space-y-[14px] pt-4">
                <img src="/wrong.svg" alt="wrong answer" />
                <img src="/wrong.svg" alt="wrong answer" />
                <img src="/wrong.svg" alt="wrong answer" />
                <img src="/true.svg" alt="true answer" />
                <img src="/wrong.svg" alt="wrong answer" />
              </div> -->
            </div>
          </li>

          <div class="flex items-center mt-14 mb-4 gap-4">
            <h2> Pembahasan</h2>
            <img src="/public/arrow-circle-right.svg" class="-ml-2 w-6 rotate-90" />
          </div>
          <div class="explanation-container bg-gray-300 p-4 rounded-lg">
            <div v-html="questionDetail?.data?.questions?.explanation" class="question-content" 
              style="line-height: 1.6; letter-spacing: 0.5px; font-size: 16px;"></div>
          </div>
        </ol>
      </div>
      <div class="flex flex-col gap-3 w-[500px]">
        <div
          class="bg-white drop-shadow-md flex flex-col space-y-5 px-10 py-5"
        >
          <div class="flex justify-center">

            <div class="flex items-center gap-6">
              <div class="rounded-lg bg-gray-100 p-2">
                <div class="flex items-center gap-1">
                  <img src="/true.svg" class="w-4 h-4" />
                  <span class="text-lg font-semibold">{{ questionDetail?.data?.is_correct }}</span>
                </div>
                <span>Benar</span>
              </div>
              <div class="rounded-lg bg-gray-100 p-2">
                <div class="flex items-center gap-1">
                  <img src="/wrong.svg" class="w-4 h-4" />
                  <span class="text-lg font-semibold">{{ questionDetail?.data?.is_false }}</span>
                </div>
                <span>Salah</span>
              </div>
              <div class="rounded-lg bg-gray-100 p-2">
                <div class="flex items-center gap-1">
                  <img src="/blank.svg" class="w-4 h-4" />
                  <span class="text-lg font-semibold">{{ questionDetail?.data?.is_blank }}</span>
                </div>
                <span>Kosong</span>
              </div>
            </div>
            
            

            <!-- <div
              class="text-primary flex items-center gap-4 px-3 py-2 rounded-lg"
            >
              <img src="/countdown-blue.svg" />
              <p>{{ countdown }}</p>
            </div> -->
          </div>
          <!-- divider -->
          <div class="border-b border-[#E0E0E0]"></div>

          <div class="mt-4">
            Kamu mengerjakan soal ini selama <strong>{{ timeTaken }}</strong>
          </div>

          <div class="border-b border-[#E0E0E0]"></div>
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
                number.score === 5 ? 'bg-[#22C55E] text-white' : 'bg-[#F90A0A] text-white',
                number.id === questionDetail?.data?.id ? 'border-4 border-black' : ''
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
            <p>Informasi Rangkuman Tryout</p>
            <li class="list-disc pl-2">
              Halaman ini berisi rangkuman jawaban yang telah kamu pilih pada setiap soal tryout.
            </li>
          </ul>
          <div class="flex flex-col space-y-3">
            <p>Keterangan Warna :</p>
            <div class="w-full flex flex-wrap gap-12 text-sm">
              <div class="flex items-center gap-4">
                <img src="/done.svg" alt="done" class="w-5 h-5" />
                <p>Sudah Dikerjakan</p>
              </div>
              <div class="flex items-center gap-4">
                <img src="/wrong-indicator.svg" alt="done" class="w-5 h-5" />
                <p>Jawaban Salah</p>
              </div>
              <!-- <div class="flex items-center gap-4">
                <img src="/skip.svg" alt="done" class="w-5 h-5" />
                <p>Dilewati</p>
              </div> -->
              <!-- <div class="flex items-center gap-4">
                <img src="/blank.svg" alt="done" class="w-5 h-5" />
                <p>Belum diisi</p>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<style scoped>
.radio-label {
  position: relative;
  cursor: pointer;
}

.radio-button {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid #0BA7E3;
}

input[type="radio"]:checked + .radio-label .radio-button {
  background-color: #0BA7E3;
}
</style>