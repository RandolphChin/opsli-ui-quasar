import { defineStore } from "pinia";
import { setting } from "src/setting.config";
import { doLogin } from "src/api/login/login";
import {usePublicKeyStore} from "stores/publicKeyStore";
import { decryptedDes } from "src/utils/crypto/encrypt-des";
import { getUserInfo } from "src/api/login/user"
import {getMenuList} from "src/api/login/menus";
import {devRoutes} from "src/router/devRouter";
import {filterAllRoutes, transformRoutes } from "src/utils/handleRoutes";
import {constantRoutes} from "src/router/routes";


export const useAuthStore = defineStore("authStore", {
  state: () => ({
    setMenuFlag: false, // 新开一个TAB，这个值 为初始化为false,
    user: JSON.parse(localStorage.getItem("user")) || null, // 从 localStorage 中获取用户信息
    accessToken: localStorage.getItem(setting.tokenTableName) || null,
    username: "",
    avatar: "",
    roles: [],
    perms: [],
    accessRoutes: JSON.parse(localStorage.getItem("accessRoutes")) || []
  }),
  actions: {
    setMenu(f) {
      this.setMenuFlag = f;
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user)); // 将用户信息存储到 localStorage
    },
    setToken(token) {
      this.accessToken = token;
      localStorage.setItem(setting.tokenTableName, token); // 将 token 存储到 localStorage
    },
    setRoles(roles) {
      this.roles = roles;
    },
    setPerms(perms) {
      this.setPerms = perms;
    },
    setAccessRoutes(accessRoutes) {
      this.accessRoutes = accessRoutes;
      // localStorage.setItem("accessRoutes", JSON.stringify(accessRoutes));
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem("user"); // 从 localStorage 移除用户信息
      localStorage.removeItem(setting.tokenTableName); // 从 localStorage 移除 token
    },
    async handelLogin(loginForm) {
      const { data } = await doLogin(loginForm);
      const encryptRSA = setting.encryptRSA;
      let tmpData = data;
      if (encryptRSA) {
        let publicKeyStore = usePublicKeyStore();
        await publicKeyStore.fetchPublicKey();
        let publicKey = publicKeyStore.publicKey;
        let decryptedStr = decryptedDes(data.data, publicKey);
        tmpData = JSON.parse(decryptedStr);
      }
        const token = tmpData.accessToken;
        this.setToken(token);
    },
    async handelUserInfo() {
          const res  =await getUserInfo();
          let { roles, perms } = res.data.data;
            this.setRoles(roles);
            this.setPerms(perms);
            this.setUser(res.data.data);
    },
    async handelUserMenu() {
           // const menuResp = await getMenuList(null,this.accessToken);
            const menuResp = await getMenuList();
            const routerData = menuResp.data.data;
            // 如果是开发环境 则合并 开发的示例组件
            if (process.env.NODE_ENV === "development") {
              devRoutes.forEach((e) => {
                routerData.push(e);
              });
            }
            // routerData.push({ path: "*", redirect: "/404", hidden: true });
            routerData.push({ path: "/:catchAll(.*)*", component: () => import('pages/ErrorNotFound.vue') });
/*
      const jsonDataString = JSON.stringify(routerData);
      const blob = new Blob([jsonDataString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "C:\\Users\\Administrator\\Desktop\\data.json";
      link.click();
      */
            let accessRoutes = transformRoutes(routerData);

            this.setAccessRoutes(accessRoutes);

    },
  },
});
