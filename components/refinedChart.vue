<template>
    <view class="refinedChart-body">
        <!-- 地名 -->
        <view v-if="data.length > 0">{{data[0].loc}}</view>
        <scroll-view scroll-x="true" scroll-with-animation="true" @scroll="handleScroll">
            <view class="chart">
                <myChart :option="option" :canvasId="canvasId" />
            </view>
            <!-- 滑动的日期球，Move属性决定球是否显示 -->
            <view class="balltrack">
                <view class="dateball slideball-Snd text-mini" v-if="ballStatus.sndballMove">{{sndballText}}</view>
                <view class="dateball slideball-Trd text-mini" v-if="ballStatus.trdballMove">{{trdballText}}</view>
            </view>
            <!-- 信息面板 -->
            <view class="infopanel">
                <view class="infopanel-day" v-for="(item, index) in data" :key="index">
                    <view class="infocolumn infocolumn-left text-mini">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
                    <view class="infocolumn text-mini">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
                </view>
            </view>
        </scroll-view>
        <!-- 固定在两端的日期球
        Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
        特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
        <view class="balltrack-fix">
            <view class="dateball fixball-Fst text-mini" :class="{'dateball-active': ballStatus.fstballActive}">{{fstballText}}</view>
            <view class="dateball fixball-Snd text-mini" :class="{'dateball-active': ballStatus.sndballActive, 'fixball-Snd-left': ballStatus.sndballLeft}"
                v-if="ballStatus.sndballMove == false">{{sndballText}}</view>
            <view class="dateball fixball-Trd text-mini" :class="{'dateball-active': ballStatus.trdballActive, 'fixball-Trd-lone': ballStatus.sndballMove, 'fixball-Trd-left': ballStatus.trdballLeft}"
                v-if="!ballStatus.trdballMove">{{trdballText}}</view>
        </view>
    </view>
</template>

<script>
    import myChart from './myChart.vue'

    export default {
        name: 'refinedChart',
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
                    sndballMove: false,		// 第二个球是否滑动
                    sndballLeft: false,		// 第二个球是否位于左端
                    trdballActive: false,	// 第三个球是否激活（显示为蓝色）
                    trdballMove: false,		// 第三个球是否滑动
                    trdballLeft: false,		// 第三个球是否位于左端
                }
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
            // 设置日期球的状态 scrollLeft为滚动距最左边的距离，windowWidth是系统信息屏幕宽度, ballObj为包含一系列bool值的object
            setDateballStatus (scrollLeft, windowWidth, ballObj) {
                //开始滚动 scrollLeft为0
                if (scrollLeft < 45) {
                    // 刚开始滚动 还不足以让第二个球开始动
                    ballObj.fstballActive = true
                    ballObj.sndballActive = false
                    ballObj.trdballActive = false
                    ballObj.sndballMove = false
                    ballObj.sndballLeft = false
                    ballObj.trdballMove = false
                    ballObj.trdballLeft = false
                    // } else if (scrollLeft < windowWidth * 0.966) {  // 290 360*0.805
                } else if (scrollLeft < windowWidth * 0.80555) {
                    // 第二个球开始动
                    ballObj.fstballActive = true
                    ballObj.sndballActive = false
                    ballObj.trdballActive = false
                    ballObj.sndballMove = true
                    ballObj.sndballLeft = false
                    ballObj.trdballMove = false
                    ballObj.trdballLeft = false
                    // } else if (scrollLeft < windowWidth * 1.066) {  // 320 360*0.888
                } else if (scrollLeft < windowWidth * 0.88888) {
                    // 第二个球停在最左边 第三个球还没开始动
                    ballObj.fstballActive = false
                    ballObj.sndballActive = true
                    ballObj.trdballActive = false
                    ballObj.sndballMove = false
                    ballObj.sndballLeft = true
                    ballObj.trdballMove = false
                    ballObj.trdballLeft = false
                    // } else if (scrollLeft < windowWidth * 1.166) {  // 350 360*0.972
                } else if (scrollLeft < windowWidth * 0.97222) {
                    // 第三个球开始动
                    ballObj.fstballActive = false
                    ballObj.sndballActive = true
                    ballObj.trdballActive = false
                    ballObj.sndballMove = false
                    ballObj.sndballLeft = true
                    ballObj.trdballMove = true
                    ballObj.trdballLeft = false
                    // } else if (scrollLeft < windowWidth * 1.9) {    // 570 360*1.583
                } else if (scrollLeft < windowWidth * 1.58333) {
                    // 第三个球动
                    ballObj.fstballActive = false
                    ballObj.sndballActive = true
                    ballObj.trdballActive = false
                    ballObj.sndballMove = false
                    ballObj.sndballLeft = true
                    ballObj.trdballMove = true
                    ballObj.trdballLeft = false
                } else {
                    // 第三个球停在最左边
                    ballObj.fstballActive = false
                    ballObj.sndballActive = false
                    ballObj.trdballActive = true
                    ballObj.sndballMove = false
                    ballObj.sndballLeft = true
                    ballObj.trdballMove = false
                    ballObj.trdballLeft = true
                }
            },
            // 图标滚动事件
            handleScroll(e) {
                // console.log(e.detail.scrollLeft)
                // utils.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth - 60, this.ballStatus)
                this.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth, this.ballStatus)
            },
        },
        mounted() {
            // 加载时根据当前日期设置日期球文字
            this.setDateballText()
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

    /* 日期球的外观样式 */
    .dateball {
        display: flex;
        width: 62px;
        height: 62px;
        background-color: rgba(148, 148, 148, 0.8);
        border-radius: 62px;
        align-items: center;
        justify-content: center;
    }

    /* 日期球激活状态时现时为蓝色 */
    .dateball-active {
        background-color: rgba(0, 148, 255, 0.8);
    }

    /* 第二个球滑动时的定位 调整slideball的top和fixball的bottom 让两种球平行 */
    .slideball-Snd {
        position: relative;
        top: 10px;
        left: 96%;
    }

    /* 第三个球滑动时的定位 */
    .slideball-Trd {
        position: relative;
        top: 10px;
        left: 188%;
    }

    /* 第一个球固定时的定位 */
    .fixball-Fst {
        position: relative;
        bottom: 11px;
        left: 0%;
    }

    /* 第二个球固定时的定位 */
    .fixball-Snd {
        position: relative;
        bottom: 11px;
        left: 74%;
    }

    /* 第二个球固定在左端时的定位 */
    .fixball-Snd-left {
        left: 0%;
    }

    /* 第三个球固定时的定位 */
    .fixball-Trd {
        position: relative;
        bottom: 11px;
        left: 74%;
    }

    /* 当第二个球滑动时，第三个球需要调整定位 */
    .fixball-Trd-lone {
        left: 82.7%;
    }

    /* 第三个球固定在左端时的定位 */
    .fixball-Trd-left {
        left: 0%;
    }

    /* 滑动的小球的容器 flex属性能让小球水平排列，height为必须 */
    .balltrack {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 80px;
    }

    /* 固定的小球的容器 */
    .balltrack-fix {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        position: absolute;
        bottom: 0px;
    }

    /* 图表下方显示信息的面板 */
    .infopanel {
        position: absolute;
        top: 260px;
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
