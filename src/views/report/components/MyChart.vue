<template>
  <div :id="chartId" :style="getChartStyle"></div>
</template>

<script name="MyCharts" setup>
import order_option from '../options.js'
import {
  ref,
  shallowRef,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // options: {
  //   type: Object,
  //   default: () => {
  //     return {}
  //   }
  // },
  height: {
    type: Number,
    default: 300
  },
  // 是否不跟之前的传入值合并
  notMerge: {
    type: Boolean,
    default: true
  },
  xData: {
    type: Object,
    default: {}
  },
  yData: {
    type: Object,
    default: {}
  }
})

const emits = defineEmits(['chart-click'])

const getChartStyle = computed(() => {
  return {
    width: '100%',
    height: `${props.height}px`
  }
})

watch(
  () => props.yData,
  () => {
    initChart()
  },
  {
    deep: true
  }
)

// 默认显示的图表配置数据
const defaultOptions = {
    xAxis: {
      type: 'category',
      data: ['10-1','10-2','10-3','10-4','10-5','10-6','10-7','10-8','10-9','10-10'],
    },
    legend: {
      orient: 'horizontal',
      bottom: 20,
      icon: 'rect',
      itemHeight: 10,
      itemWidth: 10,
      opacity: 0.4,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    series: [
      {
        name: '成交订单',
        data: [2200, 1320, 1010, 1340, 900, 1347, 900, 1230, 2210, 1650],
        type: 'line',
        symbol: 'circle',
        showSymbol: false,
        symbolSize: 9,
        itemStyle: {
          color: '#f68090',
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowColor: 'rgba(246, 128, 144, 0.5)',
          shadowBlur: 12
        },
        // stack: 'Total',
        areaStyle: {
          opacity: 0.4,
        },
        lineStyle: {
          width: 3
        }
      },
      {
        name: '订单数量',
        data: [2200, 1820, 1910, 2340, 1500, 1990, 2900, 1330, 2310, 1650],
        type: 'line',
        symbol: 'circle',
        showSymbol: false,
        symbolSize: 9,
        itemStyle: {
          color: '#0099ff',
          borderColor: 'rgb(255, 255, 255)',
          borderWidth: 2,
          shadowColor: 'rgb(0, 153, 255)',
          shadowBlur: 12
        },
        // stack: 'Total',
        areaStyle: {
          opacity: 0.4,
        },
        lineStyle: {
          width: 3
        }
      },
    ],
}

const getRandomStr = () => {
  const randomNumStr = String(Math.random()).split('.')[1]
  return randomNumStr
}

const chartId = ref('chart-id')
const getChartId = () => {
  const str = 'chart-id-' + getRandomStr()
  chartId.value = str
}

getChartId()

const resizeHandler = () => {
  eChartsRef.value.resize()
}

const resizeHandlerOrigin = resizeHandler

const eChartsRef = shallowRef()
const initChart = () => {
  eChartsRef.value = echarts.init(document.getElementById(chartId.value))
  // let options = {}
  // if (isEmptyObj(props.options)) {
  //   options = defaultOptions
  // } else {
  //   options = props.options
  // }
  eChartsRef.value.setOption(order_option(props.xData, props.yData), props.notMerge)
  // console.log(order_option(props.xData, props.yData));
  window.addEventListener('resize', resizeHandlerOrigin)
}

const isEmptyObj = (obj) => {
  return typeof obj === 'object' && JSON.stringify(obj) === '{}'
}

const initChartEvent = () => {
  cancelClickEvent()
  eChartsRef.value.on('click', (params) => {
    emits('chart-click', params)
  })
}

const cancelClickEvent = () => {
  eChartsRef.value.off('click')
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  cancelClickEvent()
  window.removeEventListener('resize', resizeHandlerOrigin)
  eChartsRef.value.dispose()
})

watch(
  () => props.options,
  () => {
    initChart()
  },
  {
    deep: true
  }
)
</script>
<style lang="scss" scoped></style>
