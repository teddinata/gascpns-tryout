<template>
  <MemberLayouts>
    <section class="py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Pengaturan Akun</h2>
        <TabGroup>
          <TabList class="flex space-x-1 bg-blue-900/20 p-1 rounded-lg">
            <Tab
              as="button"
              :class="tab === 'Informasi Akun' ? 'bg-white shadow' : ''"
              class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
              @click="tab = 'Informasi Akun'"
            >
              Informasi Akun
            </Tab>
            <Tab
              as="button"
              :class="tab === 'Keamanan' ? 'bg-white shadow' : ''"
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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" v-model="accountInfo.name" class="w-full px-3 py-2 border rounded-lg" autocomplete="off">
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 mb-1">Email</label>
                    <input type="email" v-model="accountInfo.email" class="w-full px-3 py-2 border rounded-lg" readonly autocomplete="off">
                  </div>
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
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import MemberLayouts from "@/components/MemberLayouts.vue";
import api from '@/api/Api.js';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { useToast } from 'vue-toastification';

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

const fetchAccountInfo = async () => {
  try {
    await fetchProvinces();
    if (accountInfo.value.province_id) await fetchRegencies();
    if (accountInfo.value.regency_id) await fetchDistricts();
    if (accountInfo.value.district_id) await fetchVillages();
  } catch (error) {
    console.error('Failed to fetch account info:', error);
  }
};

const fetchProvinces = async () => {
  try {
    const response = await api.get('/provinces');
    provinces.value = response.data;
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
  }
};

const fetchRegencies = async () => {
  try {
    const response = await api.get(`/regencies/${accountInfo.value.province_id}`);
    regencies.value = response.data;
    districts.value = [];
    villages.value = [];
  } catch (error) {
    console.error('Failed to fetch regencies:', error);
  }
};

const fetchDistricts = async () => {
  try {
    const response = await api.get(`/districts/${accountInfo.value.regency_id}`);
    districts.value = response.data;
    villages.value = [];
  } catch (error) {
    console.error('Failed to fetch districts:', error);
  }
};

const fetchVillages = async () => {
  try {
    const response = await api.get(`/villages/${accountInfo.value.district_id}`);
    villages.value = response.data;
  } catch (error) {
    console.error('Failed to fetch villages:', error);
  }
};

const updateAccountInfo = async () => {
  try {
    const response = await api.post('/v1/profile/edit', accountInfo.value);
    toast.success('Akun kamu berhasil diperbarui');
  } catch (error) {
    toast.error('Gagal memperbarui akun');
    console.error('Failed to update account info:', error);
  }
};

const updatePassword = async () => {
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
</style>
