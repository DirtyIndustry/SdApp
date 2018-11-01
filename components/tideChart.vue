<template>
	<view class="chart-container">
        <text class="chart-title text" v-if="title !== ''">{{title}}</text>
        <scroll-view scroll-x="true" @scroll="scrollTideOne">
            <view class="chart-tide">
                <mpvue-echarts :echarts="echarts" :onInit="handleInit" :canvasId="canvasId" ref="echartsRef"></mpvue-echarts>
            </view>
        </scroll-view>
        <!-- 左右指示箭头 -->
        <view v-if="chevronRightShow" class="chevron chevron-right fa fa-chevron-right" />
        <view v-if="chevronLeftShow" class="chevron chevron-left fa fa-chevron-left" />
    </view>
</template>

<script>
	import * as echarts from './echarts/echarts.common.min.js'
	import mpvueEcharts from './mpvue-echarts/src/echarts.vue'

	let chart

	export default {
		name: 'tideChart',
		props: {
			// 画布id 在页面中必须唯一
            canvasId: {
				type: String,
				default () {
					return ''
				},
				required: true
            },
            // 图表数据
            option: {
                type: Object,
				default () {
					return {}
				},
				required: true
            },
            // 图表标题
            title: {
                type: String,
                default () {
                    return ''
                }
            }
		},
		data() {
			return {
                // 潮汐预报左右三角箭头
				chevronRightShow: true,
				chevronLeftShow: false,
				echarts
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
            },
            // 潮汐图表一滚动事件
			scrollTideOne (e) {
				if (e.detail.scrollLeft < 80) {
					this.chevronLeftShow = false
				} else if (e.detail.scrollLeft < 540) {
					this.chevronLeftShow = true
					this.chevronRightShow = true
				} else {
					this.chevronRightShow = false
				}
			},
		},
	}
</script>

<style scoped>
	@import "../common/FontAwesome.css";

	/* 潮汐曲线容器 */
	.chart-container {
		display: flex;
		flex-direction: column;
        position: relative;
	}
    /* 潮汐曲线上方的地名 */
	.chart-title {
		position: relative;
        width: 95%;
		left: 2.5%;
        border-bottom: 1upx solid #666;
	}
    /* 潮汐预报曲线图的容器 必须设置宽度和高度 */
	.chart-tide {
		width: 305%;
		height: 200upx;
	}
    /* 潮汐曲线上左右箭头 */
	.chevron {
		position: absolute;
		bottom: 100upx;
		color: #666;
	}
	.chevron-right {
		right: 2.5%;
	}
	.chevron-left {
		left: 2.5%;
	}
</style>
