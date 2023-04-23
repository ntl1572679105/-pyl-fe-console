<template>
  <a-modal
    v-model:visible="visible"
    title="批量改价"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
    @ok="handleOk"
    :z-index="900"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="批量修改后价格" name="price">
        <a-input v-model:value="formState.price" />
        <a-tooltip a-tooltip placement="topLeft">
          <span style="color: #c9c9c9;"
            ><b style="line-height: 40px;vertical-align: top;">注意: </b><br />1. 如果原商品有划线价格，统一修改后价格高于划线价格，划线价格将不显示。<br />
            2. 商品平台售价不可低于商品结算价，此次修改无效</span
          >
        </a-tooltip>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, defineExpose, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { updateGoods } from '@/api/goods';

const route = useRouter();
const formRef = ref();
const { proxy } = getCurrentInstance();
const formState = reactive({
  arr: [],
  list: []
});
const rules = {
  price: [{ required: true, message: '请输入修改后价格' }],
};

const loading = ref(false);
const visible = ref(false);
const show = (item) => {
  let li = [];
  console.log(item);
  visible.value = true;
  Object.values(item.list).forEach((jtem, index) => {
    if (item.arr.includes(jtem.id)) {
      li.push(item.list[index]);
      formState.list = li;
    }
  })

  console.log(formState.list);
};

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};

const apiType = ref('');
apiType.value = route.currentRoute._value.meta.type;

const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    let price = Number(values.price);
    let arr = [];
    let warningText = false;
    let errorText = false;
    let deleteFlag = false;
    loading.value = true;
    const nArr = formState.list.filter((item) => {
      item.skuList.forEach((item1) => {
        item1.price = price;
        if (item1.price < item1.settlePrice) {
          errorText = true;
          deleteFlag = true;
        }
        if (item1.price > item1.normalPrice) {
          warningText = true;
        }
      });
      item.price = price;
      if (deleteFlag) {
        deleteFlag = false
        return false
      } else {
        return true
      }
    });
    if (warningText) {
      message.warning('如果原商品有划线价格，统一修改后价格高于划线价格，划线价格将不显示。')
    }
    if (errorText) {
      message.error('商品平台售价不可低于商品结算价，此次修改无效。')
    }
    nArr.forEach((item) => {
      arr.push(
        new Promise((resolve) => {
          updateGoods(apiType.value, { ...item }).then((res) => {
            resolve(res);
          });
        }),
      );
    })
    Promise.all(arr).then((values) => {
      console.log(values);
      formRef.value.resetFields();
      loading.value = false;
      visible.value = false;
      proxy.$emit('finish');
    })
  });
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
