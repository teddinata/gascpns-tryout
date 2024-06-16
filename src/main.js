/* eslint-disable vue/multi-word-component-names */
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import store from "./store";
import * as filters from "./filters";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ObserveVisibility } from 'vue-observe-visibility';

// Import Vue3EasyDataTable
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);

Object.keys(filters).forEach((filterName) => {
  app.config.globalProperties.$filters = filters;
});

app.directive('observe-visibility', ObserveVisibility);

// Register the Vue3EasyDataTable component globally
app.component('EasyDataTable', Vue3EasyDataTable);

// In your main.js or a similar entry point
store.commit('auth/SET_VERIFIED', JSON.parse(localStorage.getItem('isVerified')));
// app.use(VCalendar, {});

app.use(router);
app.component("QuillEditor", QuillEditor);
app.use(store);
app.mount("#app");

// store.dispatch("auth/getUser").then(() => {
//   app.mount("#app");
// });

app.use(Toast, {
  // Opsi konfigurasi (lihat dokumentasi untuk opsi lengkap)
  position: 'top-right',
  timeout: 10000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
});
