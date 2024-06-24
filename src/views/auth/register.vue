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
const isLoading = ref(false);

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
    isLoading.value = true;
    const userResponse = await store.dispatch("auth/register", userData.value);
    const user = userResponse.data.data.user;

    isLoading.value = false;

    localStorage.setItem('verificationEmail', user.email);
    localStorage.setItem('userId', user.id);

    router.push('/verify-otp');
  } catch (error) {
    isLoading.value = false;
    console.error("Registration failed:", error);
    if (error.meta && error.meta.code === 422 && error.data.errors) {
      for (const field in error.data.errors) {
        error.data.errors[field].forEach(errorMessage => {
          toast.error(errorMessage);
        });
      }
    } else {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full relative">
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

    <div class="md:w-2/5 min-h-screen bg-gradient-to-b from-primary to-secondary rounded-r-3xl hidden md:flex">
      <div class="flex flex-col justify-between items-center h-full pt-10">
        <img src="/logo-white.png" class="w-48 pb-20" />
        <div class="flex flex-col">
          <img src="/pramana-2.png" class="w-full transform" />
        </div>
      </div>
    </div>

    <div class="w-full md:w-3/5 h-full flex justify-center items-center py-12 md:py-24 px-4 md:px-0">
      <div class="flex flex-col space-y-4 w-full md:w-[400px]">
        <h1 class="text-text-primary font-bold text-[32px] md:text-[40px] text-center">Daftar Akun GASCPNS</h1>
        <form class="flex flex-col gap-5" @submit.prevent="register">
          <div class="flex flex-col gap-1">
            <label for="name" class="text-text-primary font-medium text-sm">Name<small class="text-xs text-[#ff4545]">*</small></label>
            <input type="text" v-model="userData.name" id="name" name="name" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Nama Anda" required />
          </div>
          <div class="flex flex-col gap-1">
            <label for="email" class="text-text-primary font-medium text-sm">Email<small class="text-xs text-[#ff4545]">*</small></label>
            <input type="email" v-model="userData.email" id="email" name="email" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Email Anda" required />
          </div>
          <div class="flex flex-col gap-1">
            <label for="username" class="text-text-primary font-medium text-sm">Username<small class="text-xs text-[#ff4545]">*</small></label>
            <input type="text" v-model="userData.username" id="username" name="username" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Username Anda" required />
          </div>
          <div class="flex flex-col gap-1">
            <label for="phone" class="text-text-primary font-medium text-sm">Phone<small class="text-xs text-[#ff4545]">*</small></label>
            <input type="tel" v-model="userData.phone" id="phone" name="phone" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan No HP Anda" required />
          </div>
          <div class="flex flex-col gap-1">
            <label for="birthdate" class="text-text-primary font-medium text-sm">Tanggal Lahir<small class="text-xs text-[#ff4545]">*</small></label>
            <input type="date" v-model="userData.birthdate" id="birthdate" name="birthdate" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Tanggal Lahir Anda" required />
          </div>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-text-primary font-medium text-sm">Password<small class="text-xs text-[#ff4545]">*</small></label>
            <div class="password-container">
              <input :type="showPassword ? 'text' : 'password'" v-model="userData.password" id="password" name="password" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Password Anda" minlength="8" required />
              <button type="button" class="password-toggle" @click="togglePassword">
                <Icon icon="ph:eye-light" class="text-xl" v-if="!showPassword" />
                <Icon icon="ph:eye-slash-light" class="text-xl" v-else />
              </button>
            </div>
            <div class="flex justify-end">
              <p class="text-sm text-text-tertiary">Must be at least 8 Characters.</p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="password_confirmation" class="text-text-primary font-medium text-sm">Confirm Password<small class="text-xs text-[#ff4545]">*</small></label>
            <div class="password-container">
              <input :type="showPasswordConfirmation ? 'text' : 'password'" v-model="userData.password_confirmation" id="password_confirmation" name="password_confirmation" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Password Anda" minlength="8" required />
              <button type="button" class="password-toggle" @click="togglePasswordConfirmation">
                <Icon icon="ph:eye-light" class="text-xl" v-if="!showPasswordConfirmation" />
                <Icon icon="ph:eye-slash-light" class="text-xl" v-else />
              </button>
            </div>
            <div class="flex justify-end">
              <p class="text-sm text-text-tertiary">Must be at least 8 Characters.</p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="referral_code" class="text-text-primary font-medium text-sm">Referral Code</label>
            <small class="text-xs text-text-tertiary">Optional</small>
            <input type="text" v-model="userData.referral_code" id="referral_code" name="referral_code" class="w-full px-4 py-2 md:px-6 md:py-3 border border-[#C7C9D9] rounded-xl" placeholder="Masukkan Kode Referral Anda" />
          </div>
          <button type="submit" class="bg-primary text-white w-full rounded-xl py-3">Daftar</button>
          <button class="bg-white drop-shadow-md w-full rounded-xl py-3">
            <router-link to="#" aria-label="Google Sign In" class="w-full flex justify-center items-center">
              <Icon icon="flat-color-icons:google" class="text-2xl" />
              <span class="ml-3">Sign up with Google</span>
            </router-link>
          </button>
          <div class="text-sm text-text-primary flex items-center gap-1 justify-center">
            <p>Apakah kamu sudah punya akun?</p>
            <router-link to="/login" class="text-primary underline cursor-pointer">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
/* Inside your style tag (or in your CSS file if not scoped) */
.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
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
