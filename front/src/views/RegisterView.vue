<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Username" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <select v-model="role">
        <option value="guest">Visiteur</option>
        <option value="administrator">Administrateur</option>
      </select>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const role = ref("");
const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await authStore.registerUser(
      {
        username: username.value,
        password: password.value,
        role: role.value,
      },
      false
    );
    router.push("/");
  } catch (error) {
    console.error("Registration failed", error);
  }
};
</script>
