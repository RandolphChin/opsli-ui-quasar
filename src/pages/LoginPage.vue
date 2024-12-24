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
              <q-input filled v-model="form.principal" label="Username" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="form.password"
                label="Password"
                lazy-rules
              />
              <q-input filled no-error-icon v-model.trim="form.verificationCode" color="black"
                       label="请输入验证码" :rules="[(val) => (val && val.length > 0) || '请输入验证码']">
                <template v-slot:after>
                  <q-btn padding="none" style="width: 130px; height: 100%" @click="getCaptcha">
                    <q-img :src="captchaImage" />
                  </q-btn>
                </template>
              </q-input>
              <div>
                <q-btn
                  label="Login"
                  @click="handleLogin"
                  type="button"
                  color="primary"
                  :loading="form.loading"
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
import {onMounted, ref, watch} from "vue";
import { useRouter, useRoute  } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { fakeBackend } from "src/fakeBackend";
import { usePublicKeyStore} from "stores/publicKeyStore";
import { uuid } from "@/utils/index";
import { captcha } from "@/api/login/login"


const form = ref({
  principal: 'admin',
  password: 'Aa123456.',
  verificationCode: '',
  loading: false,
  uuid: uuid(),
  loginFrom: "0"
})
const redirect = ref('/');// 重定向地址
const captchaImage = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute ();
const $q = useQuasar();

const handleLogin = async () => {
  try {
    form.value.loading = true;
    await authStore.handelLogin(form.value);
    const routerPath =
      redirect.value === "/404" || redirect.value === "/401"
        ? "/index"
        : redirect.value;

    // await useRouterStore.setAllRoutes();
    router.push(routerPath).catch(() => {});

  } catch (error) {
    console.log(error);
    $q.notify(error);
  }
};

const getCaptcha = () => {
  captchaImage.value = captcha(form.value.uuid);
}


onMounted( () => {
  console.log('login....redirect',redirect.value);
  getCaptcha();
});

// 监听路由的变化
watch(
  () => route.query, // 监听路由的 query 参数
  (newQuery) => {
    redirect.value = (newQuery && newQuery.redirect) || '/';
  },
  { immediate: true } // 立即执行
);
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
