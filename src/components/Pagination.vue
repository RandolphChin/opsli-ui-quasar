<!-- Pagination.vue -->
<template>
  <div class="q-pa-xs flex flex-center justify-end">
    <span>共 {{ rowsNumber }} 条</span>
    <q-pagination
      v-model="localCurrentPage"
      :max="maxPages"
      :max-pages="5"
      ellipsess
      boundary-numbers
      direction-links
      @update:model-value="updateCurrentPage"
    />
    <q-select
      v-model="localRowsPerPage"
      :options="rowsPerPageOptions"
      dense
      class="q-ml-md"
      @update:model-value="emitRowsPerPageChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
defineOptions({
  name: 'qPagination'
});
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  maxPages: {
    type: Number,
    required: true,
  },
  rowsNumber: {
    type: Number,
    required: true,
  },
  rowsPerPageOptions: {
    type: Array,
    required: true,
    default: () => [10,20,30,50]
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['onPageChange', 'onRowsPerPageChange']);

// 本地状态
const localCurrentPage = ref(props.currentPage);
const localRowsPerPage = ref(props.rowsPerPage);

// 监听 props 的变化
watch(() => props.currentPage, (newPage) => {
  localCurrentPage.value = newPage;
});

watch(() => props.rowsPerPage, (newPerPage) => {
  localRowsPerPage.value = newPerPage;
});

// 更新当前页方法
const updateCurrentPage = (page) => {
  localCurrentPage.value = page;
  emit('onPageChange', page); // 发送事件给父组件
};

// 发送每页行数变化的方法
const emitRowsPerPageChange = (value) => {
  emit('onRowsPerPageChange', value);
};

</script>

<style scoped>

</style>
