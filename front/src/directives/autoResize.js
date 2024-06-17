export default {
  mounted(el) {
    const setWidth = () => {
      el.style.width = el.value.length + "ch";
    };

    el.addEventListener("input", setWidth());
    setWidth();
  },
  unmounted(el) {
    el.removeEventListener("input", setWidth());
  },
};
