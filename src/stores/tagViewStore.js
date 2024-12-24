import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('useHistoryStore', {
  state: () => ({
    historyStack: [], // 存储历史记录的数组
  }),
  actions: {
    addHistory(route) {
      // 确保不重复添加相同的路由
      if (!this.historyStack.find(r => r.name == route.name)) {
        this.historyStack.push(route);
      }
    },
    removeRoute(route) {
      this.historyStack = this.historyStack.filter(r => r.name != route.name);
    },
    clearAllRoutes() {
      this.historyStack = [];
    }
  },
});
