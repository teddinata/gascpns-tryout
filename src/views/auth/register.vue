<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification';
import { formatRupiah } from "@/filters";

const store = useStore();
const router = useRouter();
const toast = useToast();
const isLoading = ref(false); // Menambahkan state untuk loading

const userData = ref({
  name: "",
  email: "",
  username: "",
  phone: "",
  password: "",
  password_confirmation: "",
  referral_code: "",
  birthdate: "",
});

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordConfirmation = () => {
  showPasswordConfirmation.value = !showPasswordConfirmation.value;
};

const register = async () => {
  try {
    isLoading.value = true; // Set isLoading menjadi true
    const userResponse = await store.dispatch("auth/register", userData.value);
    // console.log('User response:', userResponse);
    const user = userResponse.data.data.user; // Ambil data user dari respons API

    isLoading.value = false; // Set isLoading menjadi false

    // Simpan data yang diperlukan ke sessionStorage 
    localStorage.setItem('verificationEmail', user.email);
    localStorage.setItem('userId', user.id); // Jika Anda memerlukan ID pengguna di backend

    // Redirect ke halaman verifikasi
    router.push('/verify-otp');

    // Redirect to the appropriate page based on user role.
    // router.push(
    //   store.getters["auth/isAdmin"] ? "/admin/dashboard" : "/member/dashboard"
    // );
    // get response data from store and show toast with conditional message
    // if (user.wallet_balance > 0) {
    //   toast.success('Selamat! Anda mendapatkan saldo sebesar Rp. ' +  formatRupiah(user.wallet_balance) + ' dari kode referral. Anda dapat menggunakan saldo ini untuk bertransaksi');
    // } else {
    //   toast.success('Registrasi berhasil! Selamat datang di platform kami. Silahkan top up saldo anda untuk mulai bertransaksi');
    // }
    // toast.success('Registrasi berhasil! Selamat datang di platform kami. 🙂');
  } catch (error) {
    isLoading.value = false; // Set isLoading menjadi false
    console.error("Registration failed:", error);
    // Penanganan error validasi (422)
    if (error.meta && error.meta.code === 422 && error.data.errors) { 
      for (const field in error.data.errors) { // Perhatikan, akses error.data.errors
        error.data.errors[field].forEach(errorMessage => {
          toast.error(errorMessage);
        });
      }
    } else {
      // Penanganan error lainnya
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  }
};
</script>



<template>
  <div class="flex flex-row min-h-screen w-full relative">

    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
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

    <div
      class="w-2/5 min-h-screen bg-gradient-to-b from-primary to-secondary rounded-r-3xl"
    >
      <div class="flex flex-col justify-between items-center h-full pt-10">
        <img src="/logo-white.png" class="w-48 pb-20" />
        <div class="flex flex-col h-full">
          <img src="/pramana-2.png" 
            class="w-full transform" />
        </div>
      </div>
    </div>
    <div class="w-3/5 h-full">
      <div class="w-full flex justify-center py-24">
        <div class="flex flex-col space-y-4 w-[400px]">
          <h1 class="text-text-primary font-bold text-[40px] text-center">
            Register
          </h1>
          <form class="flex flex-col gap-5" @submit.prevent="register">
            <div class="flex flex-col gap-1">
              <label for="name" class="text-text-primary font-medium text-sm"
                >Name
                <small class="text-xs text-[#ff4545]">*</small>
                </label
              >
              <input
                type="text"
                v-model="userData.name"
                id="name"
                name="name"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Nama Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="email" class="text-text-primary font-medium text-sm"
                >Email
                <small class="text-xs text-[#ff4545]">*</small>
                </label
              >
              <input
                type="email"
                v-model="userData.email"
                id="email"
                name="email"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Email Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label
                for="username"
                class="text-text-primary font-medium text-sm"
                >Username
                <small class="text-xs text-[#ff4545]">*</small>
                </label
                >
              <input
                type="text"
                v-model="userData.username"
                id="username"
                name="username"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Username Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="phone" class="text-text-primary font-medium text-sm"
                >Phone
                <small class="text-xs text-[#ff4545]">*</small>
              </label
              >
              <input
                type="tel"
                v-model="userData.phone"
                id="phone"
                name="phone"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan No HP Anda"
                required
              />
            </div>
            
            <!-- birth date -->
            <div class="flex flex-col gap-1">
              <label for="birthdate" class="text-text-primary font-medium text-sm"
              >Tanggal Lahir
              <small class="text-xs text-[#ff4545]">*</small>
            </label>
              
              <input
                type="date"
                v-model="userData.birthdate"
                id="birthdate"
                name="birthdate"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Tanggal Lahir Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label
                for="password"
                class="text-text-primary font-medium text-sm"
                >Password
                <small class="text-xs text-[#ff4545]">*</small>
                
                </label
              >
              <div class="password-container">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="userData.password"
                  id="password"
                  name="password"
                  class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                  placeholder="Masukkan Password Anda"
                  minlength="8"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePassword"
                >
                  <Icon
                    icon="ph:eye-light"
                    class="text-xl"
                    v-if="!showPassword"
                  />
                  <Icon icon="ph:eye-slash-light" class="text-xl" v-else />
                </button>
              </div>

              <div class="flex justify-end">
                <p class="text-sm text-text-tertiary">
                  Must be at least 8 Characters.
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label
                for="password"
                class="text-text-primary font-medium text-sm"
                >Confirm Password
                <small class="text-xs text-[#ff4545]">*</small>
                </label
              >
              <div class="password-container">
                <input
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  v-model="userData.password_confirmation"
                  id="password_confirmation"
                  name="password"
                  class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                  placeholder="Masukkan Password Anda"
                  minlength="8"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePasswordConfirmation"
                >
                  <Icon
                    icon="ph:eye-light"
                    class="text-xl"
                    v-if="!showPasswordConfirmation"
                  />
                  <Icon icon="ph:eye-slash-light" class="text-xl" v-else />
                </button>
              </div>
              <div class="flex justify-end">
                <p class="text-sm text-text-tertiary">
                  Must be at least 8 Characters.
                </p>
              </div>
            </div>

            <!-- referral code -->
            <div class="flex flex-col gap-1">
              <label for="phone" class="text-text-primary font-medium text-sm"
                >Referral Code</label>
              <small class="text-xs text-text-tertiary">Optional</small>
              <input
                type="tel"
                v-model="userData.referral_code"
                id="referral_code"
                name="referral_code"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Kode Referral Anda"
              />
            </div>
            <button
              type="submit"
              class="bg-primary text-white w-full rounded-xl py-3"
            >
              Daftar
            </button>
            <button class="bg-white drop-shadow-md w-full rounded-xl py-3">
              <router-link
                to="#"
                aria-lable="Google Sign In"
                class="w-full flex justify-center items-center"
              >
                <Icon icon="flat-color-icons:google" class="text-2xl" />
                <span class="ml-3">Sign up with Google</span>
              </router-link>
            </button>
            <div
              class="text-sm text-text-primary flex items-center gap-1 justify-center"
            >
              <p>Apakah kamu sudah punya akun?</p>
              <router-link
                to="/login"
                class="text-primary underline cursor-pointer"
                >Login</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Inside your style tag (or in your CSS file if not scoped) */
.password-container {
  /* We'll use a wrapper to help position */
  position: relative; /* Establish a relative positioning context */
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer; /* Indicate that the button is clickable */
}

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