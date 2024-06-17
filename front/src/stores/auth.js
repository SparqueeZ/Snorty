import { defineStore } from "pinia";
import axios from "../assets/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  actions: {
    async loginUser(credentials) {
      try {
        const response = await axios.post("/api/auth/login", credentials);
        this.user = response.data.user;
      } catch (error) {
        console.error(error);
        // throw new Error("Login failed");
      }
    },
    async registerUser(userData, redirection) {
      try {
        const response = await axios.post("/api/auth/register", userData);
        if (redirection) {
          this.user = response.data.user;

          const loginResponse = await axios.post("/api/auth/login", {
            username: userData.username,
            password: userData.password,
          });
          this.user = loginResponse.data.user;
        }
      } catch (error) {
        console.error("Erreur lors du register : ", error);
      }
    },
    async fetchUserProfile() {
      try {
        const response = await axios.get("/api/auth/profile");
        this.user = response.data.user;
      } catch (error) {
        this.user = null;
        console.error("Failed to fetch user profile", error);
        throw error;
      }
    },
    async logoutUser() {
      try {
        await axios.post("/api/auth/logout");
        this.user = null;
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
  },
});
