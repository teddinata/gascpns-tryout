<template>
  <MemberLayouts>
    <div v-if="transaction" class="w-[900px] mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2">Invoice #{{ transaction.invoice_code }}</h2>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h5 class="font-semibold">Informasi Siswa</h5>
          <p>Nama: {{ transaction.student.name }}</p>
          <p>ID Siswa: {{ transaction.student_id }}</p>
          <p>Email: {{ transaction.student.email }}</p>
          <p>Nomor HP: {{ transaction.student.phone }}</p>
          <p>Usia: {{ transaction.student.age }}</p>
        </div>
        <div class="text-right">
          <h5 class="font-semibold">Detail Transaksi</h5>
          <p>Tanggal: {{ formatDate(transaction.created_at) }}</p>
          <p>Tanggal Pembayaran: {{ formatDate(transaction.payment_date) }}</p>
          <p>
            Status:
            <span :class="getStatusClass(transaction.payment_status)">
              {{ getPaymentStatusText(transaction.payment_status) }}
            </span>
          </p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-6 text-left">Nama Paket</th>
              <th class="py-3 px-6 text-center">Kuantitas</th>
              <th class="py-3 px-6 text-center">Harga</th>
              <th class="py-3 px-6 text-center">Harga Asli</th>
              <th class="py-3 px-6 text-center">Total</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="detail in transaction.details" :key="detail.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 text-left whitespace-nowrap">{{ detail.package_name }}</td>
              <td class="py-3 px-6 text-center">{{ detail.quantity }}</td>
              <td class="py-3 px-6 text-center">Rp {{ formatCurrency(detail.price) }}</td>
              <td class="py-3 px-6 text-center">Rp {{ formatCurrency(detail.original_price) }}</td>
              <td class="py-3 px-6 text-center">Rp {{ formatCurrency(detail.price * detail.quantity) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div>
            <h5 class="font-semibold">Metode Pembayaran: {{ transaction.payment_method }}</h5>
            <h5 class="font-semibold mt-4">Pembeli Siswa:</h5>
            <div v-if="transaction.student_transaction">
                <p>Nama: {{ transaction.student_transaction.name }}</p>
                <p>Email: {{ transaction.student_transaction.email }}</p>
                <p>Telepon: {{ transaction.student_transaction.phone }}</p>
            </div>
            <p v-else>Pembelian dilakukan oleh siswa sendiri</p>
        </div>
        <div class="text-right">
            <h5 class="font-semibold">Total Jumlah: Rp {{ formatCurrency(transaction.total_amount) }}</h5>
        </div>
      </div>
      <!-- <div class="mt-6 text-right">
        <button @click="printInvoice" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Invoice</button>
      </div> -->
    </div>
    <div v-else class="flex flex-col justify-center items-center h-full absolute inset-0 bg-opacity-50 bg-gray-500">
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
      <div>
        <h1 class="mt-4 text-2xl font-semibold text-white">Loading...</h1>
      </div>
    </div>

    
  </MemberLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MemberLayouts from '@/components/MemberLayouts.vue';
import api from '@/api/Api.js'; // Mengimpor instansi Axios
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';

const route = useRoute();
const router = useRouter();
const transaction = ref(null);


const fetchTransactionDetail = async () => {
  const transactionId = route.params.id;
  try {
    const response = await api.get(`/v1/transactions/history/${transactionId}`);
    if (response.data.meta.code === 200) {
      transaction.value = response.data.data;
    } else {
      console.error('Failed to fetch transaction detail:', response.data.meta.message);
    }
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    router.push('/member/notfound');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-md font-semibold';
    case 'EXPIRED':
      return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-md font-semibold';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-md font-semibold';
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-md font-semibold';
  }
};

const getPaymentStatusText = (status) => {
  switch (status) {
    case 'PAID':
      return 'LUNAS';
    case 'EXPIRED':
      return 'DIBATALKAN';
    case 'PENDING':
      return 'MENUNGGU PEMBAYARAN';
    default:
      return capitalize(status);
  }
};

const printInvoice = () => {
  const element = document.getElementById('invoicePage');
  const invoiceCode = transaction.value ? transaction.value.invoice_code : 'Invoice';

  html2pdf().set({
    filename: `Invoice_${invoiceCode}.pdf`,
    orientation: 'landscape' // Set the orientation to landscape
  }).from(element).save();

};

onMounted(() => {
  fetchTransactionDetail();
});
</script>

<style scoped>
.bg-primary {
  background-color: #3b82f6;
}

.hover\:bg-secondary:hover {
  background-color: #6366f1;
}

.text-text-primary {
  color: #111827;
}

.text-text-quaternary {
  color: #6b7280;
}

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
