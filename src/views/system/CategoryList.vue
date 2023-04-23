<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" v-permission="['category:add']">
          新增一级类目
        </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a
                @click="handleAdd(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcCategory:add']
                    : ['operator:gcCategory:add']
                "
                >添加子集</a
              >
              <a
                @click="handleEdit(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcCategory:edit']
                    : ['operator:gcCategory:edit']
                "
                >编辑</a
              >
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcCategory:remove']
                    : ['operator:gcCategory:remove']
                "
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image v-if="text" :width="40" :src="text" />
          </template>
          <template v-else-if="column.key === 'view'">
            <a-space>
              <a @click="viewCategory(record)">查看</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(record, checked)"
              :loading="record.loading"
            />
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <CategoryListModal ref="categoryListModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { categoryList, categoryDetail, categoryDelete, categoryEdit } from '@/api/system.js';
import CategoryListModal from './components/CategoryListModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '25%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '展示图片',
    dataIndex: 'imgUrl',
    key: 'img',
    width: '20%',
  },
  // {
  //   title: '排序',
  //   dataIndex: 'sort',
  //   width: '15%',
  // },
  {
    title: '商品',
    key: 'view',
    width: '10%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '25%',
    align: 'right',
  },
  {
    title: '操作',
    key: 'action',
    width: '20%',
    align: 'center',
  },
];

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
onMounted(() => {
  getList();
});
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getList = () => {
  loading.value = true;
  categoryList(apiType.value)
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
    item.menuIds = [...parentMenuIds, item.id];
    item.label = item.name;
    item.value = item.id;
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        menuDataClean(item.children, item.menuIds);
      }
    }
  });
};

const changeStatus = (record, checked) => {
  record.loading = true;
  categoryEdit(apiType.value, { ...record, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该类目-${record.name}吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      categoryDelete(apiType.value, record.id).then(() => {
        proxy.$message.success('删除成功');
        getList();
      });
    },
  });
};
const handleAdd = (record) => {
  proxy.$refs.categoryListModal.show({
    title: '添加',
    type: 'add',
    menus: dataSource.list,
    menuIds: record ? record.menuIds : null,
  });
};

const unique = (arr) => {
  return Array.from(new Set(arr));
};

const handleEdit = (record) => {
  proxy.$refs.categoryListModal.show({
    title: '修改',
    type: 'update',
    ...record,
    menus: dataSource.list,
    menuIds: record.menuIds.slice(0, record.menuIds.length - 1),
  });
  // console.log(record,'record')
};
const modalOk = () => {
  getList();
};
const viewCategory = (record) => {
  console.log(record, 'record');
  const str =
    proxy.$route.meta.type && proxy.$route.meta.type == 1 ? 'cp-goodsManage' : 'ip-goodsManage';
  const arr = record.ancestors.split(',');
  const queryRequest = {};
  switch (arr.length) {
    case 1:
      console.log(1);
      console.log(record.id, 'record.id');
      queryRequest.primaryCategoryId = record.id;
      break;
    case 2:
      console.log(2);
      queryRequest.primaryCategoryId = arr[1];
      queryRequest.secondaryCategoryId = record.id;
      break;
    case 3:
      console.log(3);
      queryRequest.primaryCategoryId = arr[1];
      queryRequest.secondaryCategoryId = arr[2];
      queryRequest.thirdlyCategoryId = record.id;
      break;
    case 4:
      queryRequest.primaryCategoryId = arr[1];
      queryRequest.secondaryCategoryId = arr[2];
      queryRequest.thirdlyCategoryId = arr[3];
      break;
    case 5:
      queryRequest.primaryCategoryId = arr[1];
      queryRequest.secondaryCategoryId = arr[2];
      queryRequest.thirdlyCategoryId = arr[3];
      break;
  }
  if (arr.length == 1) {
    console.log(1);
    queryRequest.primaryCategoryId = record.id;
  } else if (arr.length == 2) {
    console.log(2);
    queryRequest.primaryCategoryId = arr[1];
    queryRequest.secondaryCategoryId = record.id;
  } else if (arr.length == 3) {
    queryRequest.primaryCategoryId = arr[1];
    queryRequest.secondaryCategoryId = arr[2];
    queryRequest.thirdlyCategoryId = record.id;
  } else {
    queryRequest.primaryCategoryId = arr[1];
    queryRequest.secondaryCategoryId = arr[2];
    queryRequest.thirdlyCategoryId = arr[3];
  }
  // console.log(queryRequest.value, arr);
  proxy.$router.push({
    path: `/${str}/list`,
    query: {
      primaryCategoryId: queryRequest.primaryCategoryId || '',
      secondaryCategoryId: queryRequest.secondaryCategoryId || '',
      thirdlyCategoryId: queryRequest.thirdlyCategoryId || '',
    },
  });
};
</script>

<style lang="less" scoped></style>
