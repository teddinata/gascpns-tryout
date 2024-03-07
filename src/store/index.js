// store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null,
    registrationError: null, // Added registrationError state
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ADMIN_ROLE(state) {
      state.user.role = "admin";
    },
    SET_MEMBER_ROLE(state) {
      state.user.role = "member";
    },
    SET_REGISTRATION_ERROR(state, errorMessage) {
      state.registrationError = errorMessage;
    },
  },
  actions: {
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
