<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <input v-model="username" type="text" placeholder="Username" required />
        <p v-if="usernameError" class="error">{{ usernameError }}</p>
      </div>
      <div class="input-group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <p v-if="passwordError" class="error">{{ passwordError }}</p>
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const usernameError = ref("");
const passwordError = ref("");
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = "";
  usernameError.value = "";
  passwordError.value = "";

  try {
    const response = await authStore.loginUser({
      username: username.value,
      password: password.value,
    });

    if (response.success) {
      router.push("/");
    } else {
      errorMessage.value = response.errorMessage;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    errorMessage.value = "Unexpected error. Please try again later.";
  }
};
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
