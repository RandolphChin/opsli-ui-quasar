import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/authStore'
import { setting } from "src/setting.config";
import { Notify } from 'quasar'
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

export default boot(({ app, router }) => {
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      let tokenName = setting.tokenName;
      // config.headers[tokenName] = `Bearer ${authStore.accessToken}`;
      config.headers[tokenName] = `${authStore.accessToken}`;
    }
    return config;
  }, error => {
    Notify.create({
      type: 'negative',
      message: error,
    })
    return Promise.reject(error)
  })

  const authStore = useAuthStore();
  api.interceptors.response.use(
    response => {
      // Return the response as it is if no error
      const responseData = response.data
      const { code } = responseData
      if (code === 0) {
        return response
      } else {
        authStore.logout();
        router.push('/login');
      }
      return response;
    },
    error => {
      // Check if the error response is 401
      if (error.response && error.response.status === 401) {
        // 处理未授权请求
        authStore.logout(); // 清除 token 和用户信息
        router.push('/login'); // 导航到登录页
      }else {
        Notify.create({
          type: 'negative',
          message: error.message
        })
      }

      return Promise.reject(error);
    }
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})


export { api }
