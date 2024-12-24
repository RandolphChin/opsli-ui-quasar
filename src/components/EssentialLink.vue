<template>
  <div>
  <q-item
    clickable
    :to="path"
    @click.stop="handleClick"
  >
  <q-item-section v-if="props.icon" avatar>
    <q-icon :name="props.icon" size="xs"/>
  </q-item-section>

  <q-item-section>
    <q-item-label>{{ props.name }}</q-item-label>
    <q-item-label caption>{{ props.caption }}</q-item-label>
  </q-item-section>
    <!-- 如果有子菜单, 显示箭头图标 -->
    <q-item-section v-if="children.length" side>
      <q-icon :name="isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'" />
    </q-item-section>
  </q-item>
  <!-- 子菜单区域 -->
  <q-list v-if="isOpen" class="q-pl-md"> <!-- 当 isOpen 为 true 时显示子菜单 -->
    <EssentialLink
      v-for="child in children"
      :key="child.name"
      :name="child.name"
      :icon="child.icon"
      :meta="child.meta"
      :path="`${path}/${child.path}`"
    :children="child.children"
      :addBreadcrumb="addBreadcrumb"
    />
  </q-list>
  </div>
</template>

<script setup>
import { ref} from "vue";

defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  path: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  },

  name: {
    type: String,
    default: ''
  },

  children: {
    type: Array,
    default: () => []
  },
  addBreadcrumb: { // 新增此 prop
    type: Function,
    required: false
  },
  meta: { // 新增此 prop
    type: Object,
    required: false
  }
})

// 1. 添加控制折叠状态的 ref
const isOpen = ref(false); // 用于跟踪子菜单是否展开

// 2. 切换子菜单的控制函数
function toggleChildren() {
  isOpen.value = !isOpen.value; // 切换折叠状态
}
function handleClick(e){
  toggleChildren(); // 切换子菜单
  /*
  if (props.addBreadcrumb) { // 如果有传入的 addBreadcrumb 函数，则调用
    props.addBreadcrumb({ title: props.title, path: props.path, meta: props.meta, children: props.children, name: props.name }); // 调用 addBreadcrumb
  }
  */
}
</script>
<style scoped>
</style>
