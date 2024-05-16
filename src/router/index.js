import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

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
      path: '/member/tryout/:tryoutId',
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
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "GasCPNS - Welcome to GASCPNS";

  // Cek apakah token tersimpan
  const isAuthenticated = store.getters["auth/isLoggedIn"];

  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      const userRole = store.getters["auth/userRole"];

      // Check if the route requires a specific role
      if (to.meta.requiresAdmin && userRole === "admin") {
        next();
      } else if (to.meta.requiresMember && userRole === "user") {
        next();
      } else {
        // Redirect to the appropriate dashboard based on user role
        next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
      }
    } else {
      next("/login"); // Redirect ke halaman login jika tidak ada token tersimpan
    }
  } else {
    if (isAuthenticated) {
      // Jika pengguna sudah login, arahkan ke halaman sesuai peran
      const userRole = store.getters["auth/userRole"];
      next(userRole === "admin" ? "/admin/dashboard" : "/member/dashboard");
    } else {
      next(); // Lanjutkan jika tidak ada peran yang diperlukan
    }
  }
});

export default router;
