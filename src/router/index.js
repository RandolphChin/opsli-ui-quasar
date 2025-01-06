import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { constantRoutes } from "./routes";
import { useHistoryStore } from "src/stores/tagViewStore";
import { useAuthStore } from "src/stores/authStore";

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
    routes: constantRoutes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  // 在导航守卫中更新历史记录
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    // 如果是登录页面，直接放行
    if (to.path == "/login") {
      return next(); // 已经在登录页，直接放行
    }
    const historyStore = useHistoryStore();
    if (to.path != "/login") {
      historyStore.addHistory(to); // 调用 store 中的添加方法
    }

    const accessToken = authStore.accessToken;
    if(!accessToken){
      next("/login");
    }else {
      if(authStore.roles.length == 0 && !authStore.setMenuFlag){
          await authStore.handelUserInfo();
          await authStore.handelUserMenu();

        authStore.accessRoutes.forEach(v=>{
          // Router.addRoute("Home", v);
            Router.addRoute(v);
        })

          authStore.setMenu(true);
          next({ ...to, replace: true })
      }else {
        next();
      }
    }

  });

  return Router; // 修改此处以返回包含 historyStack 的对象
});
