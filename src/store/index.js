// store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    // state user, pakai localStorage, untuk menyimpan data user yang sedang login
    user: {},

    registrationError: null, // Added registrationError state

    // state untuk token, pakai localStorage, untuk menyimpan informasi tentang token JWT
    token: localStorage.getItem('token') || '',


    resetToken: null,
  },
  mutations: {
    // AUTH_SUCCESS(state, token, user) {
    //   state.token = token // <-- assign state token dengan response token
    //   state.user = user // <-- assign state user dengan response data user
    // },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ADMIN_ROLE(state) {
      state.user.roles = "admin";
    },
    SET_MEMBER_ROLE(state) {
      state.user.roles = "member";
    },
    SET_REGISTRATION_ERROR(state, errorMessage) {
      state.registrationError = errorMessage;
    },
    SET_RESET_TOKEN(state, token) {
      state.resetToken = token;
    },
  },
  actions: {
    // async getUser({ commit }) {
    //   try {
    //     const token = localStorage.getItem('token')

    //     // ambil data token dari localStorage
    //     axios.defaults.headers.common.Authorization = `Bearer ${token}`
    //     if (localStorage.getItem('token')) {
    //       const response = await axios.get("https://api-cpns.creazylab.works/api/user");
    //       const user = response.data;
    //       commit("SET_USER", user);
    //     }

    //   } 
    //   catch (error) {
    //     console.log(error)
    //   }
    // },

    user({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("https://api-cpns.creazylab.works/api/user")
          .then(res => {
            commit('SET_USER', res.data)

            resolve(res.data)
          })
          .catch(error => {
            // reject ke component dengan hasil response
            reject(error)
          })
      })
    },

    async registerUser({ commit }, userData) {
      try {
        const response = await axios.post(
          "https://api-cpns.creazylab.works/api/v1/register",
          userData
        );
        const user = response.data.data.user;
        commit("SET_USER", user);
        commit("SET_REGISTRATION_ERROR", null); // Clear registration error on success
        return user;
      } catch (error) {
        commit("SET_REGISTRATION_ERROR", error.response.data.message);
        throw error;
      }
    },

    async signInUser({ commit }, userData) {
      try {
        const res = await axios.post("https://api-cpns.creazylab.works/api/v1/login", userData);
        const token = res.data.data.access_token;
        const userResponse = await axios.get("https://api-cpns.creazylab.works/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = userResponse.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        commit('SET_USER', user);
    
        return res;
      } catch (error) {
        localStorage.removeItem('token');
        throw error;
      }
    },
    
    setAdminRole({ commit }) {
      commit("SET_ADMIN_ROLE");
    },
    setMemberRole({ commit }) {
      commit("SET_MEMBER_ROLE");
    },
  },
  getters: {
    currentUser: (state) => state.user,
    registrationError: (state) => state.registrationError, // Getter for registrationError
  },
});
