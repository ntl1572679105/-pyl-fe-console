// 分销比例配置

<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :data-source="dataSource.list"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.isEdit" @click="itemSave(record, index)" style="margin-right: 10px"
                >保存</a
              >
              <a v-else @click="record.isEdit = true" style="margin-right: 10px" v-permission="['operator:ratio:edit']">编辑</a>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'shopType'">
            {{ shopTypeName(text) }}
          </template>
          <template v-else-if="column.key === 'ratio'">
            <a-input-number
              v-if="record.isEdit"
              v-model:value="record.ratio"
              :min="0"
              :max="100"
              :formatter="(value) => `${value}%`"
              :parser="(value) => value.replace('%', '')"
            />
            <span v-else>{{ text }}%</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, computed, getCurrentInstance } from 'vue';
import { ratioList, ratioDetail, ratioEdit } from '@/api/ratio';

const { proxy } = getCurrentInstance();

const columns = [
  {
    title: '商品平台',
    dataIndex: 'shopType',
  },
  {
    title: '平台比例',
    dataIndex: 'ratio',
    key: 'ratio',
  },
  // {
  //   title: '团长比例',
  //   dataIndex: 'chief',
  //   key: 'chief',
  // },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];

const dataSource = reactive({
  list: [],
});
const loading = ref(false);

onMounted(() => {
  getList();
});
const getList = () => {
  loading.value = true;
  // setTimeout(() => {
  //   dataSource.list = [
  //     { id: 1, isEdit: false, title: '集中采购', ratio: '5', chief: '5' },
  //     { id: 2, isEdit: false, title: '个人采购', ratio: '4', chief: '3' },
  //     { id: 3, isEdit: false, title: '渔获商城（供应链）', ratio: '5', chief: '4' },
  //     { id: 4, isEdit: false, title: '渔获商城（顶级渔获）', ratio: '4', chief: '5' },
  //     { id: 5, isEdit: false, title: '享生活', ratio: '7', chief: '8' },
  //   ];
  //   loading.value = false;
  // }, 1500);
  ratioList().then((res) => {
    console.log(res);
    loading.value = false;
    dataSource.list = res.data;
  })
};

const shopTypeName = computed(() => {
  return (value) => {
    return ['', '集采商城', '个采商城', 'b2b商城', '顶级渔获', '享生活(O2O)'][value];
  };
})

const itemSave = (record) => {
  if (record && record.ratio != null) {
    ratioEdit({id: record.id, ratio: record.ratio}).then((res) => {
      console.log(res);
      proxy.$message.success('修改成功');
      record.isEdit = false;
    }).catch((e) => {
      console.log(e);
      proxy.$message.warning('修改失败，请重试');
    })
  } else {
    proxy.$message.warning('平台比例不能为空');
    return;
  }
};
</script>
