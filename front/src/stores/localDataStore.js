import { defineStore } from "pinia";
import {
  checkIfManySids,
  checkIfManyIps,
  checkIfManyPorts,
  checkSIDEntry,
  checkIpEntry,
  checkPortEntry,
  saveDataToLocalStoragev2,
} from "@/assets/localStore/localStore";

export const useLocalDataStore = defineStore({
  id: "localDataStorev2",
  state: () => ({
    localStorageData: JSON.parse(localStorage.getItem("SELKSAlerts")) || [],
    rulesData: JSON.parse(localStorage.getItem("SELKSRules")) || [],
    currentRule: {},
    currentAlert: {},
  }),
  // Getters
  getters: {
    getLocalStorageData: (state) => state.localStorageData,
    getRulesData: (state) => state.rulesData,
    getCurrentRule: (state) => state.currentRule,
    getCurrentAlert: (state) => state.currentAlert,
  },
  // Actions (setters)
  actions: {
    loadFromLocalStorage() {
      const storedData = localStorage.getItem("SELKSAlerts");
      if (storedData) {
        this.localStorageData = JSON.parse(storedData);
      }
    },
    saveToLocalStorage(data) {
      localStorage.setItem("SELKSAlerts", JSON.stringify(data));
      this.localStorageData =
        JSON.parse(localStorage.getItem("SELKSAlerts")) || [];
    },
    resetLocalStorage() {
      this.localStorageData = [];
    },
    removeFromToLocalStorage(index) {
      this.localStorageData.splice(index, 1);
      saveDataToLocalStoragev2(this.localStorageData);
    },
    updateState(index, newState, autoComment) {
      this.localStorageData[index].state = newState;

      let newCommentaryAuto = "";
      console.log("autoCommentValue", autoComment);

      if (autoComment) {
        if (newState === "remove")
          newCommentaryAuto = "\n- Suppression de l'alerte";
        if (newState === "limit")
          newCommentaryAuto = "\n- Mise en place d'une limite";
        if (newState === "waiting...") newCommentaryAuto = "\n- En attente";
        if (newState === "waiting for orders")
          newCommentaryAuto = "\n- Non traité";
      }

      if (!this.localStorageData[index].commentary)
        this.localStorageData[index].commentary = newCommentaryAuto;
      else this.localStorageData[index].commentary += newCommentaryAuto;
      saveDataToLocalStoragev2(this.localStorageData);
    },
    changeDone(index, newDone, newCommentaryAuto) {
      if (newCommentaryAuto.includes("$date"))
        newCommentaryAuto = newCommentaryAuto.replace(
          "$date",
          getCurrentDate()
        );
      this.localStorageData[index].done = newDone;
      if (!this.localStorageData[index].commentary) {
        this.localStorageData[index].commentary = newCommentaryAuto;
      } else
        this.localStorageData[index].commentary += `\n${newCommentaryAuto}`;

      saveDataToLocalStoragev2(this.localStorageData);
    },
    changeToDo(index, newToDo, newCommentaryAuto) {
      if (newCommentaryAuto.includes("$date"))
        newCommentaryAuto = newCommentaryAuto.replace(
          "$date",
          getCurrentDate()
        );
      this.localStorageData[index].toDo = newToDo;
      if (!this.localStorageData[index].commentary) {
        this.localStorageData[index].commentary = newCommentaryAuto;
      } else
        this.localStorageData[index].commentary += `\n${newCommentaryAuto}`;
      saveDataToLocalStoragev2(this.localStorageData);
    },
    updateCommentary(index, newCommentary) {
      this.localStorageData[index].commentary = newCommentary;
      saveDataToLocalStoragev2(this.localStorageData);
    },
    updateItem(index, newItem) {
      this.localStorageData[index] = newItem;
      saveDataToLocalStoragev2(this.localStorageData);
    },
    setCurrentAlert(data) {
      this.currentAlert = data;
    },
    updateCurrentAlert() {
      saveDataToLocalStoragev2(this.localStorageData);
    },
    resetStatusAndCommentaries(index) {
      this.localStorageData[index].commentary = "";
      this.localStorageData[index].done = false;
      saveDataToLocalStoragev2(this.localStorageData);
    },
    // ------------------- Partie règles v2 -------------------

    selectRuleData(data) {
      const sid = data.alert.signature_id;
      const rulename = data.alert.signature;
      this.setCurrentAlert(data);

      const foundRule = this.rulesData.find((e) => Number(e.sid) === sid);

      if (foundRule) {
        // Si une règle existante est trouvée on récupère
        this.currentRule = foundRule;
      } else {
        // Sinon on crée une règle
        const newRule = {
          sid: sid,
          rulename: rulename,
          modifiers: [],
        };
        this.insertRule(newRule);
        this.currentRule = newRule;
      }
    },
    insertRule(data) {
      this.rulesData.push(data);
      localStorage.setItem("SELKSRules", JSON.stringify(this.rulesData));
    },
    updateCurrentRule() {
      let foundRule = this.rulesData.find(
        (r) => r.sid === this.currentRule.sid
      );

      if (foundRule) {
        foundRule = this.currentRule;
        localStorage.setItem("SELKSRules", JSON.stringify(this.rulesData));
      }
    },
    updateCurrentAlertStatus(bool, commentary) {
      this.getCurrentAlert.done = bool;
      const index = this.localStorageData.findIndex(
        (a) => (a = this.getCurrentAlert)
      );
      this.changeDone(index, bool, commentary);
    },
    importRuleModifier(data) {
      console.log(data);

      const newModifier = {
        action: data.action,
        protocol: data.protocol,
        ip_src: data.srcIp,
        ip_dest: data.destIp,
        port_src: data.srcPort,
        port_dest: data.destPort,
        options: data.options,
        ruleName: `Règles #${this.getCurrentRule.modifiers.length}`,
        ruleMethod: "import",
        ruleArchived: false,
        ruleVisible: true,
      };
      this.getCurrentRule.modifiers.push(newModifier);
      this.updateCurrentRule();
    },
    addRuleModifier() {
      if (
        this.getCurrentRule.modifiers.find(
          (e) =>
            e.ip_src.value.includes(this.getCurrentAlert.src_ip) &&
            e.ip_dest.value.includes(this.getCurrentAlert.dest_ip)
        )
      ) {
        const newModifier = {
          action: "",
          protocol: "",
          ip_src: [],
          ip_dest: [],
          port_src: [],
          port_dest: [],
          options: [{ name: "sid", value: "490001" }],
          ruleName: `Règles #${this.getCurrentRule.modifiers.length}`,
          ruleMethod: "manual",
          ruleArchived: false,
          ruleVisible: true,
        };
        this.getCurrentRule.modifiers.push(newModifier);
      } else {
        const currentAlert = this.getCurrentAlert;

        const srcIp = currentAlert.src_ip.toString();
        const srcIpObject = {
          name: "srcIp",
          include: srcIp.includes("!") ? "!" : "",
          value: srcIp.replace("!", "").split(",").map(String),
        };

        const srcPort = currentAlert.src_port.toString();
        const srcPortObject = {
          name: "srcPort",
          include: srcPort.includes("!") ? "!" : "",
          value: srcPort.replace("!", "").split(",").map(String),
        };

        const destIp = currentAlert.dest_ip.toString();
        const destIpObject = {
          name: "destIp",
          include: destIp.includes("!") ? "!" : "",
          value: destIp.replace("!", "").split(",").map(String),
        };

        const destPort = currentAlert.dest_port.toString();
        const destPortObject = {
          name: "destPort",
          include: destPort.includes("!") ? "!" : "",
          value: destPort.replace("!", "").split(",").map(String),
        };

        const newModifier = {
          action: "alert",
          protocol: currentAlert.proto.toLowerCase(),
          ip_src: srcIpObject,
          ip_dest: destIpObject,
          port_src: srcPortObject,
          port_dest: destPortObject,
          options: [
            { name: "msg", value: this.getCurrentRule.rulename },
            { name: "sid", value: "490001" },
            { name: "metadata", value: this.getCurrentRule.sid },
          ],
          ruleName: `Règles #${this.getCurrentRule.modifiers.length}`,
          ruleMethod: "auto import",
          ruleArchived: false,
          ruleVisible: true,
        };

        this.getCurrentRule.modifiers.push(newModifier);
      }

      this.updateCurrentRule();
    },
    updateRuleModifier(modifier, modifierIndex) {
      this.getCurrentRule.modifiers[modifierIndex] = modifier;
      this.updateCurrentRule();
    },
    removeRuleModifier(index) {
      this.getCurrentRule.modifiers.splice(index, 1);
      this.updateCurrentRule();
    },
    switchArchivedRuleModifier(index) {
      this.getCurrentRule.modifiers[index].ruleArchived =
        !this.getCurrentRule.modifiers[index].ruleArchived;
      this.updateCurrentRule();
    },
    switchVisibleRuleModifier(index) {
      this.getCurrentRule.modifiers[index].ruleVisible =
        !this.getCurrentRule.modifiers[index].ruleVisible;
      this.updateCurrentRule();
    },

    addRuleOption(modifierIndex, type) {
      if (type === "content") {
        const newContentOption = {
          name: "content",
          include: "",
          value: "",
          offset: 0,
          depth: 0,
          within: 0,
          distance: 0,
          nocase: false,
          uri: false,
          endswith: false,
        };
        this.getCurrentRule.modifiers[modifierIndex].options.push(
          newContentOption
        );
      } else {
        const newContent = {
          name: "",
          value: "",
        };
        this.getCurrentRule.modifiers[modifierIndex].options.push(newContent);
      }

      this.updateCurrentRule();
    },
    updateOption(modifierIndex, optionIndex, type, value) {
      if (optionIndex >= 0) {
        const option =
          this.getCurrentRule.modifiers[modifierIndex].options[optionIndex];
        const validTypes = {
          name: "name",
          value: "value",
          endswith: "endswith",
          nocase: "nocase",
        };

        if (validTypes[type]) {
          option[validTypes[type]] = value;

          this.updateCurrentRule();
        } else {
          console.warn(`Type '${type}' non valide`);
        }
      } else if (optionIndex === -1) {
        const modifier = this.getCurrentRule.modifiers[modifierIndex];
        const validTypes = {
          ip_src_include: "ip_src_include",
          ip_src: "ip_src",
          port_src_include: "port_src_include",
          port_src: "port_src",
          ip_dest_include: "ip_dest_include",
          ip_dest: "ip_dest",
          port_dest_include: "port_dest_include",
          port_dest: "port_dest",
        };
        if (validTypes[type]) {
          if (type.includes("include")) {
            let validTypesTest =
              modifier[validTypes[type].replace("_include", "")];
            validTypesTest = value;
          } else modifier[validTypes[type]].value = value;

          this.updateCurrentRule();
        } else {
          console.warn(`Type '${type}' non valide`);
        }
      } else if (optionIndex === -2) {
        const modifier = this.getCurrentRule.modifiers[modifierIndex];

        const validTypes = {
          action: "action",
          protocol: "protocol",
        };

        if (validTypes[type]) {
          modifier[validTypes[type].replace("_include", "")] = value;
          this.updateCurrentRule();
        } else {
          console.warn(`Type '${type}' non valide`);
        }
      } else console.warn(`optionIndex '${optionIndex}' non valide.`);
    },
    deleteRuleOption(modifierIndex, contentIndex) {
      this.getCurrentRule.modifiers[modifierIndex].options.splice(
        contentIndex,
        1
      );
      this.updateCurrentRule();
    },
  },
});

// Ajouter le DC 2 pour l'sid 3301104

function getCurrentDate() {
  const now = new Date();
  const Year = now.getFullYear();
  const Month = String(now.getMonth() + 1).padStart(2, "0");
  const Day = String(now.getDate()).padStart(2, "0");
  const Hours = String(now.getHours()).padStart(2, "0");
  const Minutes = String(now.getMinutes()).padStart(2, "0");
  const Seconds = String(now.getSeconds()).padStart(2, "0");
  return `${Year}/${Month}/${Day} à ${Hours}:${Minutes}:${Seconds}`;
}
