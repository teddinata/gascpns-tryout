<script setup>
import MemberLayouts from "@/components/MemberLayouts.vue";
</script>

<template>
  <MemberLayouts>

  <!-- Alumni Stories -->
  <div class="mt-8">
    <h2 class="text-2xl font-semibold mb-4">Cerita Alumni</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 bg-gray-800 rounded-lg">
        <div class="flex items-center mb-2">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Alumni" class="w-10 h-10 rounded-full mr-3">
          <div>
            <h3 class="text-lg font-semibold">Mudiasti Adelia Pangastuti</h3>
            <p class="text-sm text-gray-400">PNS Cirebon</p>
            <div class="flex items-center mt-1">
              <span class="text-yellow-400">★★★★☆</span>
            </div>
          </div>
        </div>
        <p class="text-gray-300">Alhamdulillah, makasih banget yaa, fitur tryoutnya bener-bener ngebantu buat ngelatih, soal-soalnya terbaru dan saya ikut bimbelnya juga. Coachnya asik semua, cara ngajarnya pun bagus.</p>
      </div>
      <div class="p-4 bg-gray-800 rounded-lg">
        <div class="flex items-center mb-2">
          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Alumni" class="w-10 h-10 rounded-full mr-3">
          <div>
            <h3 class="text-lg font-semibold">Via</h3>
            <p class="text-sm text-gray-400">Member</p>
            <div class="flex items-center mt-1">
              <span class="text-yellow-400">★★★★☆</span>
            </div>
          </div>
        </div>
        <p class="text-gray-300">Makasi ayocpns, alhamdulillah bakalan dpt nilai segitu. Waktu ku tryout di aplikasi score 400, berkat giat try out alhamdulillah dapet PNS</p>
      </div>
    </div>
  </div>
  
  </MemberLayouts>
</template>