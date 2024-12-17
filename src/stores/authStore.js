import { defineStore } from "pinia";
import { setting } from "src/setting.config";
import { doLogin } from "src/api/login/login";
import {usePublicKeyStore} from "stores/publicKeyStore";
import { decryptedDes } from "src/utils/crypto/encrypt-des";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    setMenuFlag: false, // 新开一个TAB，这个值 为初始化为false,
    user: JSON.parse(localStorage.getItem("user")) || null, // 从 localStorage 中获取用户信息
    // token: localStorage.getItem("token") || null, // 从 localStorage 中获取 token

    accessToken: localStorage.getItem(setting.tokenTableName) || null,
    username: "",
    avatar: "",
    permissions: [],
    perms: [],
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
      this.token = token;
      localStorage.setItem(setting.tokenTableName, token); // 将 token 存储到 localStorage
    },
    logout() {
      this.user = null;
      this.token = null;
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
        // const expiresAtTs = tmpData.expiresAtTs;
    },
  },
});
