<template>
  <div class="q-pb-xs">
      <q-tabs
        no-caps
        dense
        class="shadow-2"
        :switch-indicator="false"
        active-bg-color="green-5"
        active-color="white"
        v-model="activeTab"
      >
        <q-tab class="q-mx-xs" v-for="(key, index) in historyRoutes"  :key="index" :to="key.path"
               @click="navTo(key.path)"
               @contextmenu.prevent="showContextMenu($event, key.name)"
               :name="key.name"
            >
          <div class="row items-center no-wrap">
            <span class="q-mr-xs">{{ key.meta.title}}</span>
            <q-btn icon="close" dense @click.stop="closeTab(key)" flat size="6px" round/>
          </div>
        </q-tab>
      </q-tabs>
    <!-- 上下文菜单 -->
    <q-menu v-model="menuVisible" touch-position context-menu :offset="[-12, 10]" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }">
      <q-list>
        <q-item clickable v-close-popup @click="closeCurrentTab(route)">关闭当前标签</q-item>
        <q-item clickable v-close-popup @click="closeAllTabs">关闭所有标签</q-item>
        <q-item clickable v-close-popup @click="closeLeftTabs(route)">关闭左侧所有标签</q-item>
        <q-item clickable v-close-popup @click="closeRightTabs(route)">关闭右侧所有标签</q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from 'vue';
import { useHistoryStore } from '../stores/tagViewStore';
import {useRouter, useRoute} from "vue-router";
import { mockRoutes } from '../mock'; // 引入 mockRoutes

const router = useRouter();
const route = useRoute();
defineOptions({
  name: 'TagHistory'
})
const activeTab = ref(route.name);
const menuVisible = ref(false); // 控制菜单的显示与隐藏
const menuPosition = ref({ x: 0, y: 0 }); // 存储菜单位置

// 获取历史路由
const historyRoutes = computed(() => {
  const store = useHistoryStore();
  const filteredRoutes = store.historyStack.filter(route => {
    // 只保留不包含子路由的菜单
    const mockRoute = mockRoutes.find(mockRoute => mockRoute.name === route.name);
    return !mockRoute?.children || mockRoute.children.length === 0; // 确保没有子路由
  });
  // 确保第一个 tab 始终是首页
  return [{ path: '/', meta: { title: '首页' } }, ...(filteredRoutes.filter(v=> '/' != v.path))];
});

function navTo (path) {
  router.push({ path: path });
}
function closeTab (activeTab) {
  let newPath = '';
  const tabs = historyRoutes.value; // 修正：获取 historyRoutes 的值
  tabs.forEach((item, index) => {
    // 检查当前标签是否是关闭的标签
    if (activeTab.path === item.path) {
      // 检查下一个标签是否存在
      if (index + 1 < tabs.length) {
        newPath = tabs[index + 1].path; // 获取下一个标签的路径
      } else if (index - 1 >= 0) {
        newPath = tabs[index - 1].path; // 获取上一个标签的路径
      } else {
        // 如果没有其他标签，则不更新 newPath
        newPath = '';
      }

      // 这里删除关闭的标签，以更新历史记录
      useHistoryStore().removeRoute(item);
    }
  });
  // 在关闭标签后，如果有新的路径，则导航
  if (newPath) {
    router.push({ path: newPath });
  }
}

// 右键菜单处理
function showContextMenu(event, key) {
  if (event.button === 2) {  // 右键的 button 值是 2
    menuPosition.value = {x: event.clientX, y: event.clientY}; // 设置菜单位置
    // activeTab.value = key; // 设置当前激活的 tab
    menuVisible.value = true; // 显示菜单
  }
}

// 关闭当前标签
function closeCurrentTab(tab) {
  closeTab(tab);
  menuVisible.value = false; // 关闭菜单
}

// 关闭所有标签
function closeAllTabs() {
  const store = useHistoryStore();
  store.clearAllRoutes(); // 清空历史记录
  menuVisible.value = false; // 关闭菜单
  router.push('/'); // 导航回首页
}

// 关闭左侧所有标签
function closeLeftTabs(tab) {
  const store = useHistoryStore();
  const index = historyRoutes.value.findIndex(item => item.path === tab.path);
  if (index !== -1) {
    const leftTabs = historyRoutes.value.slice(1, index); // 获取左侧标签
    leftTabs.forEach(leftTab => store.removeRoute(leftTab)); // 移除左侧标签
  }
  menuVisible.value = false; // 关闭菜单
}

// 关闭右侧所有标签
function closeRightTabs(tab) {
  const store = useHistoryStore();
  const index = historyRoutes.value.findIndex(item => item.path === tab.path);
  if (index !== -1) {
    const rightTabs = historyRoutes.value.slice(index + 1); // 获取右侧标签
    rightTabs.forEach(rightTab => store.removeRoute(rightTab)); // 移除右侧标签
  }
  menuVisible.value = false; // 关闭菜单
}
watchEffect(() =>{
  activeTab.value = route.name
})
</script>

<style scoped>
.q-tab {
  min-height: 22px; /* 调整单个 tab 的最小高度 */
  padding: 0 12px; /* 调整左右内边距 */
  line-height: 1.5; /* 这里可以根据需要调整行高 */
}
.q-item {
  min-height: 22px; /* 调整单个 tab 的最小高度 */
  padding: 4px 12px;
}
</style>
