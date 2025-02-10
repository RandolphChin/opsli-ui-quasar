<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 650px;">
      <q-card-section>
        <div class="text-h6">{{ formData.title }}</div>
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
                    :disable="null != formData.id"
                    class="q-input-sm"
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
                  class="q-input-sm"
                />
              </div>
            </div>
          </div>
          <div class="row" v-if="null == formData.id">
            <div class="col-12 col-md-6">
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 密码：</label>
                <q-input v-model="formData.password" dense outlined :type="isPwd ? 'password' : 'text'" :rules="[rules.required('密码'), rules.password]" style="width: 180px" class="q-input-sm">
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!-- 手机 -->
              <div class="q-form-row">
                <label class="q-form-label"><span class="text-red">*</span> 确认密码：</label>
                <q-input v-model="formData.verifyPassword" dense outlined :type="isVerifyPwd ? 'password' : 'text'" :rules="[rules.required('确认密码'), rules.verifyPassword]" style="width: 180px" class="q-input-sm">
                  <template v-slot:append>
                    <q-icon
                      :name="isVerifyPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isVerifyPwd = !isVerifyPwd"
                    />
                  </template>
                </q-input>
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
                  class="q-input-sm"
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
                  class="q-input-sm"
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
                  class="q-input-sm"
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
                  class="q-input-sm"
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
                          class="q-select-sm"
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
                  class="q-input-sm"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn size="md" dense flat label="取消" color="primary" @click="cancel" />
        <q-btn size="md" dense label="确定" :loading="formData.loading" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { doUpdate, doInsert, doSetOrg } from '@/api/system/user/userManagement';
import { getDictList } from 'src/utils/dict';

defineOptions({
  name: 'UserUpdate'
})

const formRef = ref(null);
const isOpen = ref(false); // 控制弹窗是否显示
const formData = ref({
  id: null,
  username: 'adminU',
  realName: 'adminU',
  no: 'U1001',
  mobile: '13000000001',
  email: 'u@qq.com',
  remark: null,
  sign: null,
  enableSwitchTenant: null,
  loading: false,
  password: 'Aa123456.',
  verifyPassword: 'Aa123456.',
  title: '编辑'
});
const isPwd = ref(true);
const isVerifyPwd = ref(true);
const orgNode = ref(null);

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
  password: (val) => {
    const hasUpperCase = /[A-Z]/.test(val); // 包含大写字母
    const hasLowerCase = /[a-z]/.test(val); // 包含小写字母
    const hasNumber = /\d/.test(val); // 包含数字
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val); // 包含特殊字符
    const isLengthValid = val && val.length >= 6; // 长度至少 6 位

    return (
      (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid) ||
      '密码必须包含大小写字母、数字、特殊字符，且不少于6位'
    );
  },
  verifyPassword: (val) => val === formData.value.password || '两次输入的密码不一致',
};
const enableSwitchTenantOptions = ref([]);
// 打开对话框，并接收当前行数据
const openDialog = (rowData) => {
  isOpen.value = true;
  if(rowData){
    formData.value = { ...rowData, title: '编辑' };
  }else {
    // formData.value = {title: '新增' };
  }
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
      if(formData.value.id){
        doUpdate(formData.value).then(res => {
          $q.notify({ type: 'positive', message: res.data.msg });
          formData.value.loading = false;
          emit('fetchData');
          closeDialog();
        })
      }else {
        doInsert(formData.value).then(async res => {
          if (res.data.code == 0) {
            const param = {
              userId: res.data.data.id,
              orgModel: orgNode.value,
              izDef: '1',
            }
            if (orgNode.value) {
              await doSetOrg(param);
            }
            $q.notify({type: 'positive', message: res.data.msg});
            formData.value.loading = false;
            emit('fetchData');
            closeDialog();
          } else {
            $q.notify({type: 'positive', message: res.data.msg});
          }
        })
      }
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

const showInsertAndBindOrg = (orgNodeFromParent) => {
  orgNode.value = orgNodeFromParent
}

// 暴露 `openDialog` 方法供父组件调用
defineExpose({
  openDialog, showInsertAndBindOrg
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
