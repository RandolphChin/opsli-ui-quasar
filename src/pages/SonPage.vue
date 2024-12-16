<!-- 页码、查询组件未分离版本 -->
<template>
  <div>
    <div class="q-pa-xs">
      <q-toolbar>
        <div class="q-mb-md flex items-center">
          <q-input
            v-model="filter.name"
            placeholder="Dessert (100g serving)"
            class="q-mr-sm"
            dense
            outlined
            clearable
          />
          <q-input
            v-model="filter.calories"
            placeholder="Calories"
            class="q-mr-sm"
            dense
            outlined
            clearable
          />
          <q-input
            v-model="filter.fat"
            placeholder="Fat (g)"
            class="q-mr-sm"
            dense
            outlined
            clearable
          />
          <q-input
            v-model="filter.carbs"
            placeholder="Carbs (g)"
            class="q-mr-sm"
            dense
            outlined
            clearable
          />
          <q-input
            v-model="filter.protein"
            placeholder="Protein (g)"
            class="q-mr-sm"
            dense
            outlined
            clearable
          />
          <q-btn label="查询" unelevated @click="fetchData" color="primary" class="q-mr-xs" />
          <q-btn label="重置" unelevated  @click="resetFilter" color="secondary" />
        </div>
      </q-toolbar>

      <!-- 筛选条件 -->

      <q-table
        title="table 自定义分页"
        :rows="data"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        v-model:pagination="pagination"
        @update:selected="getSelected"
        class="table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>数据列表SonPage</q-toolbar-title>
            <q-btn
              @click="addItem"
              label="新增"
              size="sm"
              unelevated
              class="q-mr-sm glossy"
              color="primary"
              icon="add"
            />
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
          <div class="q-pa-xs flex flex-center justify-end">
            <span>
              共
              {{ pagination.rowsNumber }}
              条
            </span>
            <q-pagination
              v-model="pagination.page"
              :max="pages"
              :max-pages="5"
              ellipsess
              boundary-numbers
              direction-links
              @update:model-value="changePagination"
            />
            <q-select
              v-model="pagination.rowsPerPage"
              :options="pagination.rowsPerPageOptions"
              dense
              class="q-ml-md"
              @update:model-value="fetchData"
            >
            </q-select>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
  defineOptions({
    name: 'SonPage'
  });
  const selected = ref([]);
  const loading = ref(true);
  const pages = 10; // 数据总页数
  const toPage = ref(''); // 跳转至
  const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsPerPageOptions: [ 5, 10, 20],
  rowsNumber: 50 // 总共数据条数
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

  const data = ref([
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
  ]);

  const changePagination = (val) => {
  selected.value = [];
  console.log(`changePagination: ${val}`);
  pagination.value.page = val;
  loading.value = true;
  getTableData();
};

  const getSelected = (newSelected) => {
  console.log(`获取selected： ${JSON.stringify(selected.value)}`);
  console.log(`getSelected获取newSelected： ${JSON.stringify(newSelected)}`);
  selected.value = newSelected;
};

  const getTableData = () => {
  loading.value = true;
  // 此处应为接口请求数据
  setTimeout(() => {
  loading.value = false;
}, 2000);
};

onMounted(() => {
  getTableData();
});

const addItem = () => {
  console.log('添加新项目');
};

const editItem = (row) => {
  console.log('编辑项目', row);
};

const deleteItem = (row) => {
  console.log('删除项目', row);
};

const fetchData = async () => {
  getTableData();
};

// 重置筛选条件
const resetFilter = () => {
  filter.value = {
    name: '',
    calories: '',
    fat: '',
    carbs: '',
    protein: ''
  };
};
const filter = ref({
  name: '',
  calories: '',
  fat: '',
  carbs: '',
  protein: ''
});
</script>

<style scoped>

</style>
