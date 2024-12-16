<!-- QueryButtons.vue -->
<template>
  <div class="q-mb-md flex items-center">
    <q-btn label="查询" unelevated @click="onSearch" color="primary" class="q-mr-xs" />
    <q-btn label="重置" unelevated @click="onReset" color="secondary" />
  </div>
</template>

<script setup>

const props = defineProps({
  onSearch: {
    type: Function,
    required: true,
  },
  onReset: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>

</style>
