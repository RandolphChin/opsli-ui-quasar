<template>
  <div class="q-gutter-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        v-for="(route, index) in breadcrumbRoutes"
        :key="index"
        :label="route.meta.title"
        :to="{ name: route.name }"
      />
    </q-breadcrumbs>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 使用 useRoute 获取当前路由
const route = useRoute();
defineOptions({
  name: 'BreadCrumbs'
})
// 计算属性，用于生成面包屑导航，包括子路由
const breadcrumbRoutes = computed(() => {
  const matchedRoutes = route.matched;
  // 处理嵌套路由
  return matchedRoutes.map(matchedRoute => ({
    name: matchedRoute.name,
    meta: matchedRoute.meta,
    path: matchedRoute.path,
  })).filter(route => route.meta.title && (route.path != '/'));  // 过滤掉没有标题的路由
});
</script>

<style scoped>

</style>
