<template>
	<!-- <view class="chart"> -->
	<mpvue-echarts :echarts="echarts" :onInit="handleInit" :canvasId="canvasId" ref="echartsRef"></mpvue-echarts>
	<!-- </view> -->
</template>

<script>
	import * as echarts from './echarts/echarts.common.min.js'
	import mpvueEcharts from './mpvue-echarts/src/echarts.vue'

	let chart

	export default {
		name: 'myChart',
		props: {
			// 画布id 在页面中必须唯一
            canvasId: {
				type: String,
				default: 'id',
				required: true
            },
            // 图表数据
            option: {
                type: Object,
				default() {
					return {}
				},
				required: true
            }
		},
		data() {
			return {
				echarts
			}
		},
		computed: {
			thischart: function () {
				return chart
			}
		},
		watch: {
			option: {
                handler(newVal, oldVal) {
                    if (chart !== undefined) {
                        if (newVal) {
							//chart.setOption(newVal, true)
							this.$refs.echartsRef.init()
                        }
                    }
                }
            }
		},
		components: {
			mpvueEcharts
		},
		methods: {
			// 初始化图表
            handleInit(canvas, width, height) {
                chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                })
                canvas.setChart(chart)
                chart.setOption(this.option, true)
                return chart
            }
		},
	}
</script>

<style scoped>
	/* 曲线图的容器 必须设置宽度和高度 */
    .chart {
        width: 290%;
        height: 250upx;
        border: 1upx solid #000000;
    }
</style>
