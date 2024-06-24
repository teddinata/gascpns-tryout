<template>
  <MemberLayouts>
    <section class="py-8">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500 w-full">
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


      <div v-else class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Pengaturan Akun</h2>
        
        <TabGroup>
          <TabList class="flex space-x-1 bg-blue-900/20 p-1 rounded-lg">
            <Tab
              as="button"
              :class="{ 'bg-primary text-white': tab === 'Informasi Akun', 'bg-white text-gray-800': tab !== 'Informasi Akun' }"
              class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
              @click="tab = 'Informasi Akun'"
            >
              Informasi Akun
            </Tab>
            <Tab
              as="button"
              :class="{ 'bg-primary text-white': tab === 'Keamanan', 'bg-white text-gray-800': tab !== 'Keamanan' }"
              class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
              @click="tab = 'Keamanan'"
            >
              Keamanan
            </Tab>
          </TabList>
          <TabPanels class="mt-6">
            <!-- Informasi Akun -->
            <TabPanel v-show="tab === 'Informasi Akun'" class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4">Informasi Akun</h3>
              <form @submit.prevent="updateAccountInfo" autocomplete="off">
                <div class="flex flex-col items-center justify-center mb-6">
                  <div class="relative">
                    <img
                      v-if="profileImageUrl"
                      :src="profileImageUrl"
                      alt="Profile Image"
                      class="w-32 h-32 rounded-full object-cover"
                    />
                    <div v-else class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <input
                      type="file"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileChange"
                    />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-700 mt-2">{{ user.name }}</h3>
                </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="mb-4">
                      <label class="block text-gray-700 mb-1">Email</label>
                      <input disabled type="email" v-model="accountInfo.email" class="w-full px-3 py-2 border rounded-lg" readonly autocomplete="off">
                    </div>
                    <div class="mb-4">
                      <label class="block text-gray-700 mb-1">Nama Lengkap</label>
                      <input type="text" v-model="accountInfo.name" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                    </div>
                    <div class="mb-4">
                      <label class="block text-gray-700 mb-1">Username</label>
                      <input type="text" v-model="accountInfo.username" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Nomor Telepon</label>
                    <input type="text" v-model="accountInfo.phone" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Tanggal Lahir</label>
                    <input type="date" v-model="accountInfo.birthdate" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                  <div class="mb-4 md:col-span-2">
                    <label class="block text-gray-700 mb-1">Alamat</label>
                    <input type="text" v-model="accountInfo.address" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Provinsi</label>
                    <v-select 
                      :options="provinces" 
                      label="name" 
                      v-model="accountInfo.province_id" 
                      @input="handleProvinceChange"
                      :reduce="province => province.id" 
                      placeholder="Pilih Provinsi" 
                      class="w-full px-3 py-2 border rounded-lg"
                      autocomplete="off"
                    ></v-select>
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Kabupaten</label>
                    <v-select 
                      :options="regencies" 
                      label="name" 
                      v-model="accountInfo.regency_id" 
                      @input="handleRegencyChange"
                      :reduce="regency => regency.id" 
                      placeholder="Pilih Kabupaten" 
                      class="w-full px-3 py-2 border rounded-lg"
                      :disabled="!accountInfo.province_id"
                      autocomplete="off"
                    ></v-select>
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Kecamatan</label>
                    <v-select 
                      :options="districts" 
                      label="name" 
                      v-model="accountInfo.district_id" 
                      @input="handleDistrictChange"
                      :reduce="district => district.id" 
                      placeholder="Pilih Kecamatan" 
                      class="w-full px-3 py-2 border rounded-lg"
                      :disabled="!accountInfo.regency_id"
                      autocomplete="off"
                    ></v-select>
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Kelurahan</label>
                    <v-select 
                      :options="villages" 
                      label="name" 
                      v-model="accountInfo.village_id" 
                      :reduce="village => village.id" 
                      placeholder="Pilih Kelurahan" 
                      class="w-full px-3 py-2 border rounded-lg"
                      :disabled="!accountInfo.district_id"
                      autocomplete="off"
                    ></v-select>
                  </div>
                </div>
                <div class="text-right">
                  <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg shadow">Simpan</button>
                </div>
              </form>
            </TabPanel>

            <!-- Keamanan -->
            <TabPanel v-show="tab === 'Keamanan'" class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4">Keamanan</h3>
              <form @submit.prevent="updatePassword" autocomplete="off">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="mb-4">
                    <label for="oldPassword" class="block text-gray-700 mb-1">Kata Sandi Lama</label>
                    <input type="password" 
                      name="old_password"
                      id="oldPassword"
                      v-model="securityInfo.oldPassword" 
                      class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                 
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="mb-4">
                    <label for="newPassword" class="block text-gray-700 mb-1">Kata Sandi Baru</label>
                    <input type="password" 
                      name="new_password"
                      id="newPassword"
                      v-model="securityInfo.newPassword" 
                      class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                  <div class="mb-4">
                    <label label="confirmPassword" class="block text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                    <input type="password" 
                      name="new_password_confirmation"
                      id="confirmPassword"
                      v-model="securityInfo.confirmPassword" 
                      class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                </div>
                <div class="text-right">
                  <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg shadow">Ganti Kata Sandi</button>
                </div>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>

      </div>
    </section>

    
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { useToast } from 'vue-toastification';
import axios from 'axios';

const store = useStore();
const user = store.state.auth.user;
const toast = useToast();

const tab = ref('Informasi Akun');

const accountInfo = ref({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  birthdate: user?.birthdate || '',
  address: user?.address || '',
  province_id: user?.province_id || null,
  regency_id: user?.regency_id || null,
  district_id: user?.district_id || null,
  village_id: user?.village_id || null,
  avatar: user?.avatar || null, // Tambahkan avatar di sini
});

const securityInfo = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const provinces = ref([]);
const regencies = ref([]);
const districts = ref([]);
const villages = ref([]);
const isLoading = ref(true);

const fetchAccountInfo = async () => {
  try {
    isLoading.value = true;
    await fetchProvinces();
    if (accountInfo.value.province_id) await fetchRegencies();
    if (accountInfo.value.regency_id) await fetchDistricts();
    if (accountInfo.value.district_id) await fetchVillages();
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to fetch account info:', error);
  }
};

const fetchProvinces = async () => {
  try {
    // const response = await api.get('/provinces');
    const response = await axios.get('https://teddinata.github.io/api-wilayah-indonesia/api/provinces.json');
    provinces.value = response.data;
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
  }
};

const fetchRegencies = async () => {
  try {
    // const response = await api.get(`/regencies/${accountInfo.value.province_id}`);
    const response = await axios.get(`https://teddinata.github.io/api-wilayah-indonesia/api/regencies/${accountInfo.value.province_id}.json`);
    regencies.value = response.data;
    districts.value = [];
    villages.value = [];
  } catch (error) {
    console.error('Failed to fetch regencies:', error);
  }
};

const fetchDistricts = async () => {
  try {
    // const response = await api.get(`/districts/${accountInfo.value.regency_id}`);
    const response = await axios.get(`https://teddinata.github.io/api-wilayah-indonesia/api/districts/${accountInfo.value.regency_id}.json`);
    districts.value = response.data;
    villages.value = [];
  } catch (error) {
    console.error('Failed to fetch districts:', error);
  }
};

const fetchVillages = async () => {
  try {
    // const response = await api.get(`/villages/${accountInfo.value.district_id}`);
    const response = await axios.get(`https://teddinata.github.io/api-wilayah-indonesia/api/villages/${accountInfo.value.district_id}.json`);
    villages.value = response.data;
  } catch (error) {
    console.error('Failed to fetch villages:', error);
  }
};

const updateAccountInfo = async () => {
  try {
    const formData = new FormData();
    formData.append('name', accountInfo.value.name);
    formData.append('phone', accountInfo.value.phone);
    formData.append('address', accountInfo.value.address);
    formData.append('birthdate', accountInfo.value.birthdate);

    // Only append if the value is not empty or null
    if (accountInfo.value.province_id) {
      formData.append('province_id', accountInfo.value.province_id);
    }
    if (accountInfo.value.regency_id) {
      formData.append('regency_id', accountInfo.value.regency_id);
    }
    if (accountInfo.value.district_id) {
      formData.append('district_id', accountInfo.value.district_id);
    }
    if (accountInfo.value.village_id) {
      formData.append('village_id', accountInfo.value.village_id);
    }
    
    if (accountInfo.value.avatar instanceof File) {
      formData.append('avatar', accountInfo.value.avatar);
    }

    isLoading.value = true;

    const response = await api.post('/v1/profile/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    isLoading.value = false;
    toast.success('Akun kamu berhasil diperbarui');
  } catch (error) {
    isLoading.value = false;
    toast.error('Gagal memperbarui akun');
    console.error('Failed to update account info:', error);
  }
};


const updatePassword = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/v1/profile/change-password', {
      old_password: securityInfo.value.oldPassword,
      new_password: securityInfo.value.newPassword,
      new_password_confirmation: securityInfo.value.confirmPassword,
    });

    if (response.data.meta.status === 'success') {
      toast.success('Password berhasil diubah');
    } else {
      toast.error('Gagal mengubah password');
      console.error('Failed to update password:', response.data.meta.message);
    }
    isLoading.value = false;
  } catch (error) {
    toast.error(error.response.data.data.old_password);
    console.error('Failed to update password:', error);
  }
};

const handleProvinceChange = async () => {
  accountInfo.value.regency_id = null;
  accountInfo.value.district_id = null;
  accountInfo.value.village_id = null;
  await fetchRegencies();
};

const handleRegencyChange = async () => {
  accountInfo.value.district_id = null;
  accountInfo.value.village_id = null;
  await fetchDistricts();
};

const handleDistrictChange = async () => {
  accountInfo.value.village_id = null;
  await fetchVillages();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    accountInfo.value.avatar = file;
  }
};

const profileImageUrl = computed(() => {
  if (accountInfo.value.avatar && !(accountInfo.value.avatar instanceof File)) {
    return accountInfo.value.avatar;
  } else if (accountInfo.value.avatar instanceof File) {
    return URL.createObjectURL(accountInfo.value.avatar);
  }
  return null;
});

onMounted(() => {
  fetchAccountInfo();
});

watch(() => accountInfo.value.province_id, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleProvinceChange();
  }
});

watch(() => accountInfo.value.regency_id, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleRegencyChange();
  }
});

watch(() => accountInfo.value.district_id, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleDistrictChange();
  }
});

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

.tab-item {
  @apply py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60;
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

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
}
</style>

