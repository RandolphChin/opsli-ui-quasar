<template>
  <div>
    <div class="q-pa-xs">
      <q-toolbar>
        <div class="q-mb-md flex items-center">
          <q-input v-model="filter.name" placeholder="Dessert (100g serving)" class="q-mr-sm" dense outlined />
          <q-input v-model="filter.calories" placeholder="Calories" class="q-mr-sm" dense outlined />
          <q-input v-model="filter.fat" placeholder="Fat (g)" class="q-mr-sm" dense outlined />
          <q-input v-model="filter.carbs" placeholder="Carbs (g)" class="q-mr-sm" dense outlined />
          <q-input v-model="filter.protein" placeholder="Protein (g)" class="q-mr-sm" dense outlined />
          <QueryButtons :onSearch="fetchData" :onReset="resetFilter" />
        </div>
      </q-toolbar>

      <q-table
        :rows="data"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        v-model:pagination="pagination"
        @update:selected="getSelected"
        class="table"
        boundary-numbers
      >

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>数据列表Page2</q-toolbar-title>
            <q-btn @click="addItem" label="新增" size="sm" unelevated class="q-mr-sm glossy" color="primary" icon="add" />
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn
              @click="editItem(props.row)"
              label="编辑"
              color="secondary"
              size="sm"
              class="q-mr-sm"
            />
            <q-btn
              @click="deleteItem(props.row)"
              label="删除"
              color="negative"
              size="sm"
            />
          </q-td>
        </template>
        <template v-slot:bottom>
          <Pagination
            :currentPage="pagination.page"
            :maxPages="pagination.maxPages"
            :rowsNumber="pagination.rowsNumber"
            :rowsPerPage="pagination.rowsPerPage"
            :rowsPerPageOptions="pagination.rowsPerPageOptions"
            @onPageChange="onPageChange"
            @onRowsPerPageChange="onRowsPerPageChange"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import QueryButtons from '@/components/QueryButtons.vue'; // Import your new component
import Pagination from '@/components/Pagination.vue'; // Import your new component
defineOptions({
  name: 'PageTwo'
});

// 定义数据状态
const filter = ref({
  name: '',
  calories: '',
  fat: '',
  carbs: '',
  protein: ''
});
const selected = ref([]);
const loading = ref(true);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 50,
  maxPages: 5,
  rowsPerPageOptions: [5,10,20]
});
const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a) - parseInt(b) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a) - parseInt(b) },
  { name: 'actions', label: '操作', align: 'center', field: 'actions' }
];
const data = ref([]); // 这里是表格数据

const realData = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: '花木成畦手自',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  }
];

// fetchData 方法用于根据筛选条件查询数据
const fetchData = () => {
  loading.value = true;
  console.log('Fetching data with filter:', filter.value);
  // 这里应发送请求以获取数据
  // 示例:
  setTimeout(() => {
    loading.value = false;
    data.value = realData;
  }, 2000); // Simulate loading
};

// resetFilter 方法用于重置筛选条件
const resetFilter = () => {
  filter.value = {
    name: '',
    calories: '',
    fat: '',
    carbs: '',
    protein: ''
  };
  fetchData(); // 重置后获取数据
};

onMounted(() => {
  fetchData(); // 页面加载时获取数据
});

const onPageChange = (val) => {
  selected.value = [];
  console.log(`onPageChange: ${val}`);
  pagination.value.page = val;
  loading.value = true;
  fetchData();
};

const onRowsPerPageChange = (val) => {
  console.log(`onRowsPerPageChange: ${val}`);
}
const getSelected = (newSelected) => {
  console.log(`获取selected： ${JSON.stringify(selected.value)}`);
  console.log(`getSelected获取newSelected： ${JSON.stringify(newSelected)}`);
  selected.value = newSelected;
};

const addItem = () => {
  console.log('添加新项目');
};

const editItem = (row) => {
  console.log('编辑项目', row);
};

const deleteItem = (row) => {
  console.log('删除项目', row);
};

</script>

<style scoped>

</style>
