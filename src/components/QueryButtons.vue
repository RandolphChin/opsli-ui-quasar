<!-- QueryButtons.vue -->
<template>
  <div> <!-- <div class="q-mb-md flex items-center"> -->
    <q-btn label="查询" unelevated @click="onSearch" color="positive" size="sm" class="q-mr-sm text-weight-bold" />
    <q-btn label="重置" unelevated @click="onReset" color="warning" size="sm" class="text-weight-bold"/>
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
