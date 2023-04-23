<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator" v-permission="['system:menu:add']">
        <a-button type="primary" @click="handleAdd"> 新建 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="menuId"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.menuType !== 'F'" @click="handleAdd(record)" v-permission="['operator:menu:add']">添加</a>
              <a @click="handleEdit(record)" v-permission="['operator:menu:edit']">编辑</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['operator:menu:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            {{ textStatus(text) }}
          </template>
        </template>
      </a-table>
      <MenuModal ref="menuModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import MenuModal from './components/MenuModal.vue';
import { menuList, menuDelete } from '@/api/menu';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
];

const textStatus = computed(() => {
  return (value) => {
    return ['正常', '停用'][value];
  };
});
const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true;
  menuList()
    .then((res) => {
      const list = res;
      menuDataClean(list, []);
      dataSource.list = list;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 菜单数据清理：1.删除空children 2.赋值级联菜单ids
const menuDataClean = (list, parentMenuIds) => {
  list.forEach((item) => {
    item.menuIds = [...parentMenuIds, item.menuId];
    item.label = item.menuName;
    item.value = item.menuId;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        menuDataClean(item.children, item.menuIds);
      }
    }
  });
};

const deleteEmptyChildren = (list) => {
  list.forEach((item) => {
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        deleteEmptyChildren(item.children);
      }
    }
  });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该菜单-${record.menuName}吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      menuDelete(record.menuId).then(() => {
        proxy.$message.success('删除成功');
        getList();
      });
    },
  });
};
const handleAdd = (record) => {
  proxy.$refs.menuModal.show({
    title: '添加',
    menus: dataSource.list,
    menuIds: record ? record.menuIds : null,
  });
};
const handleEdit = (record) => {
  proxy.$refs.menuModal.show({
    title: '修改',
    ...record,
    menus: dataSource.list,
    menuIds: record.menuIds.slice(0, record.menuIds.length - 1),
  });
};
const modalOk = () => {
  getList();
};
</script>

<style lang="less" scoped></style>
