

export default function order_option(xData, yData) {
  const option = {
    xAxis: {
      type: 'category',
      data: xData,
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
    series: yData
  }
  return option
}