<template>
  <div
    class="commandsScreen"
    @contextmenu="toggleContextMenuVisibility($event, 'alertItem')"
  >
    <div class="appTitle">
      <p class="title">Snorty</p>
      <p class="version">v0.5.3</p>
    </div>

    <div class="inputArea">
      <textarea
        class="JSONData"
        v-model="input"
        name="JSONData"
        id="JSONData"
        @keypress.enter="convertDataToJSON"
      ></textarea>
      <div class="buttons">
        <Button
          icon="download"
          text="Import"
          @click="convertDataToJSON"
          :rightIcon="false"
        />
        <Button
          icon="clipboard"
          title="Import from clipboard"
          @click="pasteToImportSection"
        />
      </div>
    </div>

    <Button icon="next" text="Change side" @click="emit('changeSide')" />
    <Button icon="reload" @click="emit('reloadAlerts')" />

    <div class="flexSpace"></div>

    <div class="userArea">
      <div class="profile">
        <div class="img">
          <p class="letter">
            {{ authStore.user.username[0] }}
          </p>
        </div>
        <p class="username" v-if="authStore.user">
          {{ authStore.user.username }}
        </p>
      </div>
      <div class="actions">
        <Button
          v-if="authStore.user.role === 'administrator'"
          icon="addAccount"
          title="Add new user"
          @click="toRegisterUser"
        />
        <Button icon="disconnect" title="Logout" @click="handleLogout" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  useAuthStore,
  useOnlineStore,
  usePopupStore,
  useContextMenu,
  useLoaderStore,
} from "@/stores/stores.mjs";
import { useRouter } from "vue-router";

import Button from "../lib/Button.vue";

const emit = defineEmits(["updateAlerts", "changeSide", "reloadAlerts"]);

const router = useRouter();
const authStore = useAuthStore();
const onlineStore = useOnlineStore();
const popupStore = usePopupStore();
const contextMenu = useContextMenu();
const loaderStore = useLoaderStore();

const input = ref();

const convertDataToJSON = () => {
  if (input.value) {
    try {
      const parsedData = JSON.parse(input.value);
      emit("updateAlerts", { parsedData });
    } catch (error) {
      console.error("Invalid JSON input:", error);
    } finally {
      input.value = "";
    }
  }
};

const pasteToImportSection = () => {
  navigator.clipboard.readText().then((text) => {
    input.value = text;
    convertDataToJSON();
  });
};

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

watch(
  () => authStore.user.preferences.transitions,
  (newValue) => {
    updateContextMenu();
  }
);
</script>

<style lang="scss" scoped>
.commandsScreen {
  flex-shrink: 0;
  background-color: #e4e6fb;
  overflow: auto;
  z-index: 10;
  max-height: 100svh;
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

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

  .inputArea {
    border-radius: 0.2rem;
    padding: 1rem 1rem;
    background-color: #b1b5f0;

    textarea {
      max-width: 300px;
      min-width: 210px;
      outline: none;
      border: #5f4bb6 0px solid;
      transition: border 0.1s ease-out;
      background-color: #e4e6fb;

      &:focus {
        border: #5f4bb6 2px solid;
        transition: border 0.1s ease-out;
      }
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .flexSpace {
    flex: 1 0 0;
  }

  .userArea {
    background-color: #b1b5f0;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    min-width: 220px;
    .profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      .img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #575da3;
        display: flex;
        justify-content: center;
        align-items: center;
        .letter {
          user-select: none;
          margin-top: -3px;
          text-transform: capitalize;
          font-weight: 700;
          color: #282c58;
        }
      }
      .username {
        text-transform: capitalize;
        font-weight: 600;
      }
    }
    .actions {
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      .button {
        width: 25px;
        height: 25px;
      }
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
</style>
