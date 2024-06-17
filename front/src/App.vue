<script setup>
import { RouterLink, RouterView } from "vue-router";
import Loader from "./components/lib/Loader.vue";
import { useLoaderStore } from "./stores/loaderStore";
const loaderStore = useLoaderStore();
</script>

<template>
  <Loader />
  <RouterView />
</template>

<style>
#app {
  width: 100svw;
}

.loader {
  width: 100svw;
  height: 100svh;
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  /* background-color: #fff; */
}
</style>
