import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    setMenuFlag: false, // 新开一个TAB，这个值 为初始化为false,
    user: JSON.parse(localStorage.getItem("user")) || null, // 从 localStorage 中获取用户信息
    token: localStorage.getItem("token") || null, // 从 localStorage 中获取 token
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
      localStorage.setItem("token", token); // 将 token 存储到 localStorage
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user"); // 从 localStorage 移除用户信息
      localStorage.removeItem("token"); // 从 localStorage 移除 token
    },
  },
});
