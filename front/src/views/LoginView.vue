<template>
  <section class="loginPage">
    <div class="loginForm">
      <h1>Snorty</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <div class="iconContainer">
            <Icon name="people" />
          </div>
          <input
            tabindex="1"
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div class="input-group">
          <div class="iconContainer">
            <Icon name="lock" />
          </div>
          <input
            tabindex="2"
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <Button
          tabindex="3"
          type="submit"
          icon="next"
          @click="sendForm()"
          @keypress.enter="sendForm()"
        />
        <button ref="submitBtn" type="submit">Login</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

import Icon from "@/components/lib/Icon.vue";
import Button from "@/components/lib/Button.vue";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const usernameError = ref("");
const passwordError = ref("");
const authStore = useAuthStore();
const router = useRouter();
const submitBtn = ref(null);

const sendForm = () => {
  console.log(submitBtn.value.click());
};

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
.loginPage {
  width: 100%;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginForm {
    padding: 3rem;
    background-color: #f0f2fd;
    border-radius: 0.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .input-group {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e4e6fb;
    padding: 0.5rem 1rem;
    border-radius: 0.2rem;
    gap: 0.5rem;
    .iconContainer {
      display: block;
      width: 20px;
      height: 20px;
      padding: 1px;
      fill: #5f4bb6;
    }
    input {
      background-color: transparent;
      outline: none;
      border: #5f4bb6 0px solid;
      transition: border 0.1s ease-out;
    }
  }
  button {
    display: none;
  }
  .button {
    background-color: #e4e6fb;
    width: 100%;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    &:hover {
      background-color: #9391e8;
      color: #fff;
    }
  }
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
