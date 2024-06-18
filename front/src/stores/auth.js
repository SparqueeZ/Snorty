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
        return { success: true, user: response.data.user };
      } catch (error) {
        let errorMessage = "An error occurred. Please contact administrator.";
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Invalid credentials.";
          } else if (error.response.status === 404) {
            errorMessage = "User not found.";
          } else {
            errorMessage = `Error: ${error.response.status}`;
          }
        }
        return { success: false, errorMessage };
      }
    },
    async fetchUserProfile() {
      try {
        const response = await axios.get("/api/auth/profile");
        this.user = response.data.user;
      } catch (error) {
        this.user = null;
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
    async updateTransitions(value) {
      try {
        const response = await axios.put("/api/auth/preferences", {
          preference: "transitions",
          value: value,
        });
        console.log(response);
        if (this.user) {
          this.user.preferences.transitions =
            !this.user.preferences.transitions;
        }
      } catch (error) {
        console.error("Error during transitions preference update.", error);
      }
    },
  },
});
