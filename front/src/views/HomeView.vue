<template>
  <main
    class="homeApp"
    :style="rightCommandSection ? 'flex-direction: row-reverse' : ''"
  >
    <AlertPopup v-if="popupStore.show" />
    <transition>
      <RulePopup v-if="ruleStore.show" />
    </transition>
    <div
      class="commandsScreen"
      @contextmenu="toggleContextMenuVisibility($event, 'alertItem')"
    >
      <div class="appTitle">
        <p class="title">Snorty</p>
        <p class="version">v0.5.0</p>
      </div>
      <textarea
        class="JSONData"
        v-model="rawDataInput"
        name="JSONData"
        id="JSONData"
        @keypress.enter="convertDataToJSON"
      ></textarea>
      <div></div>
      <button @click="convertDataToJSON">Import JSON data</button>
      <button @click="pasteToImportSection">Import from clipboard</button>
      <div></div>
      <button @click="rightCommandSection = !rightCommandSection">
        Swap orders
      </button>
      <button @click="handleLogout">Logout</button>
      <button @click="toRegisterUser">Add user</button>
      <p v-if="authStore.user">{{ authStore.user.username }}</p>
      <!-- <button>
        <download-excel :data="localStorageDataLoaded">
          Exporter en XLS
        </download-excel>
      </button> -->
    </div>
    <div class="resultsScreen">
      <Tableau :alerts="JSONData" v-if="JSONData.length > 0" />
      <p class="title" v-else>No data.</p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useOnlineStore } from "@/stores/onlineDataStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { usePopupStore } from "@/stores/popUpStore";
import { useRuleStore } from "@/stores/RulePopup";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useContextMenu } from "@/stores/ContextMenuStore";

import Tableau from "@/components/Tableau.vue";
import AlertPopup from "@/components/AlertPopup.vue";
import RulePopup from "@/components/RulePopup.vue";

const popupStore = usePopupStore();
const ruleStore = useRuleStore();
const loaderStore = useLoaderStore();

const authStore = useAuthStore();
const router = useRouter();
const onlineStore = useOnlineStore();
const contextMenu = useContextMenu();

const rawDataInput = ref("");
const rightCommandSection = ref(false);

const JSONData = ref([]);

const alerts = computed(() => onlineStore.getAlerts);
const loading = computed(() => onlineStore.loading);
const error = computed(() => onlineStore.error);

watch(
  alerts,
  (newAlerts) => {
    JSONData.value = newAlerts;
  },
  { immediate: true }
);

watch(
  () => authStore.user.preferences.transitions,
  (newValue) => {
    updateContextMenu();
  }
);

const pasteToImportSection = () => {
  navigator.clipboard.readText().then((text) => {
    rawDataInput.value = text;
    convertDataToJSON();
  });
};

onMounted(async () => {
  await onlineStore.fetchAlerts();
  await onlineStore.fetchRules();
});

const toRegisterUser = () => {
  router.push("/register");
};

const handleLogout = () => {
  authStore.logoutUser();
  loaderStore.show();
  setTimeout(() => {
    loaderStore.hide();
    router.push("/login");
  }, 500);
};

const convertDataToJSON = () => {
  if (rawDataInput.value) {
    try {
      const parsedData = JSON.parse(rawDataInput.value);
      JSONData.value.push(parsedData);
      onlineStore.alerts = JSONData.value;
      onlineStore.addAlert(rawDataInput.value);
    } catch (error) {
      console.error("Invalid JSON input:", error);
    } finally {
      rawDataInput.value = "";
    }
  }
};

const contextMenus = ref([
  {
    name: "alertItem",
    data: [
      {
        group: "preferences",
        name: authStore.user.preferences.transitions
          ? "Disable transitions"
          : "Enable transitions",
        icon: authStore.user.preferences.transitions ? "cross" : "check",
        id: 0,
        handler: () => {
          authStore.updateTransitions(!authStore.user.preferences.transitions);
        },
      },
    ],
  },
]);

function updateContextMenu() {
  const menu = contextMenus.value.find((m) => m.name === "alertItem");
  if (menu) {
    menu.data = [
      {
        group: "preferences",
        name: authStore.user.preferences.transitions
          ? "Disable transitions"
          : "Enable transitions",
        icon: authStore.user.preferences.transitions ? "cross" : "check",
        id: 0,
        handler: () => {
          authStore.updateTransitions(!authStore.user.preferences.transitions);
        },
      },
    ];
  }
}

function toggleContextMenuVisibility(
  event,
  contextMenuTitle,
  stopPropagation = false
) {
  if (stopPropagation) {
    event.stopPropagation();
  }
  const menu = contextMenus.value.find((m) => m.name === contextMenuTitle);
  if (menu) {
    contextMenu.setMenu(menu.data);
    contextMenu.visible(event.clientX, event.clientY);
  }
  event.preventDefault();
}
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 155px;
  padding: 0.2rem 0.7rem;
  width: fit-content;
  background-color: #ffffff;
  border-radius: 0.3rem;
  transition: all 0.1s ease-out;
  user-select: none;
  .iconContainer {
    width: 20px;
    height: 20px;
    display: block;
  }
  p {
    margin: 0;
  }
  &:hover {
    background-color: #e8e8e8;
    cursor: pointer;
  }
}

.homeApp {
  display: flex;
  justify-content: space-between;
  height: 100svh;
  overflow: hidden;

  .JSONData {
    max-width: 500px;
  }
  .commandsScreen {
    flex-shrink: 0;
    background-color: #e4e6fb;
    overflow: auto;
    z-index: 10;
    max-height: 100svh;
    position: relative;
    padding: 2rem;

    .appTitle {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 42px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .version {
        font-size: 12px;
      }
    }

    .commands {
      padding: 2rem;
      display: flex;
      background-color: white;
      overflow: auto;
      // position: fixed;
      width: var(--sidebar-width - 2rem);
      max-height: 90svh;
      flex-direction: column;
    }
  }
  .resultsScreen {
    width: 100%;
    min-height: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    max-height: 100svh;
    padding: 0rem 2rem;
    overflow: auto;
    .table {
      width: 100%;
    }
    .title {
      font-weight: 600;
      font-size: 32px;
    }
  }
}
</style>
