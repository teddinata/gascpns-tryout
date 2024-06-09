// store/auth.js
import Api from "../../api/Api";

const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    // user: JSON.parse(localStorage.getItem("user")) || {},
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    // user: null,
    role: localStorage.getItem("role") || "", // Added user role
    transactionId: null,
    selectedPaymentMethod: null, // Data selected payment method disimpan di sini
    transactionData: null,
    isVerified: JSON.parse(localStorage.getItem('isVerified')) || false,
  },
  mutations: {
    SET_VERIFIED(state, status) {
      state.isVerified = status; // Tambahkan ini
      localStorage.setItem('isVerified', status); // Simpan ke localStorage
    },
    AUTH_SUCCESS(state, { token, user }) {
      state.token = token;
      state.user = user;
      state.role = user && user.role ? user.role : "user";
  
      // Save token and user data in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", state.role);
    },
    GET_USER(state, user) {
      state.user = user;
      state.role = user && user.role ? user.role : "user";
  
      // Update user data in local storage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", state.role);
    },
    AUTH_LOGOUT(state) {
      state.token = "";
      state.user = {};
      state.role = ""; // Clear user role on logout
  
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },

    SET_TRANSACTION_ID(state, transactionId) {
      state.transactionId = transactionId;
    },

    SET_SELECTED_PAYMENT_METHOD(state, method) {
      state.selectedPaymentMethod = method;
    },

    SET_TRANSACTION_DATA(state, transactionData) {
      state.transactionData = transactionData;
    }
  },  
  actions: {
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/v1/register", {
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone,
          password: user.password,
          password_confirmation: user.password_confirmation,
          birthdate: user.birthdate,
          referral_code: user.referral_code,
        })
          .then((response) => {
            const token = response.data.data.access_token;
            const user = response.data.user || {};
            const role = user && user.role ? user.role : "user";
            
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", role);
            Api.defaults.headers.common["Authorization"] = "Bearer " + token;
  
            commit("AUTH_SUCCESS", { token, user }); // Pass an object with token and user
            commit("GET_USER", user);
            resolve(response);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            if (error.response && error.response.data) {
              reject(error.response.data); // Kirim data error dari backend
            } else {
              reject({ message: 'Terjadi kesalahan saat registrasi.' }); // Pesan error default
            }
          });
      });
    },
    verifyOtp({ commit }, { email, otp }) {
      return new Promise((resolve, reject) => {
        Api.post('/v1/otp/verify', { email, otp })
          .then((response) => {
            if (response.data.meta.code === 200) {
              const user = response.data.data.user;
              commit('GET_USER', user);
              commit('SET_VERIFIED', true);
              // Simpan status verifikasi ke localStorage
              localStorage.setItem('isVerified', true);
              resolve(response); // Resolve promise dengan response
            } else {
              reject(new Error(response.data.meta.message)); // Reject promise dengan pesan error
            }
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              reject(error.response.data); // Kirim data error dari backend
            } else {
              reject({ message: 'Terjadi kesalahan saat verifikasi OTP.' }); // Pesan error default
            }
          });
      });
    },    
    async getUser({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("/user")
          .then((response) => {
            const user = response.data;
            commit("GET_USER", user);
            // Update isVerified based on email_verified_at
            const isVerified = user.email_verified_at !== null;
            commit("SET_VERIFIED", isVerified);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/v1/login", {
          email_or_username: user.email_or_username,
          password: user.password,
        })
          .then((response) => {
            const token = response.data.data.access_token;
            const user = response.data.user || {};
            const role = user && user.role ? user.role : "user";
            const isVerified = response.data.data.user.email_verified_at !== null;
            
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", role);
            Api.defaults.headers.common["Authorization"] = "Bearer " + token;
            
            commit("AUTH_SUCCESS", { token, user }); // Pass an object with token and user
            commit("GET_USER", user);
            commit('SET_VERIFIED', isVerified); 
            resolve(response);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            // reject(error.response.data.error);
            reject(error.response.data);
          });
      });
    },

    logout({ commit }) {
      return new Promise((resolve) => {
        commit("AUTH_LOGOUT");
        delete Api.defaults.headers.common["Authorization"];
        resolve();
      });
    },

    setTransactionId({ commit }, transactionId) {
      commit('SET_TRANSACTION_ID', transactionId);
    },

    updateSelectedPaymentMethod(context, method) {
      context.commit('setSelectedPaymentMethod', method);
    },

    saveTransactionData({ commit }, transactionData) {
      commit('SET_TRANSACTION_DATA', transactionData);
    },
  },
  
  getters: {
    user(state) {
      return state.user;
    },
    getTransactionId: (state) => state.transactionId,
    getSelectedPaymentMethod(state) {
      return state.selectedPaymentMethod;
    },
    getTransactionData(state) {
      return state.transactionData;
    },
    currentUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.token;
    },
    isVerified(state) {
      return state.isVerified; // Tambahkan ini
    },
    userRole(state) {
      return state.role;
    },
    isAdmin(state) {
      return state.role === "admin";
    },
    isMember(state) {
      return state.role === "user";
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
  },
};

export default auth;
