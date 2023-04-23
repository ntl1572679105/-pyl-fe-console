<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-spin :spinning="getiing">
        <div class="one" style="display: flex; flex-direction: column; justify-content: center">
          <div class="part">基础信息</div>
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 10 }"
            label-align="right"
          >
            <a-form-item label="编号" name="id" style="display: none">
              <a-input v-model:value="formState.id" disabled></a-input>
            </a-form-item>
            <a-form-item label="优惠券类型" name="type" style="margin-top: 10px">
              <a-select
                v-model:value="formState.type"
                placeholder="选择优惠券类型"
                :options="couponList"
                style="width: 70%"
                @change="typeChange"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="优惠券名称" name="name">
              <a-input
                v-model:value="formState.name"
                allowClear
                placeholder="输入内容"
                style="width: 70%"
              />
            </a-form-item>
            <a-form-item label="优惠券金额" name="radioCouponvalueCheck" style="margin-top: 10px">
              <a-radio-group
                v-model:value="formState.radioCouponvalueCheck"
                @change="couponValueDataChange"
                style="width: 100%"
              >
                <div style="display: block; width: 100%">
                  <a-radio :value="1" style="flex-wrap: nowrap; width: 100%">
                    <span style="display: inline-block; line-height: 38px">固定金额</span>
                    <a-form-item
                      name="couponValueGD"
                      style="display: inline-block; margin-left: 10px"
                    >
                      <a-input-number
                        :disabled="couponValueGDSelect"
                        v-model:value="formState.couponValueGD"
                        :min="1"
                        style="margin-right: 5px; width: 90%"
                      />元
                    </a-form-item>
                  </a-radio>
                </div>
                <div style="display: block; width: 100%">
                  <a-radio :value="2" style="flex-wrap: nowrap; width: 100%; margin-top: 10px">
                    <span style="display: inline-block; line-height: 38px">折扣比</span>
                    <a-form-item
                      name="couponValueZk"
                      style="display: inline-block; margin-left: 10px"
                    >
                      <a-input-number
                        :disabled="couponValueZKSelect"
                        v-model:value="formState.couponValueZk"
                        :min="0.1"
                        :precision="2"
                        @blur="couponValueZkBlur"
                        style="margin-right: 5px; width: 90%"
                      />折
                      <span style="font-size: 12px; margin-top: 5px; display: block"
                        >设置可抵扣金额或折扣比，最小为1和0.1</span
                      >
                    </a-form-item>
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="订单满减" name="threshold">
              <span style="margin-right: 5px; line-height: 32px">订单金额满</span>
              <a-input-number
                v-model:value="formState.threshold"
                prefix="￥"
                :min="0"
                style="width: 60%; margin-right: 5px"
                placeholder=""
              /><span style="line-height: 32px; margin-right: 5px">可用</span>
              <span style="font-size: 12px; display: block; margin-top: 5px"
                >默认为0表示不限制使用金额</span
              >
            </a-form-item>
            <a-form-item label="优惠券有效期" name="couponDate">
              <a-radio-group
                v-model:value="formState.couponDate"
                @change="validityDaysChange"
                name="validityDays"
                style="width: 100%"
              >
                <div style="width: 100%; display: block">
                  <a-radio :value="3" style="flex-wrap: nowrap; margin-right: 10px">
                    <span style="display: inline-block; line-height: 38px">固定日期</span>
                    <a-form-item name="fixDate" style="display: inline-block; margin-left: 10px">
                      <a-range-picker
                        :disabled="couponDateGDSelect"
                        v-model:value="formState.fixDate"
                        style="width: 100%"
                        show-time
                        format="YYYY/MM/DD HH:mm:ss"
                      />
                    </a-form-item>
                  </a-radio>
                </div>
                <div style="width: 100%; display: block">
                  <a-radio :value="4" style="flex-wrap: nowrap; margin-top: 10px">
                    <span style="display: inline-block; line-height: 38px">领到券当日起</span>

                    <a-form-item name="startDays" style="display: inline-block; margin-left: 10px">
                      <a-input-number
                        id="inputNumber"
                        ref=""
                        :disabled="couponDateNSelect"
                        v-model:value="formState.startDays"
                        :precision="0"
                        :min="0"
                        style="margin-right: 5px; width: 50%"
                      />日内有效
                    </a-form-item>
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="发放数量" name="totalNum" style="margin-top: 10px">
              <a-input-number
                id="inputNumber"
                v-model:value="formState.totalNum"
                :min="0"
                style="margin-right: 5px; width: 70%"
                placeholder="请输入发放数量"
              />张
              <span style="font-size: 12px; display: block; margin-top: 5px"
                >设置此优惠券的总数量，领取完后则不能再领取</span
              >
            </a-form-item>
            <a-form-item label="用户最多领取" name="limitNum">
              <a-input-number
                id="inputNumber"
                v-model:value="formState.limitNum"
                :min="1"
                :max="formState.totalNum"
                style="margin-right: 5px; width: 70%"
                placeholder="请输入数量"
              />张
              <span style="font-size: 12px; display: block; margin-top: 5px"
                >设置每个账号最多可以领取多少张优惠券，默认为1张</span
              >
            </a-form-item>
            <div class="part">使用条件</div>
            <a-form-item label="可使用产品" name="goodsSelect">
              <a-radio-group
                v-model:value="formState.goodsSelect"
                @change="goodsChange"
                style="display: flex; flex-direction: column; margin-top: 6px"
              >
                <a-radio :value="1" style="flex-wrap: nowrap"
                  >所有产品
                  <span style="font-size: 12px; margin-left: 10px; display: block"
                    >默认所有产品可用，设置为所有产品则可以在所有产品中使用</span
                  >
                </a-radio>
                <a-radio :value="2" style="flex-wrap: nowrap; margin-top: 10px"
                  >按产品品类
                </a-radio>
                <a-form-item name="limitCategoryIds" style="width: 100%">
                  <!-- <a-cascader
                      style="margin-top: 10px; width: 100%"
                      v-model:value="formState.limitCategoryIds"
                      :disabled="couponGoodsSelect"
                      :options="productCategoryList"
                      placeholder="请选择产品品类"
                      @change="productCategoryListChanges"
                      change-on-select
                    /> -->
                  <a-select
                    mode="multiple"
                    v-model:value="formState.limitCategoryIds"
                    :disabled="couponGoodsSelect"
                    show-search
                    @focus="handleFocus"
                    style="width: 600px"
                  >
                    <a-select-option
                      v-for="(item, index) in productCategoryList"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-radio-group>
            </a-form-item>
            <div
              class="btnbox"
              style="display: flex; margin-left: 36%; align-items: center; margin-top: 20px"
            >
              <a-button type="primary" @click="submit" :loading="loading" style="margin-right: 15px"
                >提交</a-button
              >
            </div>
          </a-form>
        </div>
      </a-spin>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { PlusOutlined, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { reactive, ref, getCurrentInstance, onMounted, defineProps, computed } from 'vue';
import { goodsListDetail, addGoods, updateGoods } from '@/api/goods.js';
import { categoryList } from '@/api/system.js';
import { couponAdd, couponDetail, couponUpdate } from '@/api/miniapp.js';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
defineProps({
  id: String,
});

/// 基础信息
const formRef = ref();
const mainFileList = ref([]);
const mainUploading = ref(false);
// 存储是否为固定日期
// const isFixDate = ref('');
const formState = reactive({
  id: undefined,
  name: '',
  couponValue: '',
  threshold: 0,
  totalNum: '',
  limitNum: '',
  validityDays: '',
  type: undefined,
  startDays: '', // 领到券当日起
  fixDate: [], // 固定日期
  limitCategoryIds: [],
  couponValueGD: '',
  couponValueZk: '',

  radioCouponvalueCheck: 1,
  goodsSelect: 1,
  couponDate: 3,
});
const couponValueData = ref('1');
const validityDaysData = ref('3');
const goodsData = ref('1');
// 折扣比
// 固定金额
const rules = reactive({
  name: [{ required: true, message: '请输入优惠券名称' }],
  threshold: [{ required: true, message: '请输入满减金额' }],
  limitNum: [{ required: true, message: '请输入用户最多领取张数' }],
  totalNum: [{ required: true, message: '请输入发放数量' }],
  type: [{ required: true, message: '请选择优惠券类型' }],
  // couponValueData
  radioCouponvalueCheck: [{ required: true, message: '请选择优惠券金额类型' }],
  // validityDaysData
  couponDate: [{ required: true, message: '请选择优惠券有效期类型' }],
  // goodsData
  goodsSelect: [{ required: true, message: '请选择产品品类类型' }],

  couponValueGD: [{ required: true, message: '请输入固定金额' }],
  fixDate: [{ required: true, message: '请选择固定日期' }],
});

// 优惠券类型 1-金额券 2-折扣券
const couponList = ref([
  { label: '金额券', value: 1 },
  { label: '折扣券', value: 2 },
]);
const loading = ref(false);
const getiing = ref(false);

// 判断是否有选中状态
const couponValueGDSelect = ref(false);
const couponValueZKSelect = ref(true);
const couponDateGDSelect = ref(false);
const couponDateNSelect = ref(true);
const couponGoodsSelect = ref(true);
// 优惠券类型
const typeChange = (val) => {
  formState.radioCouponvalueCheck = val;
  deleteRuleKey(val);
  val === 1
    ? ((couponValueGDSelect.value = false), (couponValueZKSelect.value = true))
    : ((couponValueZKSelect.value = false), (couponValueGDSelect.value = true));
  if (couponValueZKSelect.value) {
    deleteRuleKey();
  }
  if (couponValueGDSelect.value) {
    deleteRuleKey();
  }
  appendRuleCouponVlaue(val);
  deleteRuleCouponValue(val);
};
const handleFocus = () => {};

const couponValueDataChange = (val) => {
  // console.log(val, 'yhq');
  const el = val.target.value;
  formState.type = el;
  if ((couponValueGDSelect.value = false) || (couponValueZKSelect.value = false)) {
    deleteRuleKey();
  }
  if (el === 1) {
    couponValueGDSelect.value = false;
    couponValueZKSelect.value = true;
  } else {
    couponValueGDSelect.value = true;
    couponValueZKSelect.value = false;
  }
  appendRuleCouponVlaue(el);
  deleteRuleCouponValue(el);
  deleteRuleKey(el);
};
const goodsChange = (val) => {
  // console.log(val,'goodsChange')
  const el = val.target.value;
  formState.goodsSelect = el;
  el === 2 ? (couponGoodsSelect.value = false) : (couponGoodsSelect.value = true);
  deleteGoodsRule();
  if (el === 2) {
    AddRuleGoodsSelect();
  } else {
    DeleteRuleGoodsSelect();
  }
};
const AddRuleGoodsSelect = () => {
  rules.limitCategoryIds = [{ required: true, message: '请选择产品品类' }];
};
const DeleteRuleGoodsSelect = () => {
  Object.keys(rules).forEach((key) => {
    if (key === 'limitCategoryIds') {
      delete rules[key];
    }
  });
};
const deleteGoodsRule = () => {
  Object.keys(rules).forEach((key) => {
    if (key === 'goodsSelect') {
      delete rules[key];
    }
  });
};
const deleteRuleKey = () => {
  Object.keys(rules).forEach((key) => {
    if (key === 'radioCouponvalueCheck') {
      delete rules[key];
    }
  });
};

const appendRuleCouponVlaue = (type) => {
  if (type === 1) {
    rules.couponValueGD = [{ required: true, message: '请输入固定金额' }];
  } else {
    rules.couponValueZk = [{ required: true, message: '请输入折扣比' }];
  }
};
const deleteRuleCouponValue = (type) => {
  if (type === 1) {
    Object.keys(rules).forEach((key) => {
      if (key === 'couponValueZk') {
        delete rules[key];
      }
    });
  } else {
    Object.keys(rules).forEach((key) => {
      if (key === 'couponValueGD') {
        delete rules[key];
      }
    });
  }
};
// 优惠券有效器
const appendRuleCouponDate = (type) => {
  if (type === 3) {
    rules.fixDate = [{ required: true, message: '请选择固定日期' }];
    Object.keys(rules).forEach((key) => {
      if (key === 'startDays') {
        delete rules[key];
      }
    });
  } else if (type === 4) {
    rules.startDays = [{ required: true, message: '请输入领到券有效时长' }];
    Object.keys(rules).forEach((key) => {
      if (key === 'fixDate') {
        delete rules[key];
      }
    });
  }
};
const deleteDate = () => {
  Object.keys(rules).forEach((key) => {
    if (key == 'couponDate') {
      delete rules[key];
    }
  });
};
// const productCategoryListChanges = (val) => {
//   formState.limitCategoryIds = val;
// };
// 固定日期radiochangge事件
const validityDaysChange = (val) => {
  const el = val.target.value;
  formState.couponDate = el;
  // console.log(el, '固定日期');

  if (el === 3) {
    couponDateGDSelect.value = false;
    couponDateNSelect.value = true;
  } else {
    couponDateGDSelect.value = true;
    couponDateNSelect.value = false;
  }
  // console.log(couponDateNSelect.value, couponDateGDSelect.value);
  if (couponDateGDSelect.value) {
    deleteDate(el);
    appendRuleCouponDate(el);
  }
  if (couponDateNSelect.value) {
    deleteDate(el);
    appendRuleCouponDate(el);
  }
};

onMounted(() => {
  getCategoryList();
  if (proxy.id) {
    getDetail(proxy.id);
  }
});
const apiType = ref('');
apiType.value = proxy.$route.meta.type;
const couponValueZkBlur = (val) => {
  console.log(val);
};
const getDetail = (id) => {
  // getiing.value = true;
  // 获取优惠券详情
  couponDetail(proxy.id, proxy.$route.meta.type)
    .then((res) => {
      // console.log(res);

      Object.keys(res).forEach((key) => {
        formState[key] = res[key];
      });
      appendRuleCouponVlaue(res.type);
      deleteRuleCouponValue(res.type);
      // 按产品品类
      if (res.categoryNames && res.categoryNames.length > 0) {
        formState.goodsSelect = 2;
        DeleteRuleGoodsSelect();
        couponGoodsSelect.value = false;
        res.categoryNames.map((item) => {
          return formState.limitCategoryIds.push(item.id);
        });
      } else {
        couponGoodsSelect.value = true;
      }
      // 固定日期
      if (formState.validityDays !== 0) {
        formState.startDays = res.validityDays;
        formState.couponDate = 4;
        couponDateGDSelect.value = true;
        couponDateNSelect.value = false;
        appendRuleCouponDate(formState.couponDate);
      } else {
        formState.fixDate.push(dayjs(res.beginTime), dayjs(res.endTime));
        formState.couponDate = 3;
        couponDateGDSelect.value = false;
        couponDateNSelect.value = true;
        appendRuleCouponDate(formState.couponDate);
      }
      deleteRuleKey(res.type);

      // 优惠券类型 1-金额券 2-折扣券
      formState.radioCouponvalueCheck = res.type === 1 ? 1 : 2;
      res.type == 1
        ? ((formState.couponValueGD = res.couponValue),
          (couponValueGDSelect.value = false),
          (couponValueZKSelect.value = true))
        : ((formState.couponValueZk = res.couponValue),
          (couponValueZKSelect.value = false),
          (couponValueGDSelect.value = true));
      formState.goodsData = res.categoryNames && res.categoryNames.length > 0 ? 2 : 1;
      // 固定日期
      if (res.validityDays === 0) {
        // isFixDate.value = 3;
        formState.couponDate = 3;
      } else {
        formState.couponDate = 4;
      }
      deleteGoodsRule();
    })
    .finally(() => {
      loading.value = false;
    });
};

const productCategoryList = ref([]);

const getCategoryList = () => {
  categoryList(apiType.value).then((res) => {
    const list = [];
    // transformData(res, list);
    // console.log(list, 'list');
    res.forEach((item) => {
      productCategoryList.value.push({ id: item.id, name: item.name });
    });
    // console.log(productCategoryList, 'productCategoryList');
    // productCategoryList.value = list;
  });
};

// 转换类目结构
const transformData = (list, result) => {
  if (list && list.length > 0) {
    list.forEach((item) => {
      const child = { label: item.name, value: item.id, children: [] };
      transformData(item.children, child.children);
      if (child.children.length <= 0) {
        delete child.children;
      }
      result.push(child);
    });
  }
};

const submit = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    console.log(values, 'values');

    // threshold满减门槛 0为不限制 type 优惠券类型 1-金额券 2-折扣券
    const { limitNum, name, threshold, totalNum, type, limitCategoryIds } = values;
    const couponValue = type === 1 ? values.couponValueGD : values.couponValueZk;
    // 3为固定
    const validityDays = formState.couponDate === 3 ? 0 : values.startDays;
    const beginTime = dayjs(values.fixDate[0]).format('YYYY-MM-DD hh:mm:ss');
    const endTime = dayjs(values.fixDate[1]).format('YYYY-MM-DD hh:mm:ss');
    // console.log(beginTime, endTime, 'endTime');
    const requestParameters = reactive({
      limitNum,
      name,
      threshold,
      totalNum,
      type,
      limitCategoryIds,
      couponValue,
      validityDays,
      beginTime,
      endTime,
    });
    if (requestParameters.limitNum === requestParameters.totalNum < 0) {
      return;
    }
    if (validityDays !== 0) {
      Object.keys(requestParameters).forEach((key) => {
        if (key === 'beginTime') {
          delete requestParameters[key];
        } else if (key === 'endTime') {
          delete requestParameters[key];
        }
      });
    }

    if (formState.goodsSelect == 1) {
      Object.keys(requestParameters).forEach((key) => {
        if (key === 'limitCategoryIds') {
          delete requestParameters[key];
        }
      });
    }
    if (proxy.id) {
      requestParameters.id = proxy.id;
    }
    const api = proxy.id ? couponUpdate : couponAdd;

    // console.log(requestParameters, 'requestParameters');
    api(requestParameters, proxy.$route.meta.type)
      .then((res) => {
        proxy.id ? proxy.$message.success('修改成功') : proxy.$message.success('添加成功');
        if (proxy.$route.meta.type && proxy.$route.meta.type === 1) {
          proxy.$router.push({ path: `/cp-miniapp/discountManage` });
        } else {
          proxy.$router.push({ path: `/ip-miniapp/discountManage` });
        }
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>

<style lang="less" scoped>
.part {
  font-size: 18px;
  position: relative;
  padding-left: 60px;
}

.part::before {
  position: absolute;
  content: '';
  width: 10px;
  height: 20px;
  background: #1890ff;
  top: 0;
  left: 40px;
  bottom: 0;
  margin: auto;
}

.flex {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.attrForm {
  margin-top: 30px;
  margin-left: 180px;
}

.sku-box {
  margin-top: 20px;
  padding: 20px 40px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;

  // width: 80%;
  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &-item {
    display: flex;
    gap: 10px;
    width: 30%;
    align-items: center;
  }
}
</style>
