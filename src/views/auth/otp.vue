<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/api/Api.js';


const store = useStore();
const router = useRouter();
const toast = useToast();
const inputs = ref([]);
const email = ref('');
const otp = ref(['', '', '', '']);
const isLoading = ref(false);

// Fungsi untuk menangani input dan berpindah fokus
const handleInput = (e, index) => {
  if (e.target.value.length === 1 && index < inputs.value.length - 1) {
    inputs.value[index + 1].focus();
  }
};

// Fungsi untuk menangani keydown dan berpindah fokus ke input sebelumnya jika dihapus
const handleKeydown = (e, index) => {
  if (e.key === 'Backspace' && !e.target.value && index > 0) {
    inputs.value[index - 1].focus();
  }
};

// Fungsi untuk mengisi referensi input saat dirender
const setInputRef = (el, index) => {
  nextTick(() => {
    inputs.value[index] = el;
  });
};

const censoredEmail = computed(() => {
  if (email.value) {
    const [username, domain] = email.value.split('@');
    const censoredUsername = username.slice(0, 3) + '*'.repeat(username.length - 2);
    return `${censoredUsername}@${domain}`;
  } else {
    return ''; // Atau pesan default jika email tidak ada
  }
});

// Fungsi untuk mengirim OTP ke endpoint
// Di halaman verify-otp
const verifyOtp = async () => {
  try {
    isLoading.value = true;
    const otpValue = otp.value.join(''); // Gabungkan elemen array menjadi string

    const response = await store.dispatch("auth/verifyOtp", {
      email: email.value,
      otp: otpValue,
    });

    isLoading.value = false;
    
    // Periksa apakah response berisi wallet_balance
    const walletBalance = response?.data?.wallet_balance || 0;

    if (walletBalance > 0) {
      toast.success('Selamat! Anda mendapatkan saldo sebesar Rp. ' + formatRupiah(walletBalance) + ' dari kode referral. Anda dapat menggunakan saldo ini untuk bertransaksi');
    } else {
      toast.success('Registrasi berhasil! Selamat datang di platform kami. Silahkan top up saldo anda untuk mulai bertransaksi');
    }
    toast.success('Selamat! Akun kamu berhasil diverifikasi!');
    toast.success('Registrasi berhasil! Selamat datang di platform kami. 🙂');

    // Redirect ke halaman yang sesuai (dashboard, dll.)
    router.push('/member/dashboard');

    // Hapus data verifikasi dari localStorage (opsional)
    localStorage.removeItem('verificationEmail');
  } catch (error) {
    isLoading.value = false;
    console.error("Verification failed:", error);

    // Tampilkan pesan error dari respons API, atau pesan default jika tidak ada
    const errorMessage = error?.response?.data?.message || 'Terjadi kesalahan saat verifikasi OTP.';
    toast.error(errorMessage);
  }
};

// resend otp
const resendOtp = async () => {
  try {
    isLoading.value = true;
    const response = await api.post('/v1/otp/resend', {
      email: email.value,
    });

    isLoading.value = false;

    if (response.status === 200) {
      toast.success('Kode OTP berhasil dikirim ulang. Silakan cek email kamu.');
    }
  } catch (error) {
    isLoading.value = false;
    toast.error(error.response.data.data.message);
    // console.log(error);
  }
};

// change email
const changeEmail = () => {
  // remove email from localStorage
  localStorage.removeItem('verificationEmail');
  router.push('/register');
};

onMounted(() => {
  // Ambil data dari sessionStorage
  email.value = localStorage.getItem('verificationEmail');
});

</script>



<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full relative">

    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 z-50">
      <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
        <div class="wheel"></div>
        <div class="hamster">
          <div class="hamster__body">
            <div class="hamster__head">
              <div class="hamster__ear"></div>
              <div class="hamster__eye"></div>
              <div class="hamster__nose"></div>
            </div>
            <div class="hamster__limb hamster__limb--fr"></div>
            <div class="hamster__limb hamster__limb--fl"></div>
            <div class="hamster__limb hamster__limb--br"></div>
            <div class="hamster__limb hamster__limb--bl"></div>
            <div class="hamster__tail"></div>
          </div>
        </div>
        <div class="spoke"></div>
      </div>
    </div>

    <div class="md:w-2/5 min-h-screen bg-gradient-to-b from-primary to-secondary rounded-r-3xl hidden md:flex">
      <div class="flex flex-col justify-between items-center h-full pt-10">
        <img src="/logo-white.png" class="w-48 pb-20" />
        <div class="flex flex-col h-full">
          <img src="/pramana-2.png" class="w-full transform" />
        </div>
      </div>
    </div>

    <div class="w-full md:w-3/5 h-full flex justify-center items-center py-12 md:py-24 px-4 md:px-0">
      <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div class="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div class="flex flex-col items-center justify-center text-center space-y-2">
            <div class="font-semibold text-[32px] md:text-[40px]">
              <p>Verifikasi Akun</p>
            </div>
            <div class="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {{ censoredEmail }}</p>
            </div>
          </div>
          <div>
            <form @submit.prevent="verifyOtp">
              <div class="flex flex-col space-y-16">
                <div class="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <div v-for="(digit, index) in otp" :key="index" class="w-16 h-16">
                    <input
                      class="w-full h-full flex flex-col items-center justify-center text-center px-2 md:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      v-model="otp[index]" type="text" maxlength="1" 
                      @input="handleInput($event, index)"
                      @keydown="handleKeydown($event, index)"
                      :ref="el => setInputRef(el, index)"
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div class="flex flex-col space-y-5">
                  <div>
                    <button
                      type="submit"
                      class="bg-primary text-white w-full rounded-xl py-3"
                    >
                      Verification Account
                    </button>
                  </div>
                  <div class="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Tidak menerima kode?</p>
                    <button
                      type="button"
                      @click="resendOtp"
                      class="text-primary font-semibold"
                    >
                      Kirim Ulang Kode
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#wifi-loader {
  --background: #62abff;
  --front-color: #0BA7E3;
  --back-color: #c3c8de;
  --text-color: #414856;
  width: 64px;
  height: 64px;
  border-radius: 50px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

#wifi-loader svg {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

#wifi-loader svg circle {
  position: absolute;
  fill: none;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: rotate(-100deg);
  transform-origin: center;
}

#wifi-loader svg circle.back {
  stroke: var(--back-color);
}

#wifi-loader svg circle.front {
  stroke: var(--front-color);
}

#wifi-loader svg.circle-outer {
  height: 86px;
  width: 86px;
}

#wifi-loader svg.circle-outer circle {
  stroke-dasharray: 62.75 188.25;
}

#wifi-loader svg.circle-outer circle.back {
  animation: circle-outer135 1.8s ease infinite 0.3s;
}

#wifi-loader svg.circle-outer circle.front {
  animation: circle-outer135 1.8s ease infinite 0.15s;
}

#wifi-loader svg.circle-middle {
  height: 60px;
  width: 60px;
}

#wifi-loader svg.circle-middle circle {
  stroke-dasharray: 42.5 127.5;
}

#wifi-loader svg.circle-middle circle.back {
  animation: circle-middle6123 1.8s ease infinite 0.25s;
}

#wifi-loader svg.circle-middle circle.front {
  animation: circle-middle6123 1.8s ease infinite 0.1s;
}

#wifi-loader svg.circle-inner {
  height: 34px;
  width: 34px;
}

#wifi-loader svg.circle-inner circle {
  stroke-dasharray: 22 66;
}

#wifi-loader svg.circle-inner circle.back {
  animation: circle-inner162 1.8s ease infinite 0.2s;
}

#wifi-loader svg.circle-inner circle.front {
  animation: circle-inner162 1.8s ease infinite 0.05s;
}

#wifi-loader .text {
  position: absolute;
  bottom: -40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: lowercase;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.2px;
}

#wifi-loader .text::before, #wifi-loader .text::after {
  content: attr(data-text);
}

#wifi-loader .text::before {
  color: var(--text-color);
}

#wifi-loader .text::after {
  color: var(--front-color);
  animation: text-animation76 3.6s ease infinite;
  position: absolute;
  left: 0;
}

@keyframes circle-outer135 {
  0% {
    stroke-dashoffset: 25;
  }

  25% {
    stroke-dashoffset: 0;
  }

  65% {
    stroke-dashoffset: 301;
  }

  80% {
    stroke-dashoffset: 276;
  }

  100% {
    stroke-dashoffset: 276;
  }
}

@keyframes circle-middle6123 {
  0% {
    stroke-dashoffset: 17;
  }

  25% {
    stroke-dashoffset: 0;
  }

  65% {
    stroke-dashoffset: 204;
  }

  80% {
    stroke-dashoffset: 187;
  }

  100% {
    stroke-dashoffset: 187;
  }
}

@keyframes circle-inner162 {
  0% {
    stroke-dashoffset: 9;
  }

  25% {
    stroke-dashoffset: 0;
  }

  65% {
    stroke-dashoffset: 106;
  }

  80% {
    stroke-dashoffset: 97;
  }

  100% {
    stroke-dashoffset: 97;
  }
}

@keyframes text-animation76 {
  0% {
    clip-path: inset(0 100% 0 0);
  }

  50% {
    clip-path: inset(0);
  }

  100% {
    clip-path: inset(0 0 0 100%);
  }
}

.wheel-and-hamster {
  --dur: 1s;
  position: relative;
  width: 12em;
  height: 12em;
  font-size: 14px;
}

.wheel,
.hamster,
.hamster div,
.spoke {
  position: absolute;
}

.wheel,
.spoke {
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wheel {
  background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
  z-index: 2;
}

.hamster {
  animation: hamster var(--dur) ease-in-out infinite;
  top: 50%;
  left: calc(50% - 3.5em);
  width: 7em;
  height: 3.75em;
  transform: rotate(4deg) translate(-0.8em,1.85em);
  transform-origin: 50% 0;
  z-index: 1;
}

.hamster__head {
  animation: hamsterHead var(--dur) ease-in-out infinite;
  background: hsl(30,90%,55%);
  border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
  box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
		0.75em -1.55em 0 hsl(30,90%,90%) inset;
  top: 0;
  left: -2em;
  width: 2.75em;
  height: 2.5em;
  transform-origin: 100% 50%;
}

.hamster__ear {
  animation: hamsterEar var(--dur) ease-in-out infinite;
  background: hsl(0,90%,85%);
  border-radius: 50%;
  box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
  top: -0.25em;
  right: -0.25em;
  width: 0.75em;
  height: 0.75em;
  transform-origin: 50% 75%;
}

.hamster__eye {
  animation: hamsterEye var(--dur) linear infinite;
  background-color: hsl(0,0%,0%);
  border-radius: 50%;
  top: 0.375em;
  left: 1.25em;
  width: 0.5em;
  height: 0.5em;
}

.hamster__nose {
  background: hsl(0,90%,75%);
  border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
  top: 0.75em;
  left: 0;
  width: 0.2em;
  height: 0.25em;
}

.hamster__body {
  animation: hamsterBody var(--dur) ease-in-out infinite;
  background: hsl(30,90%,90%);
  border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
  box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
		0.15em -0.5em 0 hsl(30,90%,80%) inset;
  top: 0.25em;
  left: 2em;
  width: 4.5em;
  height: 3em;
  transform-origin: 17% 50%;
  transform-style: preserve-3d;
}

.hamster__limb--fr,
.hamster__limb--fl {
  clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
  top: 2em;
  left: 0.5em;
  width: 1em;
  height: 1.5em;
  transform-origin: 50% 0;
}

.hamster__limb--fr {
  animation: hamsterFRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
  transform: rotate(15deg) translateZ(-1px);
}

.hamster__limb--fl {
  animation: hamsterFLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
  transform: rotate(15deg);
}

.hamster__limb--br,
.hamster__limb--bl {
  border-radius: 0.75em 0.75em 0 0;
  clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
  top: 1em;
  left: 2.8em;
  width: 1.5em;
  height: 2.5em;
  transform-origin: 50% 30%;
}

.hamster__limb--br {
  animation: hamsterBRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
  transform: rotate(-25deg) translateZ(-1px);
}

.hamster__limb--bl {
  animation: hamsterBLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
  transform: rotate(-25deg);
}

.hamster__tail {
  animation: hamsterTail var(--dur) linear infinite;
  background: hsl(0,90%,85%);
  border-radius: 0.25em 50% 50% 0.25em;
  box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
  top: 1.5em;
  right: -0.5em;
  width: 1em;
  height: 0.5em;
  transform: rotate(30deg) translateZ(-1px);
  transform-origin: 0.25em 0.25em;
}

.spoke {
  animation: spoke var(--dur) linear infinite;
  background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
		linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
}

/* Animations */
@keyframes hamster {
  from, to {
    transform: rotate(4deg) translate(-0.8em,1.85em);
  }

  50% {
    transform: rotate(0) translate(-0.8em,1.85em);
  }
}

@keyframes hamsterHead {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(8deg);
  }
}

@keyframes hamsterEye {
  from, 90%, to {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0);
  }
}

@keyframes hamsterEar {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(12deg);
  }
}

@keyframes hamsterBody {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-2deg);
  }
}

@keyframes hamsterFRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(50deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-30deg) translateZ(-1px);
  }
}

@keyframes hamsterFLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-30deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(50deg);
  }
}

@keyframes hamsterBRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-60deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(20deg) translateZ(-1px);
  }
}

@keyframes hamsterBLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(20deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-60deg);
  }
}

@keyframes hamsterTail {
  from, 25%, 50%, 75%, to {
    transform: rotate(30deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(10deg) translateZ(-1px);
  }
}

@keyframes spoke {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-1turn);
  }
}
 
</style>
