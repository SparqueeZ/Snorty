<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Username" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    await authStore.loginUser({
      username: username.value,
      password: password.value,
    });
    router.push("/");
  } catch (error) {
    errorMessage.value =
      "Login failed. Please check your credentials and try again.";
    console.error("Login failed", error);
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
