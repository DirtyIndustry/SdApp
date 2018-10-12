<template>
    <view>
        <view v-show="data.show">
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <mpvue-echarts :echarts="echarts" :onInit="handleInit" :canvasId="canvasId" ref="echartsRef"></mpvue-echarts>
            </view>
            <!-- 数值面板 -->
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view class="text-xs">水温:{{data.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view class="text-xs">浪高:{{data.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
    </view>
</template>

<script>
import * as echarts from './echarts/echarts.common.min.js'
import mpvueEcharts from './mpvue-echarts/src/echarts.vue'

let chart

export default {
    name: 'weihaiSPChart',
    components: {
        mpvueEcharts
    },
    props: {
        // 画布id 在页面中必须唯一
        canvasId: {
            type: String,
            default () {
                return ''
            },
            required: true
        },
        // 图表option
        option: {
            type: Object,
            default () {
                return {}
            }
        },
        // 表格数据
        data: {
            type: Object,
            default () {
                return {
                    show: false,
                    REPORTAREA: false,
                    WATERTEMP: '',
                    WAVEHEIGHT: '',
                    option: {}
                }
            }
        }
    },
    data() {
        return {
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
    }
}
</script>

<style scoped>
    @import "../common/generic.css";
    
	/* 威海专项图表 */
	.chart-weihai {
		width: 100%;
        height: 200upx;
	}

	/* 威海专项 图表下信息面板 */
	.weihai-infopanel {
		width: 100%;
		height: 50upx;
		display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
	}

	/* 威海专项 信息面板的列 */
	.weihai-infocolumn {
		flex: 2;
		display: flex;
        align-items: center;
        justify-content: center;
	}

	/* 威海专项 信息面板两侧留白列 */
	.weihai-infocolumn-side {
		flex: 1;
	}
</style>
