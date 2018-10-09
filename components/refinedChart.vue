<template>
    <view class="refinedChart-body">
        <!-- 地名 -->
        <view class="chart-title" v-if="data.length > 0">{{data[0].loc}}</view>
        <scroll-view class="speed-up" scroll-x="true" scroll-with-animation="true" @scroll="handleScroll">
            <view class="chart">
                <mpvue-echarts :echarts="echarts" :onInit="handleInit" :canvasId="canvasId" ref="echartsRef"></mpvue-echarts>
            </view>
            <!-- 滑动的日期球，Move属性决定球是否显示 -->
            <view class="balltrack">
                <view class="dateball slideball-Snd text-xxxs text-white" :class="{hide: !ballStatus.sndballMove}">{{sndballText}}</view>
                <view class="dateball slideball-Trd text-xxxs text-white" :class="{hide: !ballStatus.trdballMove}">{{trdballText}}</view>
            </view>
            <!-- 信息面板 -->
            <view class="infopanel">
                <view class="infopanel-day" v-for="(item, index) in data" :key="index">
                    <view class="infocolumn-left" />
                    <view class="infocolumn infocolumn-left text-xxs">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
                    <view class="infocolumn text-xxs">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
                </view>
            </view>
        </scroll-view>
        <!-- 固定在两端的日期球
        Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
        特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
        <view class="balltrack-fix">
            <view class="dateball fixball-Fst text-xxxs text-white" :class="{'dateball-active': ballStatus.fstballActive}">{{fstballText}}</view>
            <view class="dateball fixball-Snd text-xxxs text-white" :class="{'hide': ballStatus.sndballMove, 'dateball-active': ballStatus.sndballActive, 'fixball-Snd-left': ballStatus.sndballLeft}">{{sndballText}}</view>
            <view class="dateball fixball-Trd text-xxxs text-white" :class="{'hide': ballStatus.trdballMove, 'dateball-active': ballStatus.trdballActive, 'fixball-Trd-lone': ballStatus.sndballMove, 'fixball-Trd-left': ballStatus.trdballLeft}">{{trdballText}}</view>
        </view>
        <!-- 左右指示箭头 -->
        <view class="chevron chevron-right fa fa-chevron-right" :class="{hide: !chevronRightShow}" />
        <view class="chevron chevron-left fa fa-chevron-left" :class="{hide: !chevronLeftShow}" />
    </view>
</template>

<script>
	import * as echarts from './echarts/echarts.common.min.js'
	import mpvueEcharts from './mpvue-echarts/src/echarts.vue'

    let chart

    export default {
        name: 'refinedChart',
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
            // 图表数据
            option: {
                type: Object,
                default() {
                    return {}
                }
            },
            // 表格数据
            data: {
                type: Array,
                default () {
                    return [
                        {
                            loc: '',
                            time: '',
                            wave: '',
                            temp: '',
                            windLvl: '',
                            windDir: ''
                        },
                        {
                            loc: '',
                            time: '',
                            wave: '',
                            temp: '',
                            windLvl: '',
                            windDir: ''
                        },
                        {
                            loc: '',
                            time: '',
                            wave: '',
                            temp: '',
                            windLvl: '',
                            windDir: ''
                        },
                    ]
                }
            }
        },
        data() {
            return {
                // 日期球的日期文字
                fstballText: '1st',
                sndballText: '2nd',
                trdballText: '3rd',
                // 日期球控制参数
                ballStatus: {
                    fstballActive: true,	// 第一个球是否激活（显示为蓝色）
                    sndballActive: false,	// 第二个球是否激活（显示为蓝色）
                    sndballMove: false,		// 第二个球是否滑动
                    sndballLeft: false,		// 第二个球是否位于左端
                    trdballActive: false,	// 第三个球是否激活（显示为蓝色）
                    trdballMove: false,		// 第三个球是否滑动
                    trdballLeft: false,		// 第三个球是否位于左端
                },
                trackwidth: 0,          // 滑轨的长度
                scrollwidth: 0,         // 能滚动的最大长度
                sndRightPos: 0,         // 第二个小球的右边位置
                trdRightPos: 0,         // 第三个小球的右边位置
                stageOne: 0,            // 第二个小球到达左边
                stageTwo: 0,            // 第三个小球到达左边
				// 潮汐预报一左右三角箭头显隐
				chevronLeftShow: false,
                chevronRightShow: true,
                // 当前滚动状态
                currentStage: 0,
                echarts
            }
        },
        computed: {
            // ...mapState(['systemInfo'])
            systemInfo: {
                get () {
                    return this.$store.state.Infos.systeminfo
                }
            }
        },
        watch: {
            // 控制日期球状态
            currentStage: {
                handler (newVal, oldVal) {
                    switch (newVal) {
                        case 0:
                            this.ballStatus.fstballActive = true
                            this.ballStatus.sndballActive = false
                            this.ballStatus.trdballActive = false
                            this.ballStatus.sndballMove = false
                            this.ballStatus.sndballLeft = false
                            this.ballStatus.trdballMove = false
                            this.ballStatus.trdballLeft = false
                            this.chevronLeftShow = false
                            break
                        case 1:
                            this.ballStatus.fstballActive = true
                            this.ballStatus.sndballActive = false
                            this.ballStatus.trdballActive = false
                            this.ballStatus.sndballMove = true
                            this.ballStatus.sndballLeft = false
                            this.ballStatus.trdballMove = false
                            this.ballStatus.trdballLeft = false
                            this.chevronLeftShow = true
                            break
                        case 2:
                            this.ballStatus.fstballActive = false
                            this.ballStatus.sndballActive = true
                            this.ballStatus.trdballActive = false
                            this.ballStatus.sndballMove = false
                            this.ballStatus.sndballLeft = true
                            this.ballStatus.trdballMove = false
                            this.ballStatus.trdballLeft = false
                            break
                        case 3:
                            this.ballStatus.fstballActive = false
                            this.ballStatus.sndballActive = true
                            this.ballStatus.trdballActive = false
                            this.ballStatus.sndballMove = false
                            this.ballStatus.sndballLeft = true
                            this.ballStatus.trdballMove = true
                            this.ballStatus.trdballLeft = false
                            this.chevronRightShow = true
                            break
                        case 4:
                            this.ballStatus.fstballActive = false
                            this.ballStatus.sndballActive = false
                            this.ballStatus.trdballActive = true
                            this.ballStatus.sndballMove = false
                            this.ballStatus.sndballLeft = true
                            this.ballStatus.trdballMove = false
                            this.ballStatus.trdballLeft = true
                            this.chevronRightShow = false
                            break
                    }
                }
            },
            // 图表option
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
            // 设置曲线图下方日期球的日期
            setDateballText() {
                let now = new Date()
                function formatDate(date) { // 格式化日期为MM-dd
                    let month = date.getMonth() + 1
                    let day = date.getDate()
                    if (month < 10) {
                        month = '0' + month
                    }
                    if (day < 10) {
                        day = '0' + day
                    }
                    return month + '-' + day
                } // end-function formatDate
                // 三个球分别显示今天，明天和后天的日期
                this.fstballText = formatDate(now)
                now = new Date(now.setDate(now.getDate() + 1))
                this.sndballText = formatDate(now)
                now = new Date(now.setDate(now.getDate() + 1))
                this.trdballText = formatDate(now)
            },
            // 初始化第二三个小球的左距
            setDateballLeft() {
                this.trackwidth = this.systemInfo.windowWidth * 90 / 100
                this.scrollwidth = Math.round(this.trackwidth * 190 / 100) + 1
                this.sndRightPos = this.trackwidth - 57
                this.trdRightPos = this.trackwidth - 28
                this.stageOne = this.trackwidth - 29
                this.stageTwo = this.scrollwidth - 58
            },
            // 设置当前滚动状态
            setCurrentStage (scrollLeft) {
                if (scrollLeft < 45) {
                    this.currentStage = 0
                    // 刚开始滚动 还不足以让第二个球开始动
                } else if (scrollLeft < this.stageOne) {
                    this.currentStage = 1
                    // 第二个球开始动
                } else if (scrollLeft < this.trackwidth) {
                    this.currentStage = 2
                    // 第二个球停在最左边 第三个球还没开始动
                } else if (scrollLeft < this.stageTwo) {
                    this.currentStage = 3
					this.chevronLeftShow = true
					this.chevronRightShow = true
                    // 第三个球开始动
                } else {
                    this.currentStage = 4
					this.chevronRightShow = false
                    // 第三个球停在最左边
                }
            },
            // 图表滚动事件
            handleScroll(e) {
                this.setCurrentStage(e.detail.scrollLeft)
            },
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
        mounted() {
            // 加载时根据当前日期设置日期球文字
            this.setDateballText()
            this.setDateballLeft()
        }
    }
</script>

<style scoped>
    @import "../common/FontAwesome.css";
    @import "../common/generic.css";

    /* 整个组件的容器 */
    .refinedChart-body {
        position: relative;
    }

	/* 曲线图的容器 必须设置宽度和高度 */
    .chart {
        width: 290%;
        height: 200upx;
    }

    /* 图表上方的地名 */
    .chart-title {
        position: relative;
        width: 95%;
        left: 2.5%;
        border-bottom: 1upx solid #666;
    }

    /* 日期球的外观样式 */
    .dateball {
        display: flex;
        width: 50upx;
        height: 50upx;
        background-color: rgba(148, 148, 148, 0.8);
        border-radius: 50%;
        align-items: center;
        justify-content: center;
    }

    /* 日期球激活状态时现时为蓝色 */
    .dateball-active {
        background-color: rgba(0, 148, 255, 0.8);
    }

    /* 日期球隐藏状态 */
    .hide {
        display: none
    }

    /* 第二个球滑动时的定位 调整slideball的top和fixball的bottom 让两种球平行 */
    .slideball-Snd {
        position: relative;
        left: 96%;
    }

    /* 第三个球滑动时的定位 */
    .slideball-Trd {
        position: relative;
        left: 188%;
    }

    /* 第一个球固定时的定位 */
    .fixball-Fst {
        position: relative;
        left: 0%;
    }

    /* 第二个球固定时的定位 */
    .fixball-Snd {
        position: relative;
        left: 77.5%;
    }

    /* 第二个球固定在左端时的定位 */
    .fixball-Snd-left {
        left: 0%;
    }

    /* 第三个球固定时的定位 */
    .fixball-Trd {
        position: relative;
        left: 77.5%;
    }

    /* 当第二个球滑动时，第三个球需要调整定位 */
    .fixball-Trd-lone {
        left: 85%;
    }

    /* 第三个球固定在左端时的定位 */
    .fixball-Trd-left {
        left: 0%;
    }

    /* 滑动的小球的容器 flex属性能让小球水平排列，height为必须 */
    .balltrack {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 74upx;
    }

    /* 固定的小球的容器 */
    .balltrack-fix {
        width: 100%;
        height: 74upx;
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        position: absolute;
        bottom: 0;
    }

    /* 图表下方显示信息的面板 */
    .infopanel {
        position: absolute;
        top: 200upx;
        width: 290%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 80upx;
    }

    /* 信息面板中一天的部分 */
    .infopanel-day {
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    /* 信息面板的列 */
    .infocolumn {
        flex: 2;
        padding: 10upx;
        white-space: pre-wrap;
    }

    /* 左边的列 文字水平靠右 */
    .infocolumn-left {
        /* text-align: right; */
        flex: 1;
    }

    /* 曲线上左右箭头 */
	.chevron {
		position: absolute;
		bottom: 180upx;
		color: #666;
	}
	.chevron-right {
		right: 2.5%;
	}
	.chevron-left {
		left: 2.5%;
	}
</style>
