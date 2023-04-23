<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="roleId" style="display: none">
        <a-input v-model:value="formState.roleId" disabled />
      </a-form-item>

      <a-form-item label="角色名称" name="roleName">
        <a-input v-model:value="formState.roleName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="权限字符" name="roleKey">
        <a-input v-model:value="formState.roleKey" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="角色顺序" name="roleSort">
        <a-input-number
          :precision="0"
          v-model:value="formState.roleSort"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="启用状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item label="菜单权限" name="menuIds">
        <div class="custom-tree">
          <a-tree
            checkable
            :onCheck="onCheck"
            :tree-data="treeState.treeData"
            v-model:checkedKeys="treeState.checkedKeys"
            v-model:selectedKeys="treeState.selectedKeys"
          />
        </div>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="4"
          placeholder="请输入"
          show-count
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { roleAdd, roleEdit } from '@/api/role.js';
import { menuList } from '@/api/common.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const list = ref([]);
    const formState = reactive({
      title: '',
      roleId: undefined,
      roleName: '',
      roleKey: '',
      roleSort: '',
      status: 0,
      menuIds: [],
      remark: '',
    });
    const rules = {
      roleName: [{ required: true, message: '请输入' }],
      roleKey: [{ required: true, message: '请输入' }],
      roleSort: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const treeState = reactive({
      treeData: [],
      checkedKeys: [],
      selectedKeys: [],
    });

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.status = item.status || 0;
      if (item && item.menuList) {
        const tree = [];
        listToTree(item.menuList, tree);
        treeState.treeData = tree;
        // treeState.checkedKeys = item.checkedIdList;

        const set = new Set();
        treeToSet(item.menuList, set);
        treeState.checkedKeys = item.checkedIdList.filter(number => set.has(number));
      } else {
        formState.menuIds = [];
        treeState.checkedKeys = [];
        getMenuList();
      }
    };

    // 获取菜单
    const getMenuList = () => {
      menuList().then((res) => {
        const tree = [];
        listToTree(res, tree);
        treeState.treeData = tree;
      });
    };
    const listToTree = (list, tree) => {
      if (list.length <= 0) return;
      list.forEach((item) => {
        const result = { title: item.menuName, key: item.menuId };
        if (item.children && item.children.length > 0) {
          const temps = [];
          listToTree(item.children, temps);
          result.children = temps;
        }
        tree.push(result);
      });
    };

    const onCheck = (info, e) => {
      console.log(e.halfCheckedKeys, 'halfCheckedKeys', e);
      // treeState.selectedKeys = treeState.selectedKeys.concat(e.halfCheckedKeys)
      // console.log(treeState.selectedKeys, 'checkedKeys');
      list.value = e.halfCheckedKeys
      console.log(list.value, 'list.value');
    }
    const treeToSet = (list, set) => {
      if (list.length <= 0) return;
      list.forEach((item) => {
        if (item.children && item.children.length > 0) {
          treeToSet(item.children, set);
        } else {
          set.add(item.menuId)
        }
      });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        const params = { ...values };
        // params.menuIds = treeState.checkedKeys.checked;
        params.menuIds = treeState.checkedKeys.concat(list.value.filter(function (val) {
          return list.value.indexOf(val) > -1;
        }))
        if (params.roleName.length > 30) {
          proxy.$message.warning('角色名称不得超过30个字符!');
          return
        }
        if (params.roleKey.length > 100) {
          proxy.$message.warning('角色说明不得超过100个字符!');
          return
        }
        loading.value = true;
        const api = values.roleId ? roleEdit : roleAdd;
        const content = values.roleId ? '修改成功' : '新增成功';
        api(params)
          .then(() => {
            proxy.$message.success(content);
            emit('finish');
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      formRef,
      mapRef,
      formState,
      rules,
      treeState,
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
      listToTree,
      onCheck,
      treeToSet,
    };
  },
};
</script>

<style lang="less" scoped>
.custom-tree {
  background-color: #ebf4ff;
  height: 200px !important;
  overflow: scroll;
}
:deep(.ant-tree) {
  background-color: #ebf4ff;
}
</style>
