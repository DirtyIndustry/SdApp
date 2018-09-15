<template>
    <view class="refinedChart-body">
        <!-- 地名 -->
        <view class="chart-title" v-if="data.length > 0">{{data[0].loc}}</view>
        <scroll-view  class="speed-up" scroll-x="true" scroll-with-animation="true" @scroll="handleScroll">
            <view class="chart">
                <myChart :option="option" :canvasId="canvasId" />
            </view>
            <!-- 信息面板 -->
            <view class="infopanel">
                <view class="infopanel-day" v-for="(item, index) in data" :key="index">
                    <view class="infocolumn infocolumn-left text-mini">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
                    <view class="infocolumn text-mini">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
                </view>
            </view>
        </scroll-view>
        <!-- 日期球 -->
        <view class="speed-up balltrack-fix">
            <view class="dateball text-mini" :class="{'dateball-active': ballStatus.fstballActive}">{{fstballText}}</view>
            <view class="speed-up dateball text-mini" :class="{'dateball-active': ballStatus.sndballActive}"
                :style="{left: ballStatus.sndballLeft + 'px'}">{{sndballText}}</view>
            <view class="speed-up dateball text-mini" :class="{'dateball-active': ballStatus.trdballActive}"
                :style="{left: ballStatus.trdballLeft + 'px'}">{{trdballText}}</view>
        </view>
    </view>
</template>

<script>
    import myChart from './myChart.vue'

    export default {
        name: 'refinedChartAlt',
        components: {
            myChart
        },
        props: {
            // 画布id 在页面中必须唯一
            canvasId: {
                type: String,
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
                default: [
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
                    trdballActive: false,	// 第三个球是否激活（显示为蓝色）
                    sndballLeft: 0,         // 第二个球距左端的距离
                    trdballLeft: 0          // 第三个球距左端的距离
                },
                trackwidth: 0,          // 滑轨的长度
                scrollwidth: 0,         // 能滚动的最大长度
                sndRightPos: 0,         // 第二个小球的右边位置
                trdRightPos: 0,         // 第三个小球的右边位置
                stageOne: 0,            // 第二个小球到达左边
                stageTwo: 0             // 第三个小球到达左边
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
                this.ballStatus.sndballLeft = this.trackwidth - 57
                this.ballStatus.trdballLeft = this.trackwidth - 28
                this.sndRightPos = this.trackwidth - 57
                this.trdRightPos = this.trackwidth - 28
                this.stageOne = this.trackwidth - 29
                this.stageTwo = this.scrollwidth - 58
            },
            // 设置日期球的状态 scrollLeft为滚动距最左边的距离，windowWidth是系统信息屏幕宽度, ballObj为包含一系列bool值的object
            setDateballStatus (scrollLeft) {
                // 第二个球
                if (scrollLeft < 57) {
                    this.ballStatus.sndballLeft = this.sndRightPos
                } else if (scrollLeft > this.stageOne) {
                    this.ballStatus.sndballLeft = 29
                } else {
                    this.ballStatus.sndballLeft = this.trackwidth - scrollLeft
                }
                // 第三个球
                if (scrollLeft < this.trackwidth) {
                    this.ballStatus.trdballLeft = this.trdRightPos
                } else if (scrollLeft > this.stageTwo) {
                    this.ballStatus.trdballLeft = 58
                } else {
                    this.ballStatus.trdballLeft = this.scrollwidth - scrollLeft
                }
                // 颜色
                if (scrollLeft < this.stageOne) {
                    this.ballStatus.fstballActive = true
                    this.ballStatus.sndballActive = false
                    this.ballStatus.trdballActive = false
                } else if (scrollLeft < this.stageTwo) {
                    this.ballStatus.fstballActive = false
                    this.ballStatus.sndballActive = true
                    this.ballStatus.trdballActive = false
                } else {
                    this.ballStatus.fstballActive = false
                    this.ballStatus.sndballActive = false
                    this.ballStatus.trdballActive = true
                }
            },
            // 图标滚动事件
            handleScroll(e) {
                // console.log(e.detail.scrollLeft)
                this.setDateballStatus(e.detail.scrollLeft)
            },
        },
        mounted() {
            // 加载时根据当前日期设置日期球文字
            this.setDateballText()
            this.setDateballLeft()
        }
    }
</script>

<style scoped>
    @import "../common/generic.css";

    /* 整个组件的容器 */
    .refinedChart-body {
        position: relative;
    }

	/* 曲线图的容器 必须设置宽度和高度 */
    .chart {
        width: 290%;
        height: 250px;
    }

    /* 图表上方的地名 */
    .chart-title {
        position: relative;
        width: 95%;
        left: 2.5%;
        border-bottom: 1px solid #666;
    }

    /* 日期球的外观样式 */
    .dateball {
        display: flex;
        width: 62px;
        height: 62px;
        position: absolute;
        bottom: 11px;
        background-color: rgba(148, 148, 148, 0.8);
        border-radius: 62px;
        align-items: center;
        justify-content: center;
    }

    /* 日期球激活状态时现时为蓝色 */
    .dateball-active {
        background-color: rgba(0, 148, 255, 0.8);
    }

    /* 固定的小球的容器 */
    .balltrack-fix {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        position: absolute;
        bottom: 0;
    }

    /* 图表下方显示信息的面板 */
    .infopanel {
        position: relative;
        width: 290%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 80px;
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
        flex: 1;
        padding: 10px;
        white-space: pre-wrap;
    }

    /* 左边的列 文字水平靠右 */
    .infocolumn-left {
        text-align: right;
    }

</style>
