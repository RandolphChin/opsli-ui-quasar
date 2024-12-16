<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />

              <div>
                <q-btn
                  label="Login"
                  @click="handleLogin"
                  type="button"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { fakeBackend } from "src/fakeBackend";

const username = ref("admin");
const password = ref("password");
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const handleLogin = async () => {
  try {
    const response = await fakeBackend.login({
      username: username.value,
      password: password.value,
    });
    authStore.setToken(response.token);
    authStore.setUser(response.user);
    // 获取动态菜单
    const dynamicMenu = await fakeBackend.getDynamicMenu();
    authStore.setMenu(true);
    // 动态添加路由
    dynamicMenu.forEach((menu) => {
      router.addRoute("Home", menu);
    });
    router.getRoutes().forEach((w) => {
      //console.log("router...begin");
      //console.log(w.path);
      //console.log("router...end");
    });
    router.push("/");
  } catch (error) {
    console.log(error);
    $q.notify(error);
  }
};
/*

// 检查是否已登录
onMounted(() => {
  if (authStore.token) {
    // 如果用户已登录，重定向到首页
    router.push('/');
  }
});
*/
</script>
<style scoped>
.bg-image {
  background-image: url("src/assets/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

[v-cloak] {
  display: none !important;
}
</style>
