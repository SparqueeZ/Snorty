<template>
  <section class="table">
    <transition name="contextMenuAppear">
      <ContextMenu
        :menu="contextMenu.getMenu"
        v-if="contextMenu.getVisibility"
      />
    </transition>
    <h2>Alertes traitées</h2>

    <div class="searchBarContainer">
      <div class="iconContainer">
        <Icon name="search" />
      </div>
      <input
        v-model="filter"
        type="text"
        @keypress.enter="addFilter"
        @input="addFilter"
        class="searchBar"
      />
    </div>

    <section class="alertItems">
      <alertItem
        v-for="(item, index) in filteredData"
        :alertItem="item"
        :alerts="alerts"
        :index="index"
      >
      </alertItem>

      <!-- <alertItem
        v-for="(alertItem, index) in filteredData"
        :alertItem="alertItem"
        :index="index"
      /> -->
    </section>
  </section>
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from "vue";
import ContextMenu from "./ContextMenu.vue";
import alertItem from "./ruleManager/alertItem.vue";
import Icon from "./lib/Icon.vue";
import { useContextMenu } from "@/stores/ContextMenuStore";

const contextMenu = useContextMenu();
const props = defineProps({
  alerts: Array,
  autoComment: Boolean,
});

props.alerts.forEach((item) => {
  item.editMode = false;
  item.showSearchContext = false;
  item.showActionsContext = false;
  item.confirmDelete = false;
  item.done = item.done;
  item.toDo = item.toDo;
});

const filter = ref("");
const filteredData = ref(props.alerts);

const addFilter = () => {
  const filterValue = filter.value;
  if (!filterValue) {
    filteredData.value = props.alerts;
    return;
  }
  const newData = props.alerts.filter((a) => {
    if (a.alert.signature_id.toString().includes(filterValue)) {
      return a;
    } else if (a.alert.signature.toString().includes(filterValue)) {
      return a;
    } else if (a.src_ip.toString().includes(filterValue)) {
      return a;
    } else if (a.dest_ip.toString().includes(filterValue)) {
      return a;
    }
  });
  filteredData.value = newData;
};

watch(filter, addFilter);

const alerts = ref(props.alerts);
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
h2 {
  width: fit-content;
}

.searchBarContainer {
  display: flex;
  background-color: #d5dfe5;
  padding: 1rem;
  width: fit-content;
  border-radius: 0.3rem;
  .searchBar {
    background-color: transparent;
    outline: none;
    border: none;
    font-size: 16px;
  }
  .iconContainer {
    width: 20px;
    height: 20px;
    .icon {
      display: block;
      width: 20px;
      height: 20px;
      fill: #b7bfc4;
    }
  }
}

.alertItems {
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;
  width: calc(100% - 2rem);
  padding-bottom: 2rem;
  .alertItem {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #d5dfe5;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    width: calc(100% - 2rem);

    .statusBar {
      display: flex;
      justify-content: space-between;

      .ruleStatus {
        display: flex;
        align-items: center;
        gap: 1rem;
        .stateLed {
          width: 10px;
          height: 10px;
          border-radius: 50%;

          &.green {
            background-color: #6ab547;
          }
          &.orange {
            background-color: #ee8434;
          }
        }
        p {
          margin: 0;
        }
      }

      .actions {
        display: flex;
        gap: 1rem;
        position: relative;
        .action {
          background-color: #e8edf0;
          padding: 0.2rem;
          border-radius: 0.3rem;
          width: fit-content;
          transition: all 0.1s ease-out;
          display: flex;
          justify-content: center;
          align-items: center;
          height: fit-content;
          .icon {
            width: 20px;
            height: 20px;
            overflow: hidden;
            .icon {
              display: block;
              width: 20px;
              height: 20px;
            }
          }
          p {
            margin: 0;
            line-height: 10px;
          }

          &.textBtn {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            gap: 0.3rem;
          }

          &:hover {
            background-color: #f3f3f3;
            cursor: pointer;

            &[data-name="deleteBtn"] {
              fill: red;
            }
          }

          &.red {
            fill: red;
          }

          &.green {
            fill: #6ab547;
          }
        }
      }
    }

    .signatureInfos {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin: 0;
      }

      .nameAndProto {
        display: flex;
        gap: 1rem;
        max-width: 80%;

        .proto {
          padding: 0.1rem 0.3rem;
          border-radius: 0.3rem;
          background-color: #779be7;
          color: #273b66;
          font-weight: 700;
          text-transform: uppercase;
          height: fit-content;
        }
      }
      .SID {
        text-align: end;
        min-width: 100px;

        mark {
          background-color: transparent;
          color: #779be7;
          text-decoration: underline;
        }
      }
    }
    .ipsInfos {
      .ipsAndVlans {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ip {
        display: flex;
        .src_ip,
        .src_port {
          background-color: transparent;
          outline: none;
          border: 0;
          height: fit-content;
          width: max-content;

          &:active,
          :focus-visible {
            border: 0;
            outline: none;
          }
        }
        .src_port {
          margin-left: 10px;
        }
        .dest_ip,
        .dest_port {
          background-color: transparent;
          outline: none;
          border: 0;
          height: fit-content;
          width: max-content;

          &:active,
          :focus-visible {
            border: 0;
            outline: none;
          }
        }
        .dest_port {
          margin-left: 10px;
        }
        p {
          padding: 0;
          margin: 0;
          line-height: 16px;
        }
      }
      .vlan {
        display: flex;

        p {
          padding: 0;
          margin: 0;
        }
      }
    }
    .userInfos {
      .userCommentary {
        width: 100%;
        min-height: 55px;
        max-width: 100%;
        resize: vertical;
        outline: none;
      }
    }
  }
}
</style>
