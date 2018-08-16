<template>
	<mpvue-echarts :echarts="echarts" :onInit="handleInit"></mpvue-echarts>
</template>

<script>
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chart = null

	export default {
		name: 'myChart',
		props: {
			option: {
				type: Object,
				default () {
					return {
						title: {
							text: 'ECharts 入门示例'
						},
						tooltip: {},
						legend: {
							data: ['销量']
						},
						xAxis: {
							data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
						},
						yAxis: {},
						series: [{
							name: '销量',
							type: 'bar',
							data: [5, 20, 36, 10, 10, 20]
						}]
					}
				}
			}
		},
		data() {
			return {
				echarts
			}
		},
		computed: {
			style() {
				return {
					height: this.height,
					width: this.width
				}
			}
		},
		watch: {
			option: {
				handler(newVal, oldVal) {
					if (this.chart) {
						if (newVal) {
							this.chart.setOption(newVal)
						} else {
							this.chart.setOption(oldVal)
						}
					} else {
						this.handleInit()
					}
				}
			}
		},
		components: {
			mpvueEcharts
		},
		methods: {
			handleInit(canvas, width, height) {
				chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chart)
				chart.setOption(this.option)
				return chart
			}
		},
	}
</script>
