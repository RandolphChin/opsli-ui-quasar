<template>
  <div>
    <q-btn label="查询" unelevated @click="onSearch" color="primary" size="sm" class="q-mr-sm text-weight-bold" icon="search"/>
    <q-btn label="重置" unelevated @click="onReset" color="primary" outline size="sm" class="text-weight-bold" icon="refresh"/>
  </div>
</template>

<script setup>
defineOptions({
  name: 'QueryButtons'
})
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
