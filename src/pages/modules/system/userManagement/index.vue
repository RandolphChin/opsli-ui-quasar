<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-12 col-md-2">
        <q-input ref="orgFilterRef" v-model="orgFilter" class="q-input-sm" placeholder="输入关键字过滤" dense outlined>
          <template v-slot:append>
            <q-icon v-if="orgFilter !== ''" name="clear" class="cursor-pointer" @click="resetOrgFilter" />
          </template>
        </q-input>

        <q-tree
          v-model:selected="orgSelectedKeys"
          :nodes="orgTreeData"
          node-key="id"
          label-key="orgName"
          :filter="orgFilter"
          default-expand-all
          @click="clickTreeNode"
          selected-color="primary"
          ref="orgTree"
        />
      </div>
      <div class="col-12 col-md-10">
        <q-toolbar>
          <div class="q-mb-md flex items-center">
            <q-input v-model="filter.username_LIKE" placeholder="请输入用户名" clearable class="q-mr-sm q-input-sm" dense outlined />
            <q-input v-model="filter.realName_LIKE" placeholder="请输入昵称" clearable class="q-mr-sm q-input-sm" dense outlined />
            <q-input v-model="filter.no_EQ" placeholder="请输入工号" clearable class="q-mr-sm q-input-sm" dense outlined />
            <QueryButtons :onSearch="fetchData" :onReset="resetFilter" />
          </div>
        </q-toolbar>

        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="id"
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
              :rowsNumber="pagination.rowsNumber"
              :rowsPerPage="pagination.rowsPerPage"
              @onPageChange="onPageChange"
              @onRowsPerPageChange="onRowsPerPageChange"
            />
          </template>
        </q-table>
      </div>
    </div>


  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import QueryButtons from '@/components/QueryButtons.vue'; // Import your new component
import Pagination from '@/components/Pagination.vue'; // Import your new component
import { getTreeByDefWithUserToLike } from '@/api/system/org/orgManagement';
import { getList } from '@/api/system/user/userManagement';

defineOptions({
  name: 'UserManagement'
})

const orgFilter = ref('')
const orgFilterRef = ref(null)
const orgTreeData = ref([]);
const orgSelectedKeys = ref(null);
const orgTree = ref();
const resetOrgFilter =() =>{
  orgFilter.value = ''
  orgFilterRef.value.focus()
}

// load org tree
const loadOrgTree = () => {
  getTreeByDefWithUserToLike().then(dvd => {
    if(dvd.data.code == 0){
      orgTreeData.value = dvd.data.data;
    }
  })
}
const clickTreeNode = () => {
  // const tree = this.$refs.tree;
  const node = orgTree.value.getNodeByKey(orgSelectedKeys.value);
  filter.value.orgIdGroup = node.orgIds ? node.orgIds : node.id;
  fetchData();
}

//  right content

// 定义数据状态
const filter = ref({
  username_LIKE: '',
  realName_LIKE: '',
  no_EQ: '',
  orgIdGroup: 'org_all'
});
const selected = ref([]);
const loading = ref(true);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  // rowsPerPageOptions: [5,10,20]
});
const columns = [
  {
    name: 'username',
    required: true,
    label: '用户名',
    align: 'left',
    field: row => row.username,
    format: val => `${val}`
  },
  { name: 'realName', align: 'center', label: '昵称', field: 'realName' },
  { name: 'roleNames', label: '角色', field: 'roleNames', sortable: true },
  { name: 'no', label: '工号', field: 'no' },
  { name: 'mobile', label: '手机', field: 'mobile' },
  { name: 'email', label: '邮箱', field: 'email' },
  { name: 'loginIp', label: 'Calcium (%)', field: 'loginIp' },
  { name: 'remark', label: 'Iron (%)', field: 'remark'  },
  { name: 'actions', label: '操作', align: 'center', field: 'actions' }
];
const tableData = ref([]); // 这里是表格数据


// fetchData 方法用于根据筛选条件查询数据
const fetchData = () => {
  loading.value = true;
  console.log('Fetching data with filter:', filter.value);
  // 这里应发送请求以获取数据
  // orgSelectedKeys.value
  filter.value.pageNo = pagination.value.page;
  filter.value.pageSize = pagination.value.rowsPerPage;
  getList(filter.value).then(resp => {
    console.log(resp.data.data);
    tableData.value = resp.data.data.rows;
    pagination.value.rowsNumber = resp.data.data.total;
    loading.value = false;
  });
};

// resetFilter 方法用于重置筛选条件
const resetFilter = () => {
  filter.value = {
    username_LIKE: '',
    realName_LIKE: '',
    orgIdGroup: 'org_all'
  };
  fetchData(); // 重置后获取数据
};

onMounted(() => {
  fetchData(); // 页面加载时获取数据
  loadOrgTree();
});

const onPageChange = (val) => {
  selected.value = [];
  console.log(`onPageChange: ${val}`);
  pagination.value.page = val;
  fetchData();
};

const onRowsPerPageChange = (val) => {
  console.log(`onRowsPerPageChange: ${val}`);
  pagination.value.rowsPerPage = val;
  fetchData();
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
/*
 使用 q-input-sm-height 替换
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__marginal) {
  height: 28px;
  font-size: 14px;
}
*/

</style>
