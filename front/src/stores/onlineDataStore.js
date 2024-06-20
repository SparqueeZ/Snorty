import { defineStore } from "pinia";
import {
  updateRule,
  getCurrentDate,
  updateAlert,
  removeAlert,
  storeAlert,
  insertRule,
} from "@/assets/lib/onlineStore";
import axios from "axios";

export const useOnlineStore = defineStore({
  id: "onlineStore",
  state: () => ({
    alerts: [],
    rules: [],
    currentRule: {},
    currentAlert: {},
    loading: false,
    error: null,
  }),
  getters: {
    getAlerts: (state) => state.alerts,
    getRules: (state) => state.rules,
    getCurrentRule: (state) => state.currentRule,
    getCurrentAlert: (state) => state.currentAlert,
  },
  actions: {
    async fetchAlerts() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SELKSC_API_URL}/api/data/getAlerts`
        );
        this.alerts = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async fetchRules() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SELKSC_API_URL}/api/data/getRules`
        );
        this.rules = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    // Get current Alert and Rule
    setCurrentAlert(data) {
      this.currentAlert = data;
    },
    selectRuleData(data) {
      const sid = data.alert.signature_id;
      const rulename = data.alert.signature;
      this.setCurrentAlert(data);

      const foundRule = this.rules.find((e) => Number(e.sid) === sid);

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
        console.log(this.currentRule);
      }
    },

    // Rules
    insertRule(data) {
      this.rules.push(data);
      insertRule(data);
      console.log("saving rules...");
      // localStorage.setItem("SELKSRules", JSON.stringify(this.rulesData));
    },
    updateRuleName(name) {
      this.currentRule.rulename = name;
      this.updateCurrentRule();
    },

    // Alerts
    addAlert(data) {
      storeAlert(data);
      setTimeout(() => {
        this.fetchAlerts();
      }, 200);
    },
    removeAlert(index) {
      const id = this.alerts[index]._id;
      // console.log(this.alerts[index]._id);
      this.alerts.splice(index, 1);
      removeAlert(id);
    },
    updateAlert(index, newAlert) {
      this.alerts[index] = newAlert;
      updateAlert(this.alerts[index]._id, this.alerts[index]);
    },
    updateAlertToDo(index, newToDo, newCommentaryAuto) {
      if (newCommentaryAuto.includes("$date"))
        newCommentaryAuto = newCommentaryAuto.replace(
          "$date",
          getCurrentDate()
        );
      this.alerts[index].toDo = newToDo;
      if (!this.alerts[index].commentary) {
        this.alerts[index].commentary = newCommentaryAuto;
      } else this.alerts[index].commentary += `\n${newCommentaryAuto}`;

      // console.log("saving...", this.alerts[index]._id);
      updateAlert(this.alerts[index]._id, this.alerts[index]);
    },
    updateAlertCommentary(index, newCommentary) {
      this.alerts[index].commentary = newCommentary;
      updateAlert(this.alerts[index]._id, this.alerts[index]);
    },
    updateAlertDone(index, newDone, newCommentaryAuto) {
      if (newCommentaryAuto.includes("$date"))
        newCommentaryAuto = newCommentaryAuto.replace(
          "$date",
          getCurrentDate()
        );
      this.alerts[index].done = newDone;
      if (!this.alerts[index].commentary) {
        this.alerts[index].commentary = newCommentaryAuto;
      } else this.alerts[index].commentary += `\n${newCommentaryAuto}`;
      console.log("saving done...");
      updateAlert(this.alerts[index]._id, this.alerts[index]);
    },
    updateCurrentAlertStatus(bool, commentary) {
      this.getCurrentAlert.done = bool;
      const index = this.alerts.findIndex((a) => (a = this.getCurrentAlert));
      this.updateAlertDone(index, bool, commentary);
    },
    resetStatusAndCommentaries(index) {
      this.alerts[index].commentary = "";
      this.alerts[index].done = false;
      this.alerts[index].toDo = "";
      updateAlert(this.alerts[index]._id, this.alerts[index]);
    },

    // Modifiers
    updateCurrentRule() {
      let rule = this.rules.find((r) => r.sid === this.currentRule.sid);

      if (rule) {
        // foundRule = this.currentRule;
        // localStorage.setItem("SELKSRules", JSON.stringify(this.rulesData));
        updateRule(this.currentRule);
      }
    },
    addRuleModifier() {
      const currentAlert = this.getCurrentAlert;

      const newModifier = {
        action: "",
        protocol: "",
        ip_src: [],
        ip_dest: [],
        port_src: [],
        port_dest: [],
        options: [
          {
            name: "sid",
            value:
              String(this.getCurrentRule.new_sid) +
              String(this.getCurrentRule.modifiers.length + 1),
          },
        ],
        ruleName: `Règles #${this.getCurrentRule.modifiers.length}`,
        ruleMethod: "manual",
        ruleArchived: false,
        ruleVisible: true,
      };
      if (
        this.getCurrentRule.modifiers.find(
          (e) =>
            e.ip_src.value.includes(this.getCurrentAlert.src_ip) &&
            e.ip_dest.value.includes(this.getCurrentAlert.dest_ip)
        )
      ) {
        this.getCurrentRule.modifiers.push(newModifier);
      } else {
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

        newModifier.action = "alert";
        newModifier.protocol = currentAlert.proto.toLowerCase();
        newModifier.ip_src = srcIpObject;
        newModifier.ip_dest = destIpObject;
        newModifier.port_src = srcPortObject;
        newModifier.port_dest = destPortObject;
        newModifier.options = [
          { name: "msg", value: this.getCurrentRule.rulename },
          {
            name: "sid",
            value:
              String(this.getCurrentRule.new_sid) +
              String(this.getCurrentRule.modifiers.length + 1),
          },
          { name: "metadata", value: this.getCurrentRule.sid },
        ];
        newModifier.ruleMethod = "auto import";

        this.getCurrentRule.modifiers.push(newModifier);
      }

      // console.log("Saving...");
      // updateRule()
      this.updateCurrentRule();
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
    updateRuleModifier(modifier, modifierIndex) {
      this.getCurrentRule.modifiers[modifierIndex] = modifier;
      this.updateCurrentRule();
    },
    removeRuleModifier(modifier_index) {
      this.getCurrentRule.modifiers.splice(modifier_index, 1);
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
    // Options
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
