<template>
  <div>
    <h1>About</h1>
    <p>Welcome to secured about</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
