<template>
  <transition>
    <div
      v-if="showSearchContext || showActionsContext"
      class="contextMenu"
      ref="contextMenu"
    >
      <ul>
        <template v-for="(item, index) in items" :key="index">
          <div
            class="dividerContainer"
            v-if="shouldInsertDivider(index) && showActionsContext"
          >
            <p class="dividerName">{{ item.group }}</p>
            <span class="divider"></span>
          </div>
          <a :href="searchWithParameter(item.id, getIpsAndSID(props.alertId))">
            <li v-if="showSearchContext">
              <Icon :name="item.icon" />
              <p>{{ item.name }}</p>
            </li>
            <li v-if="showActionsContext">
              <Icon :name="item.icon" />
              <p>{{ item.name }}</p>
            </li>
          </a>
        </template>
      </ul>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useLocalDataStore } from "@/stores/localDataStore";
import Icon from "./lib/Icon.vue";

const localDataStore = useLocalDataStore();

const props = defineProps({
  alertId: Number,
  showSearchContext: Boolean,
  showActionsContext: Boolean,
  items: Array,
});

const emit = defineEmits();

const contextMenu = ref(null);

document.addEventListener("click", (event) => {
  if (props.showSearchContext) {
    if (!contextMenu.value?.contains(event.target)) {
      emit("hideContext");
    } else return;
  }
});
document.addEventListener("wheel", (event) => {
  if (
    !contextMenu.value?.contains(event.target) &&
    (props.showSearchContext || props.showActionsContext)
  ) {
    emit("hideContext");
  } else return;
});

const searchWithParameter = (id, info) => {
  if (props.showSearchContext) {
    if (id === 0) {
      return `https://172.30.4.145/evebox/#/events?q=src_ip%3A"${info.src_ip}"`;
    } else if (id === 1) {
      return `https://172.30.4.145/evebox/#/events?q=dest_ip%3A"${info.dest_ip}"`;
    } else if (id === 2) {
      return `https://172.30.4.145/evebox/#/events?q=alert.signature_id%3A"${info.alert.signature_id}"`;
    } else return console.warn("Erreur");
  } else console.log("Pas recherche context");
};

const getIpsAndSID = (alertId) => {
  const data = localDataStore.getLocalStorageData;
  return data[alertId];
};

const shouldInsertDivider = (index) => {
  return (
    index === 0 || props.items[index].group !== props.items[index - 1].group
  );
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.contextMenu {
  position: absolute;
  top: 30px;
  background-color: #fff;
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    .dividerContainer {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      gap: 1rem;
      .dividerName {
        margin: 0;
        text-wrap: nowrap;
        user-select: none;
        font-size: 12px;
        font-weight: 600;
        color: #b8b8b8;
      }
      .divider {
        margin-top: 3px;
        width: 100%;
        height: 1px;
        background-color: #b8b8b8;
      }
    }
    li {
      text-align: start;
      padding: 0 0.5rem;
      transition: all 0.2s ease-out;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 0.5rem;
      border-radius: 0.5rem;
      .icon {
        display: block;
        width: 20px;
        height: 20px;
      }
      p {
        margin: 0;
      }

      &:hover {
        background-color: #eeeeee;
        cursor: pointer;
      }
    }
  }
}
</style>
