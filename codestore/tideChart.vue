<template>
	<view>
		<scroll-view scroll-x="true" @scroll="handleScroll">
			<view class="chart">
				<mpvue-echarts :echarts="echarts" :onInit="handleInit" canvasId="canvasid"></mpvue-echarts>
			</view>
			<!-- 滑动的日期球，Move属性决定球是否显示 -->
			<view class="balltrack">
				<view class="dateball slideball-Snd" v-show="ballStatus.sndballMove">{{sndballText}}</view>
				<view class="dateball slideball-Trd" v-show="ballStatus.trdballMove">{{trdballText}}</view>
			</view>
		</scroll-view>
		<!-- 固定在两端的日期球
		Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
		特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
		<view class="balltrack-fix">
			<view class="dateball fixball-Fst" :class="{'dateball-active': ballStatus.fstballActive}">{{fstballText}}</view>
			<view class="dateball fixball-Snd" :class="{'dateball-active': ballStatus.sndballActive, 'fixball-Snd-left': ballStatus.sndballLeft}" v-show="!ballStatus.sndballMove">{{sndballText}}</view>
			<view class="dateball fixball-Trd" :class="{'dateball-active': ballStatus.trdballActive, 'fixball-Trd-lone': ballStatus.sndballMove, 'fixball-Trd-left': ballStatus.trdballLeft}" v-show="!ballStatus.trdballMove">{{trdballText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chart

	export default {
		components: {
			mpvueEcharts
		},
		data () {
			return {
				// 图表数据
				option: {},
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
				echarts
			}
		}, // end-data
		computed: {
			...mapState(['systemInfo'])
		},
		methods: {
			// 初始化图表
			handleInit (canvas, width, height) {
				chart = echarts.init(canvas, null, {
					width: width,
					height: height
				}),
				canvas.setChart(chart)
				chart.setOption(this.option)
				return chart
			},
			// 图标滚动事件
			handleScroll (e) {
				this.setDateballStatus(e.detail.scrollLeft, this.ballStatus)
			},
			// 设置日期球的状态 scrollLeft为滚动到离最左边的距离，ballObj为包含一系列bool值的Object
			setDateballStatus (scrollLeft, ballObj) {
				//开始滚动 scrollLeft为0
				if (scrollLeft < 50) { // 刚开始滚动 还不足以让第二个球开始动
					ballObj.fstballActive = true
					ballObj.sndballActive = false
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = false
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth - 45) { // 第二个球开始动
					ballObj.fstballActive = true
					ballObj.sndballActive = false
					ballObj.trdballActive = false
					ballObj.sndballMove = true
					ballObj.sndballLeft = false
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft <  this.systemInfo.windowWidth) { // 第二个球停在最左边 第三个球还没开始动
					ballObj.fstballActive = false
					ballObj.sndballActive = true
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth + 9) { // 第三个球开始动
					ballObj.fstballActive = false
					ballObj.sndballActive = true
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = true
					ballObj.trdballLeft = false
				} else if (scrollLeft < (this.systemInfo.windowWidth + 270)) { // 第三个球动
					ballObj.fstballActive = false
					ballObj.sndballActive = true
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = true
					ballObj.trdballLeft = false
				} else { // 第三个球停在最左边
					ballObj.fstballActive = false
					ballObj.sndballActive = false
					ballObj.trdballActive = true
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = false
					ballObj.trdballLeft = true
				}
			},
			// 设置曲线图下方日期球的日期
			setDateballText () {
				let now = new Date()
				function formatDate (date) { // 格式化日期为MM-dd
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
			}
		}, // end-methods
		onLoad () {
			this.setDateballText()
		}
	}
</script>

<style>
/* 曲线图的容器 必须设置宽度和高度 */
.chart {
	width: 290%;
	height: 250px;
	border: 1px solid #000000;
}

/* 日期球的外观样式 */
.dateball {
	display: flex;
	width: 62px;
	height: 62px;
	background-color: rgba(148, 148, 148, 0.4);
	border-radius: 62px;
	font-size: 20px;
	align-items: center;
	justify-content: center;
}

/* 日期球激活状态时现时为蓝色 */
.dateball-active {
	background-color: rgba(0, 148, 255, 0.5);
}

/* 第二个球滑动时的定位 */
.slideball-Snd {
	position: relative;
	bottom: 0;
	left: 97%;
}

/* 第三个球滑动时的定位 */
.slideball-Trd {
	position: relative;
	bottom: 0;
	left: 191%;
}

/* 第一个球固定时的定位 */
.fixball-Fst {
	position: relative;
	left: 0%;
}

/* 第二个球固定时的定位 */
.fixball-Snd {
	position: relative;
	left: 76%;
}

/* 第二个球固定在左端时的定位 */
.fixball-Snd-left {
	left: 0%;
}

/* 第三个球固定时的定位 */
.fixball-Trd {
	position: relative;
	left: 76%;
}

/* 当第二个球滑动时，第三个球需要调整定位 */
.fixball-Trd-lone {
	left: 84%;
}

/* 第三个球固定在左端时的定位 */
.fixball-Trd-left {
	left: 0%;
}

/* 滑动的小球的容器 flex属性能让小球水平排列，height与下面的balltrack-fix中的margin-top一致，能够让两个容器重合 */
.balltrack {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	height: 62px;
}

/* 固定的小球的容器 */
.balltrack-fix {
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	margin-top: -60px;
}
</style>
