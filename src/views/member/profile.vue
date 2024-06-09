<template>
  <MemberLayouts>
    <div class="container mx-auto p-6">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-6">Edit Profile</h2>
        <div class="flex flex-col md:flex-row md:space-x-6">
          <div class="flex-1 mb-4 md:mb-0">
            <div class="bg-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <span class="text-gray-600">Change</span>
            </div>
          </div>
          <div class="flex-1">
            <form @submit.prevent="updateProfile">
              <div class="mb-4">
                <label class="block text-gray-700">Nama Lengkap</label>
                <input type="text" v-model="profile.name" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Email</label>
                <input type="email" v-model="profile.email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" disabled />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Jenis Kelamin</label>
                <select v-model="profile.gender" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Tanggal Lahir</label>
                <input type="date" v-model="profile.birthDate" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">No. HP</label>
                <input type="text" v-model="profile.phone" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">No. WhatsApp</label>
                <input type="text" v-model="profile.whatsapp" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Instansi</label>
                <input type="text" v-model="profile.organization" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Provinsi</label>
                <input type="text" v-model="profile.province" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Kota</label>
                <input type="text" v-model="profile.city" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <button type="submit" class="bg-blue-500 text-white rounded-md px-4 py-2">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>

<script setup>
import { ref } from 'vue'
import MemberLayouts from '@/components/MemberLayouts.vue'

const profile = ref({
  name: 'Teddinata Kusuma',
  email: 'teddinataa@gmail.com',
  gender: 'Laki-laki',
  birthDate: '1998-05-31',
  phone: '085155095022',
  whatsapp: '085155095022',
  organization: 'Kementerian Komunikasi dan Informatika',
  province: 'JAWA TENGAH',
  city: 'KABUPATEN CILACAP'
})

const updateProfile = () => {
  console.log('Profile updated', profile)
  // Add your API call here to update the profile
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
