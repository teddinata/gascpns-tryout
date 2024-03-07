<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { Icon } from "@iconify/vue";
</script>
<template>
  <div class="flex flex-row min-h-screen w-full">
    <div
      class="w-2/5 min-h-screen bg-gradient-to-b from-primary to-secondary rounded-r-3xl"
    >
      <div class="flex flex-col justify-between items-center h-full pt-10">
        <div class="flex flex-col justify-start items-start">
          <img src="/logo-white.png" class="w-48" />
          <img src="/register-image.png" class="w-96" />
        </div>
      </div>
    </div>
    <div class="w-3/5 h-full">
      <div class="w-full flex justify-center py-24">
        <div class="flex flex-col space-y-4 w-[400px]">
          <h1 class="text-text-primary font-bold text-[40px] text-center">
            Register
          </h1>
          <form class="flex flex-col gap-5">
            <div class="flex flex-col gap-1">
              <label for="name" class="text-text-primary font-medium text-sm"
                >Name*</label
              >
              <input
                type="text"
                id="name"
                name="name"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Nama Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="email" class="text-text-primary font-medium text-sm"
                >Email*</label
              >
              <input
                type="email"
                id="email"
                name="email"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Email Anda"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <label
                for="password"
                class="text-text-primary font-medium text-sm"
                >Password*</label
              >
              <input
                type="password"
                id="password"
                name="password"
                class="w-full px-6 py-3 border border-[#C7C9D9] rounded-xl"
                placeholder="Masukkan Password Anda"
                minlength="8"
                required
              />
              <div class="flex justify-end">
                <p class="text-sm text-text-tertiary">
                  Must be at least 8 Characters.
                </p>
              </div>
            </div>
            <button
              type="submit"
              class="bg-primary text-white w-full rounded-xl py-3"
            >
              Daftar
            </button>
            <button class="bg-white drop-shadow-md w-full rounded-xl py-3">
              <route-link
                to="#"
                aria-lable="Google Sign In"
                class="w-full flex justify-center items-center"
              >
                <Icon icon="flat-color-icons:google" class="text-2xl" />
                <span class="ml-3">Sign up with Google</span>
              </route-link>
            </button>
            <div
              class="text-sm text-text-primary flex items-center gap-1 justify-center"
            >
              <p>Apakah kamu sudah punya akun?</p>

              <route-link to="#" class="text-primary underline cursor-pointer"
                >Masuk</route-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
