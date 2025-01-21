<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 650px;">
      <q-card-section>
        <div class="text-h6">授权组织</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          ref="orgFilterRef"
          v-model="orgFilter"
          class="q-input-sm"
          placeholder="输入关键字过滤"
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon v-if="orgFilter !== ''" name="clear" class="cursor-pointer" @click="resetOrgFilter" />
          </template>
        </q-input>

        <q-tree
          :nodes="orgTreeData"
          node-key="id"
          label-key="orgName"
          :filter="orgFilter"
          tick-strategy="strict"
          v-model:ticked="ticked"
          v-model:expanded="expanded"
          @update:selected="handleNodeSelected"
          @update:ticked="handleNodeTicked"
          selected-color="primary"
          ref="orgTree"
        >
          <template v-slot:default-header="prop">
            <div class="row items-center">
              <!-- 节点文字（点击文字也可以打勾） -->
              <span
                class="q-ml-sm cursor-pointer"
                @click="toggleCheckbox(prop.node)"
              >
            {{ prop.node.orgName }}
          </span>
              <!-- 设置默认按钮 -->
              <q-btn
                v-if="prop.node.checked && !prop.node.def"
                label="设置默认"
                color="primary"
                dense
                flat
                @click.stop="setDefault(prop.node)"
              />
              <!-- 默认标签 -->
              <q-badge
                v-if="prop.node.def"
                color="primary"
                class="q-ml-sm cursor-pointer"
                @click.stop="toggleDefault(prop.node)"
              >
                默认
              </q-badge>
            </div>
          </template>
        </q-tree>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn size="sm" flat label="取消" color="primary" @click="isOpen = false" />
        <q-btn size="sm" label="确定" :loading="loading" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'
import {QTree, useQuasar} from 'quasar'
import { getTreeByDef } from '@/api/system/org/orgManagement';
import { doSetOrg, getOrgByUserId } from '@/api/system/user/userManagement';

const orgFilter = ref('');
const orgFilterRef = ref(null);
const orgTreeData = ref([]);
const orgTree = ref(null);
const loading = ref(false);
const rowUserId = ref(null);
const ticked = ref([]);
const  expanded = ref([]);
const $q = useQuasar();
const emit = defineEmits(['fetchData']);
const isOpen = ref(false);

const openDialog = (rowData) => {
  isOpen.value = true;
  // formData.value = { ...rowData }; // 初始化弹窗中的表单数据
  rowUserId.value = rowData.id;
  loadOrgTree();
};

// 加载树形数据
const loadOrgTree = () => {
  const param = { 'isGen': false }
  getTreeByDef(param).then(dvd => {
    if (dvd.data.code === 0) {
      orgTreeData.value = dvd.data.data;
      loadSaveOrg();
    }
  });
};

const loadSaveOrg = () => {
  getOrgByUserId({userId: rowUserId.value}).then(resp => {
    const arr = resp.data.data
    resetTreeCheck();
    if(arr.length > 0){
      let orgArr = arr.map(v => v.orgId)
      orgTree.value.setTicked(orgArr,true);
      arr.forEach(w => {
        const node = orgTree.value.getNodeByKey(w.orgId);
        if(w.izDef == "0"){
          node.def = false;
        }else {
          node.def = true;
        }
        node.checked = true;
      })
    }
  })
}

const resetTreeCheck = () => {
  orgTreeData.value.forEach(m=>{
    m.def = false;
    m.checked = false;
    if(m.children && m.children.length > 0){
      m.def = false;
      m.checked = false;
    }
  })
  // ticked.value = []
}
// 处理节点选中事件
const handleNodeSelected = (selectedNodeId) => {
  // const selectedNodeId = selectedKeys[0]; // 获取当前选中的节点 ID
  if (selectedNodeId) {
    // 判断节点是否已经勾选
    const isTicked = ticked.value.includes(selectedNodeId);
    if (isTicked) {
      // 如果已经勾选，则取消勾选
      ticked.value = ticked.value.filter(id => id !== selectedNodeId);
    } else {
      // 如果未勾选，则勾选
      ticked.value = [...ticked.value, selectedNodeId];
    }
  }
};

// 勾选筛选框
const handleNodeTicked = (tickedNodes) => {
  tickedNodes.forEach(v => {
    const node = orgTree.value.getNodeByKey(v);
    node.def = false;
    node.checked = true;
  })
}
// 点击节点文字时切换勾选状态
const toggleCheckbox = (node) => {
  node.checked = !node.checked;
  handleNodeSelected(node.id); // 调用勾选框状态变化的逻辑
};

const resetOrgFilter = () => {
  orgFilter.value = '';
};

// 设置默认
const setDefault = (node) => {
  // 取消其他节点的默认状态
  orgTreeData.value.forEach(n => {
    n.def = false;
    // 存在儿子也要取消
    if (n.children && n.children.length > 0) {
      n.children.forEach(c => {
        c.def = false;
      });
    }
  });
  // 设置当前节点为默认
  node.def = true;
};

// 点击默认标签时取消默认状态
const toggleDefault = (node) => {
  node.def = false;
  node.checked = false; // 取消勾选
  const newArray = ticked.value.reduce((acc, item) => {
    if (item != node.id) {
      acc.push(item);
    }
    return acc;
  }, []);
  ticked.value = [...newArray];
};

const confirm = () => {
  loading.value = true;
  const tickedNode = [];
  let parentNodeIsTicked = false; // 父节点是否被勾选
  ticked.value.forEach(v=>{
    tickedNode.push(orgTree.value.getNodeByKey(v));
    if(!parentNodeIsTicked){
      let currentNode = orgTree.value.getNodeByKey(v);
      let parentNode =orgTree.value.getNodeByKey(currentNode.parentId)
      parentNodeIsTicked = orgTree.value.isTicked(parentNode.id)
    }
  })

  const defNode =tickedNode.filter(it => it.def == true);
  if (defNode.length == 0){
    $q.notify({ type: 'warning', message: '请设置默认项' });
    return
  }

  const newArray = tickedNode.reduce((acc, item) => {
    if (item.id != defNode[0].id) {
      acc.push(item);
    }
    return acc;
  }, []);
  let params = {
    userId: rowUserId.value,
    defModel: defNode[0],
    orgModelList: parentNodeIsTicked == true ? [] : newArray,
  }
  doSetOrg(params).then(resp => {
    if(resp.data.code == 0){
      $q.notify({ type: 'positive', message: resp.data.msg });
      loading.value = false;
      isOpen.value = false;
      emit('fetchData');
    } else {
      $q.notify({ type: 'warning', message: resp.data.msg });
    }
  })
  console.log(params);
  // isOpen.value = false;
}
// 暴露 `openDialog` 方法供父组件调用
defineExpose({
  openDialog,
});
</script>
<style scoped>
/* 自定义样式 */
/*
.cursor-pointer {
  cursor: pointer;
}
*/

</style>
