import { defineStore } from "pinia";
import { nextTick } from "vue";

export const useRuleStore = defineStore({
  id: "ruleStore",
  state: () => ({
    show: false,
    message: "",
  }),
  getters: {
    getPopupShow: (state) => state.show,
  },
  actions: {
    setMessage(message) {
      this.message = message;
    },
    showPopUp() {
      this.show = true;
    },
    hide() {
      this.show = false;
    },
  },
});
