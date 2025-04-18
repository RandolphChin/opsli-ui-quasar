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
            <q-btn-group outline>
              <q-btn @click="addItem" label="新增" outline size="md" color="primary" icon="add" />
              <q-btn @click="deleteItem" label="删除" outline size="md" color="primary" icon="delete_outline" :disable="selected.length == 0"/>
            </q-btn-group>
          </template>
          <template v-slot:body-cell-enable="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.enable"
                true-value="1"
                false-value="0"
                @update:model-value="(newValue) => updateEnable(props.row, newValue)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td style="position: sticky; right: 0; background: white; z-index: 1;">
              <q-btn
                @click="editItem(props.row)"
                flat dense rounded
                color="primary"
                icon="edit"
              >
                <q-tooltip>
                  <template v-slot:default>
                  编辑
                  </template>
                </q-tooltip>
              </q-btn>
              <q-btn
                @click="setOrg(props.row)"
                flat dense rounded
                color="positive"
                icon="group"
              >
                <q-tooltip>
                  <template v-slot:default>
                  授权组织
                  </template>
                </q-tooltip>
              </q-btn>
              <q-btn
                @click="setRole(props.row)"
                flat dense rounded
                color="warning"
                icon="manage_accounts"
              >
                <q-tooltip>
                  <template v-slot:default>
                  授权角色
                  </template>
                </q-tooltip>
              </q-btn>
              <q-btn
                @click="deleteItem(props.row)"
                flat dense rounded
                color="negative"
                icon="delete"
              >
                <q-tooltip>
                  <template v-slot:default>
                  删除
                  </template>
                </q-tooltip>
              </q-btn>
<!--
              <q-btn-dropdown flat padding="xs" color="primary" label="更多">
                <q-list dense>
                  <q-item clickable v-close-popup @click="setOrg(props.row)">
                    <q-item-section>
                      <q-item-label>授权组织</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="setRole(props.row)">
                    <q-item-section>
                      <q-item-label>授权角色</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="deleteItem(props.row)">
                    <q-item-section>
                      <q-item-label>删除</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              -->
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
    <UserUpdate ref="userUpdateRef" @fetchData="fetchData" />
    <UserSetOrg ref="useSetOrgRef" @fetchData="fetchData" />
    <UserRoles ref="userRolesRef" @fetchData="fetchData" />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import QueryButtons from '@/components/QueryButtons.vue'; // Import your new component
import Pagination from '@/components/Pagination.vue'; // Import your new component
import { getTreeByDefWithUserToLike } from '@/api/system/org/orgManagement';
import { getList, doEnableAccount, doDelete, doDeleteAll } from '@/api/system/user/userManagement';
import {useQuasar} from "quasar";
import UserUpdate from './UserUpdate.vue';
import UserSetOrg from './UserSetOrg.vue';
import UserRoles from './UserRoles.vue';

defineOptions({
  name: 'UserManagement'
})

const orgFilter = ref('');
const orgFilterRef = ref(null);
const userRolesRef = ref(null);
const orgTreeData = ref([]);
const orgSelectedKeys = ref(null);
const orgTree = ref();
const $q = useQuasar();
const userUpdateRef = ref();
const useSetOrgRef = ref();
const orgNode = ref(null);

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
  /*
  const node = orgTree.value.getNodeByKey(orgSelectedKeys.value);
  filter.value.orgIdGroup = node.orgIds ? node.orgIds : node.id;
  */
  const node = orgTree.value.getNodeByKey(orgSelectedKeys.value);
  if("org_all" !== orgSelectedKeys.value && "org_null" !== orgSelectedKeys.value){
    filter.value.orgIdGroup = node.parentIds + "," + orgSelectedKeys.value;
    orgNode.value = node;
  }else {
    filter.value.orgIdGroup = orgSelectedKeys.value;
    orgNode.value = null;
  }
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
  rowsNumber: 0
});
const columns = [
  {
    name: 'username',
    required: true,
    label: '用户名',
    align: 'center',
    field: row => row.username,
    format: val => `${val}`
  },
  { name: 'enable', align: 'center', label: '启用状态', field: 'enable' },
  { name: 'realName', align: 'center', label: '昵称', field: 'realName' },
  { name: 'roleNames', label: '角色', field: 'roleNames', sortable: true },
  { name: 'no', label: '工号', field: 'no' },
  { name: 'mobile', align: 'center', label: '手机', field: 'mobile' },
  { name: 'email', align: 'center', label: '邮箱', field: 'email' },
  { name: 'loginIp', label: '最后登录IP', field: 'loginIp' },
  { name: 'remark', label: '备注', field: 'remark'  },
  { name: 'actions', label: '操作', align: 'center', field: 'actions' }
];
const tableData = ref([]); // 这里是表格数据


// fetchData 方法用于根据筛选条件查询数据
const fetchData = () => {
  loading.value = true;
  filter.value.pageNo = pagination.value.page;
  filter.value.pageSize = pagination.value.rowsPerPage;
  getList(filter.value).then(resp => {
    console.log(resp.data.data);
    tableData.value = resp.data.data.rows;
    pagination.value.rowsNumber = resp.data.data.total;
    loading.value = false;
  });
};

// api 是这样显示用法的 @update:model-value: (value, evt) => void   ，value 是新的模型值，evt 是JS 事件对象
const updateEnable = (row,newVal) => {
  doEnableAccount({
    userId: row.id,
    enabled: row.enable
  });
  $q.notify({
    message: '操作成功',
    color: 'positive'
  })
}
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
  userUpdateRef.value.openDialog();
  userUpdateRef.value.showInsertAndBindOrg(orgNode.value);
};

const editItem = (row) => {
  console.log('编辑项目', row);
  userUpdateRef.value.openDialog(row);
};

const deleteItem = (row) => {
  console.log('删除项目', row);
  $q.dialog({
    title: '提示',
    message: '确定要删除勾选项吗?',
    persistent: true,
    ok: {
      label: '确定', // 确认按钮的文本
      color: 'primary', // 确认按钮的颜色
      flat: false, // 是否使用扁平化样式
      size: 'sm'
    },
    cancel: {
      label: '取消', // 取消按钮的文本
      size: 'sm',
      flat: true
    }
  }).onOk(() => {
    console.log('>>>> OK')
    if(row.id){
      confirmDelete(row)
    }else {
      confirmBatchDelete();
    }
  }).onOk(() => {
    console.log('>>>> second OK catcher')
  }).onCancel(() => {
    console.log('>>>> Cancel')
  }).onDismiss(() => {
     console.log('I am triggered on both OK and Cancel')
  })
};


const setOrg = (row) => {
  console.log('设置组织', row);
  useSetOrgRef.value.openDialog(row);
};

const setRole = (row) => {
  console.log('设置组织', row);
  userRolesRef.value.openDialog(row);
};

const confirmDelete = (row) => {
  doDelete({ id: row.id }).then(res => {
    $q.notify({ type: 'positive', message: res.data.msg });
    fetchData();
  })
}
const confirmBatchDelete = () => {
  const ids = selected.value.map((item) => item.id).join();
  doDeleteAll({ ids }).then(res => {
    $q.notify({ type: 'positive', message: res.data.msg });
    selected.value = [];
    fetchData();
  })
}
</script>

<style scoped lang="scss">

</style>
