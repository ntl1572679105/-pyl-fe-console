<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    :closable="false"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" :loading="loading" type="primary" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="menuId" style="display: none">
        <a-input v-model:value="formState.menuId" />
      </a-form-item>
      <a-form-item label="父级菜单" name="parentId">
        <a-cascader
          v-model:value="formState.parentId"
          :options="menuOptions"
          change-on-select
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item label="菜单类型" name="menuType" :rules="{ required: true, message: '请选择' }">
        <a-select v-model:value="formState.menuType" placeholder="请选择">
          <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="菜单名称" name="menuName" :rules="{ required: true, message: '请输入' }">
        <a-input v-model:value="formState.menuName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="显示排序" name="orderNum" :rules="{ required: true, message: '请输入' }">
        <a-input-number
          :precision="0"
          :min="0"
          :max="99999"
          v-model:value="formState.orderNum"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="是否外链" name="frame">
        <a-switch v-model:checked="formState.frame" :checkedValue="1" :unCheckedValue="0" />
      </a-form-item>
      <a-form-item label="权限字符" name="perms" :rules="{ required: true, message: '请输入' }">
        <a-input v-model:value="formState.perms" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="路由地址" name="path" :rules="{ required: true, message: '请输入' }">
        <a-input v-model:value="formState.path" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="显示状态" name="visible">
        <a-switch v-model:checked="formState.visible" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item label="菜单状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';
import { menuAdd, menuEdit } from '@/api/menu.js';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      title: '添加',
      menuId: undefined,
      parentId: null,
      menuType: undefined,
      menuName: '',
      perms: '',
      path: '',
      orderNum: '',
      frame: 0,
      visible: 0,
      status: 0,
    });

    const menuOptions = ref([]);
    const typeOptions = [
      { label: '目录', value: 'M' },
      { label: '菜单', value: 'C' },
      { label: '接口', value: 'F' },
    ];

    const visible = ref(false);
    const loading = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.visible = item.visible || 0;
      formState.status = item.status || 0;
      formState.frame = item.frame || 0;
      formState.orderNum = item.orderNum;
      if (item.menuIds) {
        formState.parentId = item.menuIds;
      } else {
        formState.parentId = null;
      }
      menuOptions.value = item.menus;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
      emit('reset');
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        console.log(values);
        loading.value = true;
        const api = values.menuId ? menuEdit : menuAdd;
        const params = { ...values };
        if (values.parentId && values.parentId.length > 0) {
          params.parentId = values.parentId[values.parentId.length - 1];
        } else {
          params.parentId = 0;
        }
        api(params)
          .then((res) => {
            emit('finish', res);
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      formRef,
      formState,
      visible,
      loading,
      menuOptions,
      typeOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>

<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: gray;
}
</style>
