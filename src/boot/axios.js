import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore'
import {useRouter} from "vue-router";
import { setting } from "src/setting.config";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API,
  timeout: 120000,
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    let tokenName = setting.tokenName;
    config.headers[tokenName] = `Bearer ${authStore.accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

api.interceptors.response.use(
  response => {
    // Return the response as it is if no error
    return response;
  },
  error => {
    const authStore = useAuthStore();
    const router = useRouter();
      debugger;
    // Check if the error response is 401
    if (error.response && error.response.status === 401) {
      // 处理未授权请求
      authStore.logout(); // 清除 token 和用户信息
      router.push('/login'); // 导航到登录页
    }

    return Promise.reject(error);
  }
);
export { api }
