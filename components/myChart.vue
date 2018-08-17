<template>
	<!-- <view :id="id"> -->
		<mpvue-echarts :echarts="echarts" :onInit="handleInit" :canvasId="id"></mpvue-echarts>
	<!-- </view> -->
</template>

<script>
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chart = null

	export default {
		name: 'myChart',
		props: {
			id: {
				type: String
			},
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
				echarts,
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
				this.chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(this.chart)
				this.chart.setOption(this.option)
				return this.chart
			}
		},
	}
</script>
