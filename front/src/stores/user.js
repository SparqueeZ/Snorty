import { reactive, computed } from "vue";
import { getUserData } from "../services/authService";

const state = reactive({
  user: getUserData(),
});

export const useUserStore = () => {
  const user = computed(() => state.user);

  const setUser = (userData) => {
    state.user = userData;
  };

  const clearUser = () => {
    state.user = null;
  };

  return { user, setUser, clearUser };
};
