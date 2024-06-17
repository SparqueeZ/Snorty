import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";

import JsonExcel from "vue-json-excel3";
import App from "./App.vue";
import router from "./router";

import autoResize from "./directives/autoResize";

const app = createApp(App);

app.use(createPinia());
app.component("downloadExcel", JsonExcel);
app.use(VueClipboard);
app.use(router);
app.directive("auto-resize", autoResize);

app.mount("#app");
