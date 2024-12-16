import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useHistoryStore } from "src/stores/tagViewStore";
import { useAuthStore } from "src/stores/authStore";
import { fakeBackend } from "src/fakeBackend";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  // 在导航守卫中更新历史记录
  Router.beforeEach(async (to, from, next) => {
    // 获取 Pinia store 实例
    const historyStore = useHistoryStore();
    if (to.path != "/login") {
      historyStore.addRoute(to); // 调用 store 中的添加方法
    }
    const authStore = useAuthStore();
    console.log("setMenuFlag ", authStore.setMenuFlag);
    const menus = await fakeBackend.getDynamicMenu();
    if (!authStore.setMenuFlag && menus) {
      menus.forEach((menu) => {
        Router.addRoute("Home", menu);
      });
    }
    // 检查是否需要登录
    if (to.meta.requiresAuth && !authStore.token) {
      next("/login"); // 未登录时跳转到登录页
    } else {
      if (!authStore.setMenuFlag) {
        authStore.setMenu(true);
        next({ ...to, replace: true });
      } else {
        next(); // 已登录则继续导航
      }
    }
  });

  return Router; // 修改此处以返回包含 historyStack 的对象
});
