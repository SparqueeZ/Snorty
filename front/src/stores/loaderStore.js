import { defineStore } from "pinia";

export const useLoaderStore = defineStore({
  id: "loaderStore",
  state: () => ({
    showValue: false,
  }),
  getters: {
    getShowValue: (state) => state.showValue,
  },
  actions: {
    show() {
      this.showValue = true;
    },
    hide() {
      this.showValue = false;
    },
  },
});
