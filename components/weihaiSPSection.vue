<template>
    <!-- 威海专项预报 -->
    <view class="page-section" v-show="weihaiData.show">
        <view>威海专项预报</view>
        <!-- 第一部分 -->
        <view v-show="weihaiData.first.show">
            <view>{{weihaiData.first.REPORTAREA}}</view>
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiOne" canvasId="canvasIdWeihaiOne" ref="echartsRefWeihaiOne"></mpvue-echarts>
            </view>
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view>水温:{{weihaiData.first.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view>浪高:{{weihaiData.first.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
        <!-- 第二部分 -->
        <view v-show="weihaiData.second.show">
            <view>{{weihaiData.second.REPORTAREA}}</view>
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiTwo" canvasId="canvasIdWeihaiTwo" ref="echartsRefWeihaiTwo"></mpvue-echarts>
            </view>
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view>水温:{{weihaiData.second.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view>浪高:{{weihaiData.second.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
        <!-- 第三部分 -->
        <view v-show="weihaiData.third.show">
            <view>{{weihaiData.third.REPORTAREA}}</view>
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiThree" canvasId="canvasIdWeihaiThree" ref="echartsRefWeihaiThree"></mpvue-echarts>
            </view>
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view>水温:{{weihaiData.third.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view>浪高:{{weihaiData.third.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
        <!-- 第四部分 -->
        <view v-show="weihaiData.fourth.show">
            <view>{{weihaiData.fourth.REPORTAREA}}</view>
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiFour" canvasId="canvasIdWeihaiFour" ref="echartsRefWeihaiFour"></mpvue-echarts>
            </view>
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view>水温:{{weihaiData.fourth.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view>浪高:{{weihaiData.fourth.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
    </view>
</template>

<script>
import utils from '../../utils/utils.js'

import * as echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

let chartWeihaiOne = undefined
let chartWeihaiTwo = undefined
let chartWeihaiThree = undefined
let chartWeihaiFour = undefined

export default {
    name: 'weihaiSPSection',
    components: {
        mpvueEcharts
    },
    props: {
        weihaiData: {
            type: Object,
            default () {
                return {
					show: false,
					first: {show: false},
					second: {show: false},
					third: {show: false},
					fourth: {show: false}
				}
                
            }
        }
    },
    data () {
        return {
            echarts
        }
    },
    methods: {
        // 初始化威海专项图表一
        handleInitWeihaiOne(canvas, width, height) {
            chartWeihaiOne = echarts.init(canvas, null, {
                width: width,
                height: height
            })
            canvas.setChart(chartWeihaiOne)
            chartWeihaiOne.setOption(this.weihaiData.first.option, true)
            return chartWeihaiOne
        },
        // 初始化威海专项图表二
        handleInitWeihaiTwo(canvas, width, height) {
            chartWeihaiTwo = echarts.init(canvas, null, {
                width: width,
                height: height
            })
            canvas.setChart(chartWeihaiTwo)
            chartWeihaiTwo.setOption(this.weihaiData.second.option, true)
            return chartWeihaiTwo
        },
        // 初始化威海专项图表三
        handleInitWeihaiThree(canvas, width, height) {
            chartWeihaiThree = echarts.init(canvas, null, {
                width: width,
                height: height
            })
            canvas.setChart(chartWeihaiThree)
            chartWeihaiThree.setOption(this.weihaiData.third.option, true)
            return chartWeihaiThree
        },
        // 初始化威海专项图表四
        handleInitWeihaiFour(canvas, width, height) {
            chartWeihaiFour = echarts.init(canvas, null, {
                width: width,
                height: height
            })
            canvas.setChart(chartWeihaiFour)
            chartWeihaiFour.setOption(this.weihaiData.fourth.option, true)
            return chartWeihaiFour
        }
    },
    watch: {
        // 威海专项四个chart更新
        weihaiData: {
            handler(newVal, oldVal) {
                if (chartWeihaiOne !== undefined) {
                    if (newVal) {
                        // chartWeihaiOne.setOption(newVal.first.option, true)
                        this.$refs.echartsRefWeihaiOne.init()
                    }
                }
                if (chartWeihaiTwo !== undefined) {
                    if (newVal) {
                        // chartWeihaiTwo.setOption(newVal.second.option, true)
                        this.$refs.echartsRefWeihaiTwo.init()
                    }
                }
                if (chartWeihaiThree !== undefined) {
                    if (newVal) {
                        // chartWeihaiThree.setOption(newVal.third.option, true)
                        this.$refs.echartsRefWeihaiThree.init()
                    }
                }
                if (chartWeihaiFour !== undefined) {
                    if (newVal) {
                        // chartWeihaiFour.setOption(newVal.fourth.option, true)
                        this.$refs.echartsRefWeihaiFour.init()
                    }
                }
            }
        }
    }
}
</script>

<style>
	/* 威海专项图表 */
	.chart-weihai {
		width: 100%;
        height: 250px;
        border: 1px solid #000000;
	}

	/* 威海专项 图表下信息面板 */
	.weihai-infopanel {
		width: 100%;
		height: 50px;
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
