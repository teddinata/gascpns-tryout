import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/register",
      name: "register",
      meta: {
        title: "Register | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [{ label: "Dashboard", to: "/" }],
      },
      component: () =>
        import(/* webpackChunkName: "register" */ "@/views/auth/register.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "Login | GASCPNS",
        description: "Login to your account",
        links: [{ label: "Dashboard", to: "/" }],
      },
      component: () =>
        import(/* webpackChunkName: "register" */ "@/views/auth/login.vue"),
    },
    {
      path: "/admin/dashboard",
      name: "dashboard",
      meta: {
        title: "Dashboard | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [{ label: "Dashboard", to: "/admin/dashboard" }],
        requiresAuth: true,
        requiresAdmin: true,
      },
      component: () => import("@/views/admin/dashboard.vue"),
    },
    {
      path: "/admin/soal",
      name: "soal",
      meta: {
        title: "Soal | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Soal & Paket", to: "/admin/soal" },
        ],
        requiresAuth: true,
        requiresAdmin: true,
      },
      component: () => import("@/views/admin/soal/index.vue"),
    },
    {
      path: "/admin/soal/paket",
      name: "paket soal",
      meta: {
        title: "Paket Soal | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Soal & Paket", to: "/admin/soal" },
          { label: "Paket Soal", to: "/admin/soal/paket" },
        ],
        requiresAuth: true,
        requiresAdmin: true,
      },
      component: () => import("@/views/admin/soal/paket.vue"),
    },
    {
      path: "/admin/soal/tryout",
      name: "soal tryout",
      meta: {
        title: "Soal Tryout | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Soal & Paket", to: "/admin/soal" },
          { label: "Soal Tryout", to: "/admin/soal/tryout" },
        ],
        requiresAuth: true,
        requiresAdmin: true,
      },
      component: () => import("@/views/admin/soal/tryout.vue"),
    },
    {
      path: "/admin/statistika",
      name: "statistika",
      meta: {
        title: "Statistika | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Statistika", to: "/admin/statistika" },
        ],
        requiresAuth: true,
        requiresAdmin: true,
      },
      component: () => import("@/views/admin/statistika.vue"),
    },
    {
      path: "/member/dashboard",
      name: "Dashboard Member",
      meta: {
        title: "Dashboard | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [{ label: "Dashboard", to: "/member/dashboard" }],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/dashboard.vue"),
    },
    {
      path: "/member/my-tryout",
      name: "my-tryout",
      meta: {
        title: "Tryout | GASCPNS",
        description: "Try Out Soal CPNS",
        links: [
          // { label: "Dashboard", to: "/member/dashboard" },
          { label: "Tryout", to: "/member/my-tryout" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/my-tryout.vue"),
    },
    {
      path: '/member/tryout/:tryoutDetailsId',
      name: 'tryout',
      meta: {
        title: "Tryout | GASCPNS",
        description: "Try Out Soal CPNS",
        links: [
          // { label: "Dashboard", to: "/member/dashboard" },
          { label: "Tryout", to: "/member/my-tryout" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import('../views/member/tryout.vue')
    },
    {
      path: "/member/tryout/:tryoutId/summary",
      name: "tryout-summary",
      meta: {
        title: "Hasil Tryout | GASCPNS",
        description: "Hasil Try Out Soal CPNS",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Hasil Tryout", to: "/member/summary" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/summary.vue"),
    },
    {
      path: "/member/tryout/summary/:tryoutDetailsId",
      name: "summary",
      meta: {
        title: "Summary | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Summary", to: "/member/summary" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/summary-detail.vue"),
    },
    {
      path: "/member/paket/detail/:slug",
      name: "detail",
      meta: {
        title: "Beli Paket Soal | GASCPNS",
        description: "Halaman pembelian paket soal",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Paket Soal", to: "/member/detail" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/detail-package.vue"),
    },
    // payment method
    {
      path: '/member/paket/:slug/checkout',
      name: 'PaymentMethod',
      meta: {
        title: 'Payment Method | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Payment Method', to: '/member/payment-method' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/choose-payment.vue')
    },
    {
      path: '/member/paket/:slug/checkout/confirm',
      name: 'Checkout',
      meta: {
        title: 'Checkout | GASCPNS',
        description: 'Halaman checkout',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Payment Method', to: '/member/payment-method' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/checkout.vue')
    },
    {
      path: '/member/transaksi/:invoiceId/payment',
      name: 'Payment',
      meta: {
        title: 'Payment | GASCPNS',
        description: 'Halaman pembayaran',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Payment Method', to: '/member/payment-method' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/payment-detail.vue')
    },
    // success payment
    {
      path: '/member/transaksi/success',
      name: 'Success',
      meta: {
        title: 'Success | GASCPNS',
        description: 'Halaman pembayaran berhasil',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Payment Method', to: '/member/payment-method' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/success-payment.vue')
    },
    // otp
    {
      path: '/verify-otp',
      name: 'verify-otp',
      meta: {
        title: 'Verification | GASCPNS',
        description: 'Halaman OTP',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Payment Method', to: '/member/payment-method' }
        ],
        requiresAuth: true,
        // requiresMember: true
      },
      component: () => import('@/views/auth/otp.vue')
    },
    {
      path: "/member/latihan",
      name: "latihan",
      meta: {
        title: "Latihan Soal | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Latihan Soal", to: "/member/latihan" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/latihan.vue"),
    },
    {
      path: "/member/latihan-soal",
      name: "latihan-soal",
      meta: {
        title: "Latihan Soal | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Latihan Soal", to: "/member/latihan" },
        ],
        requiresAuth: true,
        requiresMember: true,
      },
      component: () => import("@/views/member/list-latihan.vue"),
    },
    // ranking page
    {
      path: '/member/ranking',
      name: 'ranking',
      meta: {
        title: 'Ranking | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Ranking', to: '/member/ranking' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/ranking.vue')
    },
    // raport
    {
      path: '/member/raport',
      name: 'raport',
      meta: {
        title: 'Raport | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Raport', to: '/member/raport' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/raport.vue')
    },
    // member faq
    {
      path: '/member/faq',
      name: 'faq',
      meta: {
        title: 'FAQ | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'FAQ', to: '/member/faq' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/faq.vue')
    },
    // list transaction
    {
      path: '/member/riwayat-transaksi',
      name: 'riwayat-transaksi',
      meta: {
        title: 'Riwayat Transaksi | GASCPNS',
        description: 'Halaman menampilkan riwayat transaksi',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Riwayat Transaksi', to: '/member/riwayat-transaksi' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/transaction-history.vue')
    },
    // detail transaction
    {
      path: '/member/riwayat-transaksi/:id',
      name: 'detail-transaksi',
      meta: {
        title: 'Detail Transaksi | GASCPNS',
        description: 'Halaman menampilkan rincian transaksi',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Riwayat Transaksi', to: '/member/riwayat-transaksi' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/detail-transaction.vue')
    },
    // profile
    {
      path: '/member/profile',
      name: 'profile',
      meta: {
        title: 'Profile | GASCPNS',
        description: 'Halaman menampilkan profile',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Profile', to: '/member/profile' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/profile-setting.vue')
    },
    // help page
    {
      path: '/member/help',
      name: 'help',
      meta: {
        title: 'Help | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Help', to: '/member/help' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/help.vue')
    },
    { 
      path: '/member/notfound',
      name: 'NotFound', 
      meta: {
        title: 'Not Found | GASCPNS',
        description: 'This is the home page of my Vue.js app.',
        links: [
          { label: 'Dashboard', to: '/member/dashboard' },
          { label: 'Not Found', to: '/member/notfound' }
        ],
        requiresAuth: true,
        requiresMember: true
      },
      component: () => import('@/views/member/notfound.vue')
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   // document.title = to.meta.title || "GasCPNS - Welcome to GASCPNS";

//   const isAuthenticated = store.getters["auth/isLoggedIn"];
//   const isVerified = store.getters["auth/isVerified"];

//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated) {
//       next("/login");
//     } else if (!isVerified && to.path !== '/verify-otp') {
//       next('/verify-otp');
//     } else {
//       next(); // Tambahkan pemanggilan next() di sini
//     }
//   } else {
//     if (isAuthenticated) {
//       if (!isVerified && to.path !== '/verify-otp') {
//         next('/verify-otp'); // Arahkan ke halaman verifikasi jika belum diverifikasi
//       } else {
//         const userRole = store.getters["auth/userRole"];
//         next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
//       }
//     } else {
//       next(); // Lanjutkan jika tidak ada peran yang diperlukan
//     }
//   }
// });

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "GasCPNS - Welcome to GASCPNS";
  NProgress.start();
  // Cek apakah token tersimpan
  const isAuthenticated = store.getters["auth/isLoggedIn"];
  const isVerified = store.getters["auth/isVerified"];

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next("/login");
    } else if (!isVerified && to.path !== '/verify-otp') {
      next('/verify-otp');
    } else {
      next(); // Lanjutkan jika terotentikasi dan terverifikasi
    }
  } else { // Jika rute tidak memerlukan otentikasi
    if (isAuthenticated) {
      if (!isVerified && to.path !== '/verify-otp') {
        next('/verify-otp');
      } else {
        const userRole = store.getters["auth/userRole"];
        next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});


// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title || "GasCPNS - Welcome to GASCPNS";

//   // Cek apakah token tersimpan
//   const isAuthenticated = store.getters["auth/isLoggedIn"];
//   const isVerified = store.getters["auth/isVerified"];

//   if (to.meta.requiresAuth) {
//     if (isAuthenticated) {
//       const userRole = store.getters["auth/userRole"];

//       // Check if the route requires a specific role
//       if (to.meta.requiresAdmin && userRole === "admin") {
//         next();
//       } else if (to.meta.requiresMember && userRole === "user") {
//         next();
//       } else {
//         // Redirect to the appropriate dashboard based on user role
//         next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
//       }
//     } else if (!isVerified && to.path !== '/verify-otp') {
//       next('/verify-otp');
//     } else {
//       next("/login"); // Redirect ke halaman login jika tidak ada token tersimpan
//     }
//   } else {
//     if (isAuthenticated) {
//       // Jika pengguna sudah login, arahkan ke halaman sesuai peran
//       const userRole = store.getters["auth/userRole"];
//       next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
//     } else {
//       next(); // Lanjutkan jika tidak ada peran yang diperlukan
//     }
//   }
// });


export default router;
