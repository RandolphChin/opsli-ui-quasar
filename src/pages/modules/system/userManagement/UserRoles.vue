<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 650px;">
      <q-card-section>
        <div class="text-h6">设置角色</div>
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-toolbar>
          <div class="q-mb-md flex items-center">
            <q-input v-model="filter.roleCode_LIKE" placeholder="请输入角色编号" clearable class="q-mr-sm q-input-sm" dense outlined />
            <q-input v-model="filter.realName_LIKE" placeholder="请输入角色名称" clearable class="q-mr-sm q-input-sm" dense outlined />
            <QueryButtons :onSearch="fetchUserRolesData" :onReset="resetFilter" />
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
          <template v-slot:body-cell-izDefault="props">
            <q-td :props="props">
              <q-chip size="sm" square v-if="props.row.id == defaultRoleId" color="green" text-color="white" label="是"/>
              <q-chip color="orange" size="sm" square v-if="props.row.id != defaultRoleId" text-color="white" label="否" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td>
              <q-btn
                label="设为默认"
                @click="setDefaultRole(props.row.id)"
                color="primary"
                flat
                size="sm"
                :disable="calDisableAction(props.row)"
                padding="xs"
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
      </q-card-section>
      <q-card-actions align="right">
        <q-btn dense flat label="取消" color="primary" @click="isOpen = false" />
        <q-btn dense label="确定" :loading="confirmLoading" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'
import QueryButtons from '@/components/QueryButtons.vue'; // Import your new component
import Pagination from '@/components/Pagination.vue';
import { getList } from '@/api/system/role/roleManagement';
import {doGetRoles, doSetRoles } from "src/api/system/user/userManagement";
import {useQuasar} from "quasar";


defineOptions({
  name: 'UserRoles'
})

const tableData = ref([]); // 这里是表格数据
const rowUserId = ref(null);
const isOpen = ref(false);
const filter = ref({
  roleCode_LIKE: null,
  roleName_LIKE: null,
  label_EQ: 0 //
});
const defaultRoleId = ref(null);
const selected = ref([]);
const loading = ref(true);
const confirmLoading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});
const columns = [
  { name: 'roleCode', align: 'center', label: '角色编号', field: 'roleCode' },
  { name: 'roleName', align: 'center', label: '角色名称', field: 'roleName' },
  { name: 'dataScope', align: 'center', label: '数据范围', field: 'dataScope' },
  { name: 'izDefault', align: 'center', label: '是否默认', field: 'izDefault' },
  { name: 'remark', align: 'center', label: '备注', field: 'dataScope' },
  { name: 'actions', label: '操作', align: 'left', field: 'actions' }
]
const $q = useQuasar();
const emit = defineEmits(['fetchData']);
const openDialog = (rowData) => {
  fetchUserRolesData();
  rowUserId.value = rowData.id;
  isOpen.value = true;
};

const resetFilter = () => {
  filter.value = {
    roleCode_EQ: null,
    roleName_LIKE: null,
    label_EQ: 0
  };
  fetchUserRolesData(); // 重置后获取数据
};

const getSelected = (newSelected) => {
  console.log(`获取selected： ${JSON.stringify(selected.value)}`);
  console.log(`getSelected获取newSelected： ${JSON.stringify(newSelected)}`);
  selected.value = newSelected;
};
const fetchUserRolesData = () => {
  loading.value = true;
  filter.value.pageNo = pagination.value.page;
  filter.value.pageSize = pagination.value.rowsPerPage;
  getList(filter.value).then(resp => {
    console.log(resp.data.data);
    tableData.value = resp.data.data.rows;
    pagination.value.rowsNumber = resp.data.data.total;
    fetchCurrentRole();
    loading.value = false;
  });
}

const onPageChange = (val) => {
  selected.value = [];
  console.log(`onPageChange: ${val}`);
  pagination.value.page = val;
  fetchUserRolesData();
};

const onRowsPerPageChange = (val) => {
  console.log(`onRowsPerPageChange: ${val}`);
  pagination.value.rowsPerPage = val;
  fetchUserRolesData();
}

const fetchCurrentRole = () => {
  doGetRoles({ userId:  rowUserId.value }).then(resp => {
    const {roleIds, defRoleId} = resp.data.data;
    const chosed = tableData.value.filter(v => roleIds.includes(v.id))
    selected.value = chosed; // 回显
    defaultRoleId.value = defRoleId; // 默认角色
  })
}
const calDisableAction = (row) => {
  // 未勾选的disabled;勾选的是默认的disabled
  const chosedIdArr = selected.value.map(v => v.id)
  const boolean = chosedIdArr.includes(row.id)
  if (boolean){
    if(defaultRoleId.value === row.id){
      return true;
    }else {
      return false;
    }
  }else {
    return true;
  }
}

const setDefaultRole = (rowId) => {
  defaultRoleId.value = rowId;
}
const confirm = () => {
  if(!defaultRoleId.value){
    $q.notify({ type: 'warning', message: '请设置默认角色' });
    return;
  }
  const params = {
    userId:  rowUserId.value,
    defRoleId: defaultRoleId.value,
    roleIds: selected.value.map(v => v.id)
  }
  console.log(params);
  doSetRoles(params).then(resp => {
    if(resp.data.code == 0){
      $q.notify({ type: 'positive', message: resp.data.msg });
      isOpen.value = false;
      emit('fetchData');
    } else {
      $q.notify({ type: 'warning', message: resp.data.msg });
    }
  })
}

// 暴露 `openDialog` 方法供父组件调用
defineExpose({
  openDialog,
});
</script>
<style scoped>

</style>
