<template>
  <article
    class="alertItem"
    @contextmenu="toggleContextMenuVisibility($event, 'alertItem')"
  >
    <div class="statusBar">
      <div class="ruleStatus">
        <div class="toDoIndicator">
          <div class="iconContainer">
            <Icon
              :class="alertItem.done ? 'done' : ''"
              :name="getIndicatorIcon(alertItem)"
            />
          </div>
        </div>

        <p>
          {{
            getAlertStatus(alertItem)
              ? "Règle modifiée."
              : "Règle non modifiée."
          }}
        </p>
      </div>

      <div class="actions">
        <a v-if="urlHash" :href="`${urlHash}`">
          <div class="action textBtn" data-name="redirectBtn">
            <p>VirusTotal</p>
            <img
              src="../../assets/images/virustotal.svg"
              alt=""
              srcset=""
              class="icon"
            />
          </div>
        </a>

        <a
          :href="
            getURL(
              alertItem.alert.signature_id,
              alertItem.src_ip,
              alertItem.src_port,
              alertItem.dest_ip,
              alertItem.dest_port,
              'precise'
            )
          "
        >
          <div
            class="action textBtn"
            data-name="redirectBtn"
            title="Rerchercher la même alerte (Attention les archives de EveBox vont jusqu'à 30 jours !)."
          >
            <p>Y aller</p>
            <Icon name="redirect" />
          </div>
        </a>

        <div
          @click="toggleContextMenuVisibility($event, 'searchBtn')"
          class="action"
          data-name="searchBtn"
          title="Réaliser une recherche spécifique."
        >
          <Icon name="search" />
        </div>

        <div
          @click="toggleContextMenuVisibility($event, 'actionBtn')"
          class="action"
          data-name="actionBtn"
          title="Réaliser une action sur cette alerte"
        >
          <Icon name="action" />
        </div>

        <div
          @click="showRuleForm(alertItem)"
          class="action"
          title="Créer une règle"
        >
          <Icon name="addSquared" />
        </div>

        <div
          v-if="!alertItem.editMode"
          @click="alertItem.editMode = !alertItem.editMode"
          class="action"
          data-name="editBtn"
          title="Editer les informations de l'alerte"
        >
          <Icon name="edit" />
        </div>

        <div
          v-if="alertItem.editMode"
          class="action green"
          data-name="deleteBtnConfirm"
          title="Confirmer retirer la règle"
          @click="
            alertItem.editMode = !alertItem.editMode;
            sendUpdateAlert(index);
          "
        >
          <Icon name="check" />
        </div>

        <div
          v-if="alertItem.editMode"
          class="action red"
          data-name="deleteBtnCancel"
          title="Annuler retirer la règle"
          @click="alertItem.editMode = !alertItem.editMode"
        >
          <Icon name="cross" />
        </div>

        <div
          v-if="!alertItem.confirmDelete"
          @click="alertItem.confirmDelete = !alertItem.confirmDelete"
          class="action"
          data-name="deleteBtn"
          title="Retirer la règle"
        >
          <Icon name="delete" />
        </div>

        <div
          v-if="alertItem.confirmDelete"
          class="action green"
          data-name="deleteBtnConfirm"
          title="Confirmer retirer la règle"
          @click="
            alertItem.confirmDelete = !alertItem.confirmDelete;
            onlineStore.removeAlert(index);
          "
        >
          <Icon name="check" />
        </div>

        <div
          v-if="alertItem.confirmDelete"
          class="action red"
          data-name="deleteBtnCancel"
          title="Annuler retirer la règle"
          @click="alertItem.confirmDelete = !alertItem.confirmDelete"
        >
          <Icon name="cross" />
        </div>
      </div>
    </div>

    <div class="signatureInfos">
      <div class="nameAndProto">
        <p v-if="alertItem.app_proto" class="proto">
          {{ alertItem.app_proto }}
        </p>
        <p class="name">{{ alertItem.alert.signature }}</p>
      </div>
      <a
        :href="`https://172.30.4.145/rules/rule/pk/${alertItem.alert.signature_id}/`"
      >
        <p class="SID">
          SID : <mark class="mark">{{ alertItem.alert.signature_id }}</mark>
        </p>
      </a>
    </div>

    <div class="ipsInfos">
      <div class="ipsAndVlans">
        <div class="ip">
          <input
            v-if="alertItem.editMode"
            class="src_ip"
            type="text"
            v-model="alertItem.src_ip"
            @keypress.enter="sendUpdateAlert(index)"
          />
          <p v-else class="src_ip">{{ alertItem.src_ip }}</p>
          <p>:</p>
          <input
            v-if="alertItem.editMode"
            class="src_port"
            type="text"
            v-model="alertItem.src_port"
          />
          <p v-else class="src_port">{{ alertItem.src_port }}</p>
          <p>--></p>
          <input
            v-if="alertItem.editMode"
            class="dest_ip"
            type="text"
            v-model="alertItem.dest_ip"
          />
          <p v-else class="dest_ip">{{ alertItem.dest_ip }}</p>
          <p>:</p>
          <input
            v-if="alertItem.editMode"
            class="dest_port"
            type="text"
            v-model="alertItem.dest_port"
          />
          <p v-else class="dest_port">{{ alertItem.dest_port }}</p>
        </div>
        <div class="vlan">
          <p>VLAN(s) : {{ alertItem.vlan.join(", ") }}</p>
        </div>
      </div>
    </div>

    <div class="payloadToggle">
      <div
        class="button"
        @click="alertItem.showPayload = !alertItem.showPayload"
      >
        <div class="iconContainer">
          <Icon v-if="alertItem.showPayload" name="hide" />
          <Icon v-else name="visible" />
        </div>
        {{ alertItem.showPayload ? "Masquer Payload" : "Afficher Payload" }}
      </div>
    </div>

    <div class="payloadInfos" v-if="alertItem.showPayload">
      <p v-if="alertItem.payload_printable">
        {{ alertItem.payload_printable }}
      </p>
      <p v-else-if="alertItem.http.http_response_body_printable">
        HTTP Body :
        {{ alertItem.http.http_response_body_printable }}
      </p>
    </div>

    <div class="userInfos">
      <h3>Commentaires</h3>
      <textarea
        class="userCommentary"
        :name="`commentary_${index}`"
        :id="`commentary_${index}`"
        v-model="alertItem.commentary"
        @input="updateAlertCommentary()"
      ></textarea>
    </div>
  </article>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { debounce } from "lodash";
import virustotal from "@/assets/images/virustotal.svg";
import CryptoJS from "crypto-js";
import Icon from "@/components/lib/Icon.vue";
import ContextMenu from "@/components/ContextMenuOld.vue";
import AlertPopup from "@/components/AlertPopup.vue";
import { useContextMenu } from "@/stores/ContextMenuStore";
import { usePopupStore } from "@/stores/popUpStore";
import { useRuleStore } from "@/stores/RulePopup";
import { useOnlineStore } from "@/stores/onlineDataStore";
import { useAuthStore } from "@/stores/auth";

const onlineStore = useOnlineStore();
const contextMenu = useContextMenu();
const authStore = useAuthStore();
const popupStore = usePopupStore();
const ruleStore = useRuleStore();

const props = defineProps({
  autoComment: Boolean,
  alertItem: Object,
  index: Number,
  alerts: Array,
});

const urlHash = ref(null);
const contextMenus = ref([
  {
    name: "alertItem",
    data: [
      {
        group: "search",
        name: "Rechercher sur EveBox",
        icon: "search",
        id: 0,
        link: `${getURL(
          props.alertItem.alert.signature_id,
          props.alertItem.src_ip,
          props.alertItem.src_port,
          props.alertItem.dest_ip,
          props.alertItem.dest_port,
          "precise"
        )}`,
      },
      {
        group: "search",
        name: "Rechercher sur VirusTotal",
        img: virustotal,
        id: 1,
        link: `${generateHash(props.alertItem.payload_printable)}`,
      },
    ],
  },
  {
    name: "searchBtn",
    data: [
      {
        group: "search",
        name: "Recherche par IP SRC",
        icon: "search",
        id: 0,
        link: `https://172.30.4.145/evebox/#/events?q=src_ip%3A"${props.alertItem.src_ip}"`,
      },
      {
        group: "search",
        name: "Recherche par IP DST",
        icon: "search",
        id: 1,
        link: `https://172.30.4.145/evebox/#/events?q=dest_ip%3A"${props.alertItem.dest_ip}"`,
      },
      {
        group: "search",
        name: "Recherche par SID",
        icon: "search",
        id: 2,
        link: `https://172.30.4.145/evebox/#/events?q=signature.alert%3A"${props.alertItem.alert.signature_id}"`,
      },
    ],
  },
  {
    name: "actionBtn",
    data: [
      {
        group: "A faire",
        name: "Mettre en attente",
        icon: "alarm",
        id: 0,
        handler: () =>
          onlineStore.updateAlertToDo(
            props.index,
            "waiting",
            `${authStore.user.username} | Vu le : $date | Mise en attente`
          ),
      },

      {
        group: "A faire",
        name: "Mettre une limite",
        icon: "hourglass",
        id: 1,
        handler: () =>
          onlineStore.updateAlertToDo(
            props.index,
            "limit",
            `${authStore.user.username} | Vu le : $date | A mettre en place : une limite`
          ),
      },
      {
        group: "A faire",
        name: "Mettre en silence",
        icon: "mute",
        id: 2,
        handler: () =>
          onlineStore.updateAlertToDo(
            props.index,
            "silence",
            `${authStore.user.username} | Vu le : $date | A mettre en place : en silence`
          ),
      },
      {
        group: "A faire",
        name: "Ne rien faire",
        icon: "speaker",
        id: 3,
        handler: () =>
          onlineStore.updateAlertToDo(
            props.index,
            "keeping",
            `${authStore.user.username} | Vu le : $date | Ne rien faire`
          ),
      },

      {
        group: "Action",
        name: "Changer en 'modifiée'",
        icon: "action",
        id: 4,
        handler: () =>
          onlineStore.updateAlertDone(
            props.index,
            true,
            `${authStore.user.username} | Statut 'modifiée' le $date`
          ),
      },
      {
        group: "Action",
        name: "Changer en 'non modifiée'",
        icon: "action",
        id: 5,
        handler: () =>
          onlineStore.updateAlertDone(
            props.index,
            false,
            `${authStore.user.username} | Statut 'non modifiée' le $date`
          ),
      },
      {
        group: "Action",
        name: "Reset",
        icon: "clock",
        id: 6,
        handler: () => {
          onlineStore.resetStatusAndCommentaries(props.index);
          onlineStore.updateAlertDone(
            props.index,
            false,
            `${authStore.user.username} | Remise à zéro du statut et des commentaires le $date`
          );
        },
      },
    ],
  },
]);

const updateAlertCommentary = debounce(() => {
  onlineStore.updateAlertCommentary(props.index, props.alertItem.commentary);
}, 700);

function extractURL(payload) {
  const urlPattern = /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;
  const matches = payload.match(urlPattern);
  if (matches && matches.length > 0) {
    const URL = "http://" + matches[0] + "/";
    return URL;
  }
  return null;
}

function generateHash(input) {
  const URL = extractURL(input);
  if (URL) {
    urlHash.value = CryptoJS.SHA256(URL).toString(CryptoJS.enc.Hex);
    // console.log(URL, urlHash.value);
    return `https://www.virustotal.com/gui/url/${urlHash.value}`;
  }
  if (!URL) {
    setTimeout(() => {
      const index = contextMenus.value.findIndex((m) => m.name === "alertItem");
      const cmitem = contextMenus.value[index];
      contextMenus.value[index].data;

      const dataIndex = cmitem.data.findIndex((e) =>
        e.name.includes("VirusTotal")
      );
      contextMenus.value[index].data.splice(dataIndex, 1);
    }, 1);
  }
}

onMounted(() => {
  updateURLHash(props.alertItem.payload_printable);
});

function updateURLHash(payload) {
  urlHash.value = generateHash(payload);
}

const getIndicatorIcon = (alertItem) => {
  if (alertItem.toDo === "waiting") return "alarm";
  else if (alertItem.toDo === "limit") return "hourglass";
  else if (alertItem.toDo === "silence") return "mute";
  else if (alertItem.toDo === "keeping") return "speaker";
  else return "clock";
};

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

const showRuleForm = (data) => {
  onlineStore.selectRuleData(data);
  ruleStore.showPopUp();
};

function getURL(signature, ip_src, port_src, ip_dest, port_dest, type) {
  let signature_query = `alert.signature_id%3A"${signature}"`;
  let ip_src_query = `src_ip%3A"${ip_src}"`;
  let ip_dest_query = `dest_ip%3A"${ip_dest}"`;
  let port_src_query = `src_port%3A"${port_src}"`;
  let port_dest_query = `dest_port%3A"${port_dest}""`;

  if (ip_src === "any") ip_src_query = "";
  if (ip_dest === "any") ip_dest_query = "";
  if (port_src === "") port_src_query = "";
  if (port_dest === "") port_dest_query = "";

  let plusOrNot = "";
  if (ip_dest_query) plusOrNot = "+";

  let plusOrNot2 = "";
  if (type === "precise") plusOrNot2 = "+";
  if (type !== "precise") signature = "";
  if (type === "precise") type = "events";

  return `https://172.30.4.145/evebox/#/${type}?q=${ip_src_query}${plusOrNot}${ip_dest_query}${plusOrNot2}${signature}`;
}
const alerts = ref(props.alerts);
if (props.alerts) {
  console.log(props.alerts);
  props.alerts.forEach((item) => {
    item.editMode = false;
    item.showSearchContext = false;
    item.showActionsContext = false;
    item.confirmDelete = false;
    item.done = item.done;
    item.toDo = item.toDo;
  });
} else {
  console.warn("Alert array not found.");
}
const sendUpdateAlert = (index) => {
  alerts.value[index].editMode = false;
  onlineStore.updateAlert(index, alerts.value[index]);
};

const getAlertStatus = (alertItem) => {
  if (alertItem.done) return true;
  else return false;
};
</script>

<style lang="scss" scoped>
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
      .toDoIndicator {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-radius: 0.3rem;
        .iconContainer {
          width: 20px;
          height: 20px;
          display: block;
        }
        .icon {
          fill: #ffaa00;
          &.done {
            fill: #5bb20f;
          }
        }
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
      align-items: center;
      gap: 1rem;
      max-width: 80%;

      .name {
        font-size: 20px;
        font-weight: 600;
      }

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
        font-size: 16px;
        margin: 0 10px;
        font-weight: 600;

        &:active,
        :focus-visible {
          border: 0;
          outline: none;
        }
      }
      // .src_port,
      // .dest_port {
      //   margin-left: 10px;
      // }
      .dest_ip,
      .dest_port {
        background-color: transparent;
        outline: none;
        border: 0;
        height: fit-content;
        width: max-content;
        font-size: 16px;
        font-weight: 600;
        margin: 0 10px;

        &:active,
        :focus-visible {
          border: 0;
          outline: none;
        }
      }
      // .dest_ip,
      // .src_ip {
      //   margin-right: 10px;
      // }
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
  .payloadToggle {
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
      &:hover {
        background-color: #e8e8e8;
        cursor: pointer;
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
</style>
