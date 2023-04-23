<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="content">
        <h1>渔获评级标准：</h1>
        <h3>选择渔获</h3>
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane :key="item.type" :tab="item.tab" v-for="(item,index1) in dataState.list">
            <h3>选择标准</h3>
            <div class="select" v-for="(i,index2) in item.select" :key="index2">
              <div class="">
                {{numFilter(index2)}}、{{i.title}}
              </div>
              <div class="select-item" v-for="(select,index3) in i.list" :key="index3">
                <div class="select-item-t">
                  {{index3+1}}、
                  {{select.title}}：
                  {{ select.content}}
                </div>
                <div class="select-item-b">
                  <a-radio-group v-model:value="select.value" name="radioGroup" >
                    <a-radio :value="0">是</a-radio>
                    <a-radio :value="1">否</a-radio>
                  </a-radio-group>
                </div>
              </div>
            </div>
            <div class="resultBtn">
              <a-button  type="primary" @click="getResult(index1)">生成评定结果</a-button>
            </div>
            <div class="result" v-if="item.result">
              <h3>评级结果：</h3>
              <div>{{item.result}}</div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </PageContainer>
</template>

<script setup>
import {reactive,ref} from "vue";
import {getGrade} from "@/api/pb2b/grade";

const activeKey = ref('0')
const dataState = reactive({
  list:[
    {
      type:'0',
      tab:'带鱼',
      result:'',
      select:[
        {
          title:'【非国标】规格指标（单条）',
          list:[{
            title:'≥500克/条',
            content:'',
            value:0
          }]
        },
        {
          title:'感官要求',
          list:[
            {
              title:'冷冻状态',
              content:'单冻产品的个体间应易于分离，冰衣透明光亮。 块冻产品冻块平整不破碎,冰被清洁并均匀盖没鱼体。鱼体大小均匀，排列整齐，无干耗和软化现象',
              value:0
            },
            {
              title:'外观',
              content:'体表呈银白色或银灰色，富有光泽，鱼鳞不易擦落，鳃呈鲜红或紫红色，黏液透明，眼球饱满，角膜清晰',
              value:0
            },
            {
              title:'组织',
              content:'肌肉坚实，组织紧密有弹性',
              value:0
            },
            {
              title:'气味',
              content:'具有带鱼固有气味，无异味',
              value:0
            },
            {
              title:'水煮试验',
              content:'水煮后,具鲜带鱼正常的鲜味,肌肉组织细腻滋味鲜美',
              value:0
            },
          ]
        },
        {
          title:'地理标志证明（非硬性指标）',
          list:[{
            title:'是否有地理标志证明（非硬性指标）',
            content:'',
            value:0
          }]
        },
        {
          title:'水产城ISO9001质量体系认证（非硬性指标）',
          list:[{
            title:'是否有水产城ISO9001质量体系认证（非硬性指标）',
            content:'',
            value:0
          }]
        },
        // {
        //   title:'理化指标',
        //   list:[{
        //     title:'挥发性盐基氮，≤ 18mg/100g',
        //     content:'',
        //     value:0
        //   }]
        // },
      ]
    },
    {
      type:'1',
      tab:'鲳鱼（银鲳，灰鲳，燕尾鲳）',
      result:'',
      select:[
        {
          title:'【非国标】规格指标（单条）',
          list:[{
            title:'≥400克/条',
            content:'',
            value:0
          }]
        },
        {
          title:'感官要求',
          list:[
            {
              title:'冷冻状态',
              content:'单冻产品的个体间应易于分离，冰衣透明光亮。 块冻产品冻块平整不破碎,冰被清洁并均匀盖没鱼体。鱼体大小均匀，排列整齐，无干耗和软化现象',
              value:0
            },
            {
              title:'外观',
              content:'鱼体坚挺,体表有光泽;鳃丝清晰,呈鲜红色或略带暗红，黏液透明;眼球饱满,角膜清晰；',
              value:0
            },
            {
              title:'组织',
              content:'肌肉坚实，组织紧密有弹性',
              value:0
            },
            {
              title:'气味',
              content:'具有鲳鱼固有气味，无异味',
              value:0
            },
            {
              title:'水煮试验',
              content:'水煮后,具鲜鲳鱼正常的鲜味,肌肉组织细腻滋味鲜美',
              value:0
            },

          ]
        },
        {
          title:'地理标志证明（非硬性指标）',
          list:[{
            title:'是否有地理标志证明（非硬性指标）',
            content:'',
            value:0
          }]
        },
        {
          title:'水产城ISO9001质量体系认证（非硬性指标）',
          list:[{
            title:'是否有水产城ISO9001质量体系认证（非硬性指标）',
            content:'',
            value:0
          }]
        },
        // {
        //   title:'理化指标',
        //   list:[{
        //     title:'挥发性盐基氮，≤ 18mg/100g',
        //     content:'',
        //     value:0
        //   }]
        // },
      ]
    },
    {
      type:'2',
      tab:'小黄鱼',
      result:'',
      select:[
        {
          title:'【非国标】规格指标（单条）',
          list:[{
            title:'≥150克/条',
            content:'',
            value:0
          }]
        },
        {
          title:'感官要求',
          list:[
            {
              title:'冷冻状态',
              content:'单冻产品的个体间应易于分离，冰衣透明光亮。 块冻产品冻块平整不破碎,冰被清洁并均匀盖没鱼体。鱼体大小均匀，排列整齐，无干耗和软化现象',
              value:0
            },
            {
              title:'外观',
              content:'鳞片紧致、完整，呈金黄或虎黄色(包括白磷黄)，体表有光泽，鳃丝清晰，呈鲜红或紫红色，黏液透明，眼球饱满，角膜清晰',
              value:0
            },
            {
              title:'组织',
              content:'肌肉坚实，组织紧密有弹性',
              value:0
            },
            {
              title:'气味',
              content:'具有小黄鱼固有气味，无异味',
              value:0
            },
            {
              title:'水煮试验',
              content:'水煮后,具鲜鲳鱼正常的鲜味,肌肉组织细腻滋味鲜美',
              value:0
            },
          ]
        },
        {
          title:'地理标志证明（非硬性指标）',
          list:[{
            title:'是否有地理标志证明（非硬性指标）',
            content:'',
            value:0
          }]
        },
        {
          title:'水产城ISO9001质量体系认证（非硬性指标）',
          list:[{
            title:'是否有水产城ISO9001质量体系认证（非硬性指标）',
            content:'',
            value:0
          }]
        },
        // {
        //   title:'理化指标',
        //   list:[{
        //     title:'挥发性盐基氮，≤ 18mg/100g',
        //     content:'',
        //     value:0
        //   }]
        // },
      ]
    },
    {
      type:'3',
      tab:'大黄鱼(野生)',
      result:'',
      select:[
        {
          title:'【非国标】规格指标（单条）',
          list:[{
            title:'≥1000克/条',
            content:'',
            value:0
          }]
        },
        {
          title:'感官要求',
          list:[
            {
              title:'冷冻状态',
              content:'单冻产品的个体间应易于分离，冰衣透明光亮。 块冻产品冻块平整不破碎,冰被清洁并均匀盖没鱼体。鱼体大小均匀，排列整齐，无干耗和软化现象',
              value:0
            },
            {
              title:'外观',
              content:'鳞片紧致、完整，呈金黄或虎黄色(包括白磷黄)，体表有光泽，鳃丝清晰，呈鲜红或紫红色，黏液透明，眼球饱满，角膜清晰',
              value:0
            },
            {
              title:'组织',
              content:'肌肉坚实，组织紧密有弹性',
              value:0
            },
            {
              title:'气味',
              content:'具有大黄鱼固有气味，无异味',
              value:0
            },
            {
              title:'水煮试验',
              content:'水煮后,具大黄鱼正常的鲜味,肌肉组织细腻滋味鲜美',
              value:0
            },
          ]
        },
        {
          title:'地理标志证明（非硬性指标）',
          list:[{
            title:'是否有地理标志证明（非硬性指标）',
            content:'',
            value:0
          }]
        },
        {
          title:'水产城ISO9001质量体系认证（非硬性指标）',
          list:[{
            title:'是否有水产城ISO9001质量体系认证（非硬性指标）',
            content:'',
            value:0
          }]
        },
        // {
        //   title:'理化指标',
        //   list:[{
        //     title:'挥发性盐基氮，≤ 18mg/100g',
        //     content:'',
        //     value:0
        //   }]
        // },
      ]
    },
    {
      type:'4',
      tab:'三疣梭子蟹（冻品）',
      result:'',
      select:[
        {
          title:'【非国标】规格指标（单条）',
          list:[{
            title:'≥400克/条',
            content:'',
            value:0
          }]
        },
        {
          title:'感官要求',
          list:[
            {
              title:'冷冻状态',
              content:'单冻产品的个体间应易于分离，冰衣透明光亮',
              value:0
            },
            {
              title:'外观',
              content:'外观呈浅黄褐色具有梭子蟹固有体色，无明显变质颜色，腹面甲壳洁白或呈浅黄褐色，有光泽。脐上部无胃印或胃印呈黄褐色',
              value:0
            },
            {
              title:'组织',
              content:'组织及形态 肥满席和鲜度良好，提起蟹体时整足和步足硬直或允许下垂,用手指压腹面有坚实感。肉质有弹性，蟹黄凝固不流动或少有流散现象',
              value:0
            },
            {
              title:'气味',
              content:'具有新鲜梭子蟹固有的鲜、腥味，无异味、臭味；蒸煮后具有梭子蟹固有的鲜香味，肉质紧密，无氨味及其他不良气味和口味',
              value:0
            },
            {
              title:'其他',
              content:'无肉眼可见的外来杂质',
              value:0
            },
          ]
        },
        {
          title:'地理标志证明（非硬性指标）',
          list:[{
            title:'是否有地理标志证明（非硬性指标）',
            content:'',
            value:0
          }]
        },
        {
          title:'水产城ISO9001质量体系认证（非硬性指标）',
          list:[{
            title:'是否有水产城ISO9001质量体系认证（非硬性指标）',
            content:'',
            value:0
          }]
        },
        // {
        //   title:'理化指标',
        //   list:[{
        //     title:'挥发性盐基氮，≤ 18mg/100g',
        //     content:'',
        //     value:0
        //   }]
        // },
      ]
    },
  ]
})
const numFilter = (index)=>{
  const list = ['一','二','三','四','五','六','七','八','九','十']
  return list[index]
}
const getResult = (index)=>{
  console.log(index);
  let data = {
    aspectStatus:dataState.list[index].select[1].list.find(item=>item.title==='外观').value, // 外观
    cookStatus:dataState.list[index].select[1].list.find(item=>item.title==='水煮试验')?.value, // 水煮
    frozenStatus:dataState.list[index].select[1].list.find(item=>item.title==='冷冻状态').value, // 冰冻
    smellStatus:dataState.list[index].select[1].list.find(item=>item.title==='气味').value,  // 气味
    tissueStatus:dataState.list[index].select[1].list.find(item=>item.title==='组织').value, // 组织
    otherStatus:dataState.list[index].select[1].list.find(item=>item.title==='其他')?.value, // 其他
    geographicalIndication:dataState.list[index].select[2].list.find(item=>item.title==='是否有地理标志证明（非硬性指标）').value, // 地理标志
    waterAreaStatus:dataState.list[index].select[3].list.find(item=>item.title==='是否有水产城ISO9001质量体系认证（非硬性指标）').value, // 水域质量认证
    type:index, // 种类
    weightStatus:undefined //重量
  }
  if(index===0 && dataState.list[index].select[0].list[0].value===0) {data.weightStatus =1}
  else if(index===1 && dataState.list[index].select[0].list[0].value===0) {data.weightStatus =2}
  else if(index===2 && dataState.list[index].select[0].list[0].value===0) {data.weightStatus =3}
  else if(index===3 && dataState.list[index].select[0].list[0].value===0) {data.weightStatus =0}
  else if(index===4 && dataState.list[index].select[0].list[0].value===0) {data.weightStatus =2}
  else{data.weightStatus =4}
  console.log(data);

  getGrade(data).then((res)=>{
    dataState.list[index].result = res.result
    console.log(res);
  })
}
</script>

<style lang="less" scoped>
.content{
  .select{
    padding:10px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.85);
    &-item{
      &-t{

      }
      &-b{
        display: flex;
        justify-content: end;
      }
    }
  }
  .resultBtn{
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style>
