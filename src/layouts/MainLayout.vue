<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-toolbar glossy class="bg-grey-1 text-black">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <BreadCrumbs />
<!--        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        -->
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            dense flat
            @click="$q.fullscreen.toggle()"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          />
          <q-btn round flat @click="avatarMenu == true">
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-btn>
          <q-menu
            v-model="avatarMenu"
            :offset="[0, 10]"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-list>
              <q-item clickable v-close-popup @click="goToSettings">
                <q-item-section>
                  个人设置
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  退出登录
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
      <q-toolbar glossy class="bg-grey-1 text-black">
        <TagHistory />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in linksList"
          :key="link.name"
          v-bind="link"
          :children="link.children"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router';
import BreadCrumbs from 'components/BreadCrumbs.vue';
import TagHistory from "components/History.vue";
import { useHistoryStore } from '../stores/tagViewStore';
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/authStore";

defineOptions({
  name: 'MainLayout'
})
const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
// 生成动态菜单项
// const linksList = authStore.accessRoutes;
const homeRoute = authStore.accessRoutes.find(route => route.path === '/');
homeRoute.children = [];
const linksList = authStore.accessRoutes;

const leftDrawerOpen = ref(false)
// 切换左侧抽屉
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const avatarMenu = ref(false);
// 监听路由变化，根据需要添加历史记录
const goToSettings = () => {
  // this.$router.push('/settings');
  this.avatarMenu = false; // 关闭菜单
}
const logout = () => {
  $q.dialog({
    title: '提示',
    message: '确定退出系统吗?',
    cancel: true,
    ok: {
      push: true
    },
    persistent: true
  }).onOk( () => {
    console.log('>>>> OK')
  // 登出成功
   authStore.logout();
   router.push('/login');
  }).onOk(() => {
    console.log('>>>> second OK catcher')
  }).onCancel(() => {
    console.log('>>>> Cancel')
  }).onDismiss(() => {
    console.log('I am triggered on both OK and Cancel')
  })
}
watch(
  () => router.currentRoute.value,
  (to) => {
    // 确保在点击没有子路由的菜单时才添加历史记录
    const historyStore = useHistoryStore();
    const route = authStore.accessRoutes.find(route => route.name === to.name);
    // 如果路由存在，并且没有 children，则添加到 history
    if (route && (!route.children || route.children.length === 0)) {
      historyStore.addHistory({ name: route.name, meta: route.meta, path: to.path });
    }
  }
);
</script>
