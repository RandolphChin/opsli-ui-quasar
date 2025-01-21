<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 650px;">
      <q-card-section>
        <div class="text-h6">编辑</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="formRef">
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- 用户名 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 用户名：</label>
                <div>
                  <q-input
                    v-model="formData.username"
                    outlined
                    dense
                    :rules="[rules.required('用户名'), rules.username]"
                    style="width: 180px"
                    disable
                  />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!-- 昵称 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 昵称：</label>
                <q-input
                  v-model="formData.realName"
                  outlined
                  dense
                  :rules="[rules.required('昵称'), rules.realName]"
                  style="width: 180px"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- 工号 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 工号：</label>
                <q-input
                  v-model="formData.no"
                  outlined
                  dense
                  :rules="[rules.required('工号'), rules.no]"
                  style="width: 180px"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!-- 手机 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 手机：</label>
                <q-input
                  v-model="formData.mobile"
                  outlined
                  dense
                  :rules="[rules.required('手机'), rules.mobile]"
                  style="width: 180px"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- 邮箱 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 邮箱：</label>
                <q-input
                  v-model="formData.email"
                  outlined
                  dense
                  :rules="[rules.required('邮箱'), rules.email]"
                  style="width: 180px"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="q-form-row">
                <label class="q-form-label">签名：</label>
                <q-input
                  v-model="formData.sign"
                  outlined
                  dense
                  style="width: 180px"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- 备注 -->
              <div class="q-form-row">
                <label class="q-form-label">切换租户：</label>
                <q-select outlined v-model="formData.enableSwitchTenant"
                          :options="enableSwitchTenantOptions"
                          option-value="dictValue"
                          option-label="dictName"
                          emit-value
                          map-options
                          options-dense
                          dense
                          style="width: 180px"
                          placeholder="切换租户" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="q-form-row">
                <label class="q-form-label">备注：</label>
                <q-input
                  v-model="formData.remark"
                  outlined
                  dense
                  style="width: 180px"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="sm" flat label="取消" color="primary" @click="cancel" />
        <q-btn size="sm" label="确定" :loading="formData.loading" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { doUpdate } from '@/api/system/user/userManagement';
import { getDictList } from 'src/utils/dict';

const formRef = ref(null);
const isOpen = ref(false); // 控制弹窗是否显示
const formData = ref({
  username: null,
  realName: null,
  no: null,
  mobile: null,
  email: null,
  remark: null,
  sign: null,
  enableSwitchTenant: null,
  loading: false
});

const $q = useQuasar();
const emit = defineEmits(['fetchData']);

const rules = {
  required: (fieldName) => (val) => !!val || `${fieldName}不能为空`,
  username: (val) => (val && val.length >= 2) || '姓名至少为2个字符',
  realName: (val) => (val && val.length >= 2) || '昵称至少为2个字符',
  email: (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || '请输入有效的邮箱地址',
  mobile: (val) => /^1[3-9]\d{9}$/.test(val) || '请输入有效的手机号码',
  length: (fieldName, min, max) => (val) =>
    (val && val.length >= min && val.length <= max) ||
    `${fieldName}长度必须在 ${min}-${max} 个字符之间`,
};
const enableSwitchTenantOptions = ref([]);
// 打开对话框，并接收当前行数据
const openDialog = (rowData) => {
  isOpen.value = true;
  formData.value = { ...rowData }; // 初始化弹窗中的表单数据
  initEnableSwitchTenantOptions();
};

// 关闭对话框
const closeDialog = () => {
  isOpen.value = false;
};

// 取消操作
const cancel = () => {
  closeDialog(); // 直接关闭对话框
};

// 确认操作
const confirm = () => {
  formRef.value.validate().then( success => {
    if (success) {
      // model 数据验证通过
      formData.value.loading = true;
      doUpdate(formData.value).then(res => {
        $q.notify({ type: 'positive', message: res.data.msg });
        formData.value.loading = false;
        emit('fetchData');
        closeDialog();
      })
    } else {
      // 数据验证失败
      // 用户至少输入了一个无效值
      console.log('validate err....');
    }
  })
};

const initEnableSwitchTenantOptions = () =>{
  const dicList = getDictList('no_yes');
  enableSwitchTenantOptions.value =dicList;
}


// 暴露 `openDialog` 方法供父组件调用
defineExpose({
  openDialog,
});
</script>

<style scoped>
/*

.q-form-row {
  display: flex;
  align-items: baseline;
}
.q-form-label {
  font-weight: bold;
  line-height: 1.5; !* 保证 label 垂直居中 *!
}
*/
/* 仅在小屏幕下生效 */
/*
@media (max-width: 1024px) {
  .textarea-spacing {
    margin-top: 20px;
  }
}
*/

</style>
