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
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>

      <!-- <a-form-item label="渔船编号" name="number">
        <a-input v-model:value="formState.number" placeholder="请输入" />
      </a-form-item> -->
      <a-form-item label="所有人名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="MMSI码" name="mmsi">
        <a-input v-model:value="formState.mmsi" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="船舶种类" name="shipType">
        <a-select v-model:value="formState.shipType" placeholder="请选择" :options="typeOptions" />
      </a-form-item>
      <a-form-item label="船名" name="shipName">
        <a-input v-model:value="formState.shipName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="船长" name="shipLength">
        <a-input-number
          v-model:value="formState.shipLength"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="船宽" name="shipWidth">
        <a-input-number
          v-model:value="formState.shipWidth"
          placeholder="请输入"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="建造日期" name="buildTime">
        <a-date-picker
          v-model:value="formState.buildTime"
          style="width: 100%"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item label="船员信息" name="crew">
        <a-input v-model:value="formState.crew" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { fishingBoatsAdd, fishingBoatsEdit } from '@/api/customer.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      title: '',
      id: undefined,
      name: '',
      phone: '',
      mmsi: '',
      shipType: undefined,
      shipName: '',
      shipLength: '',
      shipWidth: '',
      buildTime: undefined,
      crew: '',
    });
    const rules = {
      phone: [{ required: true, message: '请输入' }],
      name: [{ required: true, message: '请输入' }],
      mmsi: [{ required: true, message: '请输入' }],
      shipType: [{ required: true, message: '请选择' }],
      shipName: [{ required: true, message: '请输入' }],
      shipLength: [{ required: true, message: '请输入' }],
      shipWidth: [{ required: true, message: '请输入' }],
      buildTime: [{ required: true, message: '请选择' }],
    };

    const typeOptions = [
      { label: '捕捞渔船', value: '捕捞渔船' },
      { label: '休闲渔船', value: '休闲渔船' },
      { label: '辅助渔船', value: '辅助渔船' },
    ];

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      item.buildTime && (formState.buildTime = dayjs(item.buildTime));
      console.log(formState);
      // formState.type = item.type || 0;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? fishingBoatsEdit : fishingBoatsAdd;
        const content = values.id ? '修改成功' : '新增成功';
        const params = { ...values };
        if (params.buildTime) {
          params.buildTime = dayjs(params.buildTime).format('YYYY-MM-DD');
        }
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
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
      typeOptions,
    };
  },
};
</script>

<style lang="less" scoped></style>
