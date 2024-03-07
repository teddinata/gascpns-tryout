import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: "/admin/dashboard",
      name: "dashboard",
      meta: {
        title: "Dashboard | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [{ label: "Dashboard", to: "/" }],
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
      },
      component: () => import("@/views/admin/statistika.vue"),
    },
    {
      path: "/admin/latihan",
      name: "latihan",
      meta: {
        title: "Soal Latihan | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Soal Latihan", to: "/admin/latihan" },
        ],
      },
      component: () => import("@/views/admin/latihan.vue"),
    },
    {
      path: "/admin/konten",
      name: "konten",
      meta: {
        title: "Konten | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Konten", to: "/admin/konten" },
        ],
      },
      component: () => import("@/views/admin/konten.vue"),
    },
    {
      path: "/pengaturan",
      name: "pengaturan",
      meta: {
        title: "Pengaturan | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Pengaturan", to: "/admin/pengaturan" },
        ],
      },
      component: () => import("@/views/admin/pengaturan.vue"),
    },
    {
      path: "/member/dashboard",
      name: "Dashboard Member",
      meta: {
        title: "Dashboard | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [{ label: "Dashboard", to: "/member/dashboard" }],
      },
      component: () => import("@/views/member/dashboard.vue"),
    },
    {
      path: "/member/tryout",
      name: "tryout",
      meta: {
        title: "Tryout | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Tryout", to: "/member/tryout" },
        ],
      },
      component: () => import("@/views/member/tryout.vue"),
    },
    {
      path: "/member/rangking",
      name: "rangking",
      meta: {
        title: "Rangking Member | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Rangking", to: "/member/rangking" },
        ],
      },
      component: () => import("@/views/member/rangking.vue"),
    },
    {
      path: "/member/statistika",
      name: "statistika",
      meta: {
        title: "Statistika | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "Statistika", to: "/member/statistika" },
        ],
      },
      component: () => import("@/views/member/statistika.vue"),
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
      },
      component: () => import("@/views/member/latihan.vue"),
    },
    {
      path: "/member/faq",
      name: "faq",
      meta: {
        title: "FAQ | GASCPNS",
        description: "This is the home page of my Vue.js app.",
        links: [
          { label: "Dashboard", to: "/member/dashboard" },
          { label: "FAQ", to: "/member/faq" },
        ],
      },
      component: () => import("@/views/member/faq.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Update page title based on the route's metadata
  document.title = to.meta.title || "Your Default Title";
  next();
});

export default router;
