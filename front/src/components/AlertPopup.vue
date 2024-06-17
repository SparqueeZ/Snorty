<template>
  <div class="popup" ref="popup">
    <section class="bluredLayer"></section>
    <div class="body">Test</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePopupStore } from "@/stores/popUpStore";

const popUpStore = usePopupStore();

const popupInfos = popUpStore.getPopupShow;

const popup = ref(null);

document.addEventListener("click", (event) => {
  if (!popup.value?.contains(event.target) && popUpStore.getPopupShow) {
    console.log("Hide...");

    popUpStore.hide();
  } else return;
});
</script>

<style lang="scss" scoped>
.bluredLayer {
  height: 100%;
  width: 100%;
  position: relative;
  backdrop-filter: blur(3px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
}

.body {
  height: 150px;
  width: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: teal;
  text-align: center;
  z-index: 21;
}
</style>
