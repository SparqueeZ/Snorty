import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "LoginView", component: LoginView },
  {
    path: "/register",
    name: "RegisterView",
    component: RegisterView,
    meta: { requiresSuperAuth: true },
  },
  {
    path: "/about",
    name: "AboutView",
    component: AboutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  try {
    if (!authStore.user) {
      await authStore.fetchUserProfile();
    }
  } catch (error) {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      return next({ name: "LoginView" });
    }
  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !authStore.user
  ) {
    return next({ name: "LoginView" });
  }

  if (to.matched.some((record) => record.meta.requiresSuperAuth)) {
    if (!authStore.user || authStore.user.role !== "administrator") {
      return next({ name: "Home" });
    }
  }

  next();
});

export default router;
