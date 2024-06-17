import { defineStore } from "pinia";

export const useContextMenu = defineStore({
  id: "contextMenuStore",
  state: () => ({
    visibility: false,
    menu: [],
    position: { x: 0, y: 0 },
  }),
  getters: {
    getVisibility: (state) => state.visibility,
    getMenu: (state) => state.menu,
    getPosition: (state) => state.position,
  },
  actions: {
    visible(x, y) {
      this.position.x = x;
      this.position.y = y;
      this.visibility = true;
    },
    invisible() {
      this.visibility = false;
    },
    setMenu(array) {
      this.menu = array;
    },
  },
});
