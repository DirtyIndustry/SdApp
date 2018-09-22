<template>
	<!-- <view style="background-image: url(../../static/Images/back_images.jpg); background-repeat: no-repeat; background-size: contain; background-attachment: scroll;"> -->
	<view>
		<myPicker ref="citypicker" :items="cityArray" @itemSelected="mypickerSelect"></myPicker>
		<view class="page-body">
			<image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;" />
			<!-- 地区选择模块 -->
			<!-- #ifdef MP-WEIXIN -->
			<view style="position: fixed; width: 100%; left: 0; opacity: 0.9; z-index: 9;">
				<!-- 布局右侧宽度固定，左侧自适应 -->
				<view class="container section-body">
					<view class="main text-large text-bold text-blue">
						{{cityName}}地区预报
					</view>
					<view class="sidebar">
						<!-- 切换城市按钮 -->
						<picker class="city-picker" @change="bindPickerChange" :value="cityIndex" :range="cityArray">
							<view class="sidebar-cell">切换城市</view>
						</picker>
					</view>
				</view>
			</view>
			<!-- 占位空白模块 -->
			<view style="height: 100upx;" />
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="page-section header text-large text-bold text-blue">{{cityName}}地区预报</view>
			<view style="height: 20upx;" />
			<!-- #endif -->
			<!-- 潮汐预报模块 -->
			<view class="page-section section-body">
				<tableTitle title="潮汐预报" icon="../../static/Images/top_left_img_new.png" />
				<!-- 第一个图表 -->
				<view class="chart-container chart-container-one">
					<text class="chart-title text" v-if="tideData.chartTideOneTitle !== ''">{{tideData.chartTideOneTitle}}</text>
					<scroll-view scroll-x="true" @scroll="scrollTideOne">
						<view class="chart-tide">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitTideOne" canvasId="canvasIdTideOne" ref="echartsRefTideOne"></mpvue-echarts>
						</view>
					</scroll-view>
					<!-- 左右指示箭头 -->
					<view v-if="tideOneChevronRightShow" class="chevron chevron-right fa fa-chevron-right" />
					<view v-if="tideOneChevronLeftShow" class="chevron chevron-left fa fa-chevron-left" />
				</view>
				<!-- 第二个图表 只在青岛地区显示 -->
				<!-- <view class="section-body" v-show="tideData.chartTideTwoShow"> -->
				<view class="chart-container" :class="{hide: !tideData.chartTideTwoShow}">
					<text class="chart-title text">{{tideData.chartTideTwoTitle}}</text>
					<scroll-view scroll-x="true" @scroll="scrollTideTwo">
						<view class="chart-tide">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitTideTwo" canvasId="canvasIdTideTwo" ref="echartsRefTideTwo"></mpvue-echarts>
						</view>
					</scroll-view>
					<!-- 左右指示箭头 -->
					<view v-if="tideTwoChevronRightShow" class="chevron chevron-right fa fa-chevron-right" />
					<view v-if="tideTwoChevronLeftShow" class="chevron chevron-left fa fa-chevron-left" />
				</view>
			</view>
			<view class="separator" />
			<!-- 近海预报 -->
			<view class="page-section">
				<tableTitle :title="inshoreData.location" :date="inshoreData.timeupper" icon="../../static/Images/top_left_img_newS.png" />
				<view class="section-body">
					<inshoreTableNew :inshoreData="inshoreData" />
				</view>
			</view>
			<view class="separator" />
			<!-- 浴场预报 -->
			<view class="page-section" v-if="bathsData.showBaths">
				<tableTitle title="浴场预报" :date="bathsData.time" icon="../../static/Images/top_left_img_newS.png" />
				<view class="section-body">
					<bathsTable :bathsData="bathsData.data" />
				</view>
			</view>
			<view class="separator" />
			<!-- 精细化预报 -->
			<!-- <view class="page-section section-body" v-show="refinedData.show"> -->
			<view class="page-section section-body" :class="{hide: !refinedData.show}">
				<view class="refinedChart-body">
					<!-- 地名 -->
					<view v-if="refinedData.dataOne.length > 0" class="chart-title text">{{refinedData.dataOne[0].loc}}</view>
					<scroll-view class="speed-up" scroll-x="true" @scroll="handleScrollRefinedOne">
						<view class="chart-refined speed-up">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitRefinedOne" canvasId="canvasIdRefinedOne" ref="echartsRefRefinedOne"></mpvue-echarts>
						</view>
						<!-- 信息面板 -->
						<view class="infopanel">
							<view class="infopanel-day" v-for="(item, index) in refinedData.dataOne" :key="index">
								<view class="infocolumn infocolumn-left text-mini">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
								<view class="infocolumn text-mini">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
							</view>
						</view>
					</scroll-view>
					<!-- 日期球 -->
					<view class="balltrack-fix speed-up">
						<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedOne.fstballActive}">{{fstballText}}</view>
						<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedOne.sndballActive}"
						    :style="{left: ballStatusRefinedOne.sndballLeft + 'px'}">{{sndballText}}</view>
						<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedOne.trdballActive}"
						    :style="{left: ballStatusRefinedOne.trdballLeft + 'px'}">{{trdballText}}</view>
					</view>
					<!-- 左右指示箭头 -->
					<view v-if="ballStatusRefinedOne.chevronRightShow" class="chevron-refined chevron-right fa fa-chevron-right" />
					<view v-if="ballStatusRefinedOne.chevronLeftShow" class="chevron-refined chevron-left fa fa-chevron-left" />
				</view>
				<!-- 两个图表之间的空白 -->
				<view style="height: 60upx" v-if="refinedData.showTwo" />
				<!-- <view v-if="refinedData.showTwo"> -->
				<view :class="{hide: !refinedData.showTwo}">
					<view class="refinedChart-body">
						<!-- 地名 -->
						<view v-if="refinedData.dataTwo.length > 0" class="chart-title text">{{refinedData.dataTwo[0].loc}}</view>
						<scroll-view class="speed-up" scroll-x="true" @scroll="handleScrollRefinedTwo">
							<view class="chart-refined speed-up">
								<mpvue-echarts :echarts="echarts" :onInit="handleInitRefinedTwo" canvasId="canvasIdRefinedTwo" ref="echartsRefRefinedTwo"></mpvue-echarts>
							</view>
							<!-- 信息面板 -->
							<view class="infopanel">
								<view class="infopanel-day" v-for="(item, index) in refinedData.dataTwo" :key="index">
									<view class="infocolumn infocolumn-left text-mini">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
									<view class="infocolumn text-mini">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
								</view>
							</view>
						</scroll-view>
						<!-- 日期球 -->
						<view class="balltrack-fix speed-up">
							<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedTwo.fstballActive}">{{fstballText}}</view>
							<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedTwo.sndballActive}"
							    :style="{left: ballStatusRefinedTwo.sndballLeft + 'px'}">{{sndballText}}</view>
							<view class="dateball speed-up text-mini" :class="{'dateball-active': ballStatusRefinedTwo.trdballActive}"
							    :style="{left: ballStatusRefinedTwo.trdballLeft + 'px'}">{{trdballText}}</view>
						</view>
						<!-- 左右指示箭头 -->
						<view v-if="ballStatusRefinedTwo.chevronRightShow" class="chevron-refined chevron-right fa fa-chevron-right" />
						<view v-if="ballStatusRefinedTwo.chevronLeftShow" class="chevron-refined chevron-left fa fa-chevron-left" />
					</view>
				</view>
			</view>
			<view class="separator" />
			<!-- 威海专项预报 -->
			<!-- <view class="page-section" v-show="weihaiData.show"> -->
			<view class="page-section" :class="{hide: !weihaiData.show}">
				<!-- 第一部分 -->
				<!-- <view v-show="weihaiData.first.show"> -->
				<view :class="{hide: !weihaiData.first.show}">
					<tableTitle :title="weihaiData.first.REPORTAREA" icon="../../static/Images/top_left_img_newS.png" />
					<!-- 图表部分 -->
					<view class="section-body">
						<view class="chart-weihai">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiOne" canvasId="canvasIdWeihaiOne" ref="echartsRefWeihaiOne"></mpvue-echarts>
						</view>
						<view class="weihai-infopanel">
							<view class="weihai-infocolumn-side" />
							<view class="weihai-infocolumn">
								<view class="text">水温:{{weihaiData.first.WATERTEMP}}℃</view>
							</view>
							<view class="weihai-infocolumn">
								<view class="text">浪高:{{weihaiData.first.WAVEHEIGHT}}米</view>
							</view>
							<view class="weihai-infocolumn-side" />
						</view>
					</view>
				</view>
				<view class="separator" />
				<!-- 第二部分 -->
				<!-- <view v-show="weihaiData.second.show"> -->
				<view :class="{hide: !weihaiData.second.show}">
					<tableTitle :title="weihaiData.second.REPORTAREA" icon="../../static/Images/top_left_img_newS.png" />
					<!-- 图表部分 -->
					<view class="section-body">
						<view class="chart-weihai">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiTwo" canvasId="canvasIdWeihaiTwo" ref="echartsRefWeihaiTwo"></mpvue-echarts>
						</view>
						<view class="weihai-infopanel">
							<view class="weihai-infocolumn-side" />
							<view class="weihai-infocolumn">
								<view class="text">水温:{{weihaiData.second.WATERTEMP}}℃</view>
							</view>
							<view class="weihai-infocolumn">
								<view class="text">浪高:{{weihaiData.second.WAVEHEIGHT}}米</view>
							</view>
							<view class="weihai-infocolumn-side" />
						</view>
					</view>
				</view>
				<view class="separator" />
				<!-- 第三部分 -->
				<!-- <view v-show="weihaiData.third.show"> -->
				<view :class="{hide: !weihaiData.third.show}">
					<tableTitle :title="weihaiData.third.REPORTAREA" icon="../../static/Images/top_left_img_newS.png" />
					<!-- 图表部分 -->
					<view class="section-body">
						<view class="chart-weihai">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiThree" canvasId="canvasIdWeihaiThree" ref="echartsRefWeihaiThree"></mpvue-echarts>
						</view>
						<view class="weihai-infopanel">
							<view class="weihai-infocolumn-side" />
							<view class="weihai-infocolumn">
								<view class="text">水温:{{weihaiData.third.WATERTEMP}}℃</view>
							</view>
							<view class="weihai-infocolumn">
								<view class="text">浪高:{{weihaiData.third.WAVEHEIGHT}}米</view>
							</view>
							<view class="weihai-infocolumn-side" />
						</view>
					</view>
				</view>
				<view class="separator" />
				<!-- 第四部分 -->
				<!-- <view v-show="weihaiData.fourth.show"> -->
				<view :class="{hide: !weihaiData.fourth.show}">
					<tableTitle :title="weihaiData.fourth.REPORTAREA" icon="../../static/Images/top_left_img_newS.png" />
					<!-- 图表部分 -->
					<view class="section-body">
						<view class="chart-weihai">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitWeihaiFour" canvasId="canvasIdWeihaiFour" ref="echartsRefWeihaiFour"></mpvue-echarts>
						</view>
						<view class="weihai-infopanel">
							<view class="weihai-infocolumn-side" />
							<view class="weihai-infocolumn">
								<view class="text">水温:{{weihaiData.fourth.WATERTEMP}}℃</view>
							</view>
							<view class="weihai-infocolumn">
								<view class="text">浪高:{{weihaiData.fourth.WAVEHEIGHT}}米</view>
							</view>
							<view class="weihai-infocolumn-side" />
						</view>
					</view>
				</view>
			</view>
			<view class="separator" />
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import bathsTable from '../../components/bathsTable.vue'
	import myPicker from '../../components/myPicker.vue'
	import tableTitle from '../../components/tableTitle.vue'
	import inshoreTableNew from '../../components/inshoreTableNew.vue'
	import * as echarts from '../../components/echarts/echarts.common.min.js'
	import mpvueEcharts from '../../components/mpvue-echarts/src/echarts.vue'

	let chartTideOne = undefined
	let chartTideTwo = undefined
	let chartRefinedOne = undefined
	let chartRefinedTwo = undefined
	let chartWeihaiOne = undefined
	let chartWeihaiTwo = undefined
	let chartWeihaiThree = undefined
	let chartWeihaiFour = undefined

	export default {
		components: {
			bathsTable,
			myPicker,
			tableTitle,
			inshoreTableNew,
			mpvueEcharts
		},
		data() {
			return {
				// 完成的request计数
				completedRequestCount: 0,
				// 日期球的日期文字
				fstballText: '1st',
				sndballText: '2nd',
				trdballText: '3rd',
				// 日期球控制参数
				ballStatusRefinedOne: {
					fstballActive: true,	// 第一个球是否激活（显示为蓝色）
					sndballActive: false,	// 第二个球是否激活（显示为蓝色）
					trdballActive: false,	// 第三个球是否激活（显示为蓝色）
					sndballLeft: 0,		// 第二个球是否位于左端
					trdballLeft: 0,		// 第三个球是否位于左端
					// 左右三角箭头是否显示
					chevronRightShow: true,
					chevronLeftShow: false
				},
				// 日期球控制参数
				ballStatusRefinedTwo: {
					fstballActive: true,	// 第一个球是否激活（显示为蓝色）
					sndballActive: false,	// 第二个球是否激活（显示为蓝色）
					trdballActive: false,	// 第三个球是否激活（显示为蓝色）
					sndballLeft: 0,		// 第二个球是否位于左端
					trdballLeft: 0,		// 第三个球是否位于左端
					// 左右三角箭头是否显示
					chevronRightShow: true,
					chevronLeftShow: false
                },
                // 精细化滑动小球
                trackwidth: 0,          // 滑轨的长度
                scrollwidth: 0,         // 能滚动的最大长度
                sndRightPos: 0,         // 第二个小球的右边位置
                trdRightPos: 0,         // 第三个小球的右边位置
                stageOne: 0,            // 第二个小球到达左边
				stageTwo: 0,            // 第三个小球到达左边
				// 潮汐预报左右三角箭头
				tideOneChevronRightShow: true,
				tideOneChevronLeftShow: false,
				tideTwoChevronRightShow: true,
				tideTwoChevronLeftShow: false,
				echarts
			}
		},
		computed: {
			// 系统信息
			systemInfo() { return this.$store.state.Infos.systeminfo },
			// 城市选择列表
			cityArray() { return this.$store.state.Infos.cityarray },
			// 城市选择列表 所选index
			cityIndex: {
				get() { return this.$store.state.Infos.cityindex },
				set(value) { this.$store.dispatch('setCityIndex', value) }
			},
			// 当前城市名称
			cityName: {
				get() { return this.$store.state.Datas.cityname },
				set(value) { this.$store.dispatch('setCityName', value) }
			},
			// 实时天气
			weatherData: {
				get() { return this.$store.state.Datas.weatherdata },
				set(value) { this.$store.dispatch('setWeatherData', value) }
			},
			// 潮汐预报
			tideData: {
				get() { return this.$store.state.Datas.tidedata },
				set(value) { this.$store.dispatch('setTideData', value) }
			},
			// 近海预报
			inshoreData: {
				get() { return this.$store.state.Datas.inshoredata },
				set(value) { this.$store.dispatch('setInshoreData', value) }
			},
			// 浴场预报
			bathsData: {
				get() { return this.$store.state.Datas.bathsdata },
				set(value) { this.$store.dispatch('setBathsData', value) }
			},
			// 精细化预报
			refinedData: {
				get() { return this.$store.state.Datas.refineddata },
				set(value) { this.$store.dispatch('setRefinedData', value) }
			},
			// 五日天气
			fivedayData: {
				get() { return this.$store.state.Datas.fivedaydata },
				set(value) { this.$store.dispatch('setFivedayData', value) }
			},
			// 威海专项
			weihaiData: {
				get() { return this.$store.state.Datas.weihaidata },
				set(value) { this.$store.dispatch('setWeihaiData', value) }
			},
			// 潮汐预报chart option
			tideDataOptionOne () { return this.$store.state.Datas.tidedata.optionTideOne },
			tideDataOptionTwo () { return this.$store.state.Datas.tidedata.optionTideTwo },
			// 精细化预报chart option
			refinedDataOptionOne () { return this.$store.state.Datas.refineddata.optionOne },
			refinedDataOptionTwo () { return this.$store.state.Datas.refineddata.optionTwo },
			// 威海专项chart option
			weihaiDataOptionOne () { return this.$store.state.Datas.weihaidata.first.option },
			weihaiDataOptionTwo () { return this.$store.state.Datas.weihaidata.second.option },
			weihaiDataOptionThree () { return this.$store.state.Datas.weihaidata.third.option },
			weihaiDataOptionFour () { return this.$store.state.Datas.weihaidata.fourth.option }
		},
		methods: {
			// 地区选择菜单操作
			bindPickerChange: function (e) {
				// 弹出loading toast
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// 写入Vuex和缓存
				this.cityIndex = e.target.value
				utils.storeToLocal('cityindex', e.target.value)
				this.switchCityByIndex(e.target.value)
			},
			// 根据index切换城市 允许自动定位 不写入缓存
			switchCityByIndex(index) {
				// 切换城市
				utils.switchCity(this.cityArray[index], this.switchCityByName)
			},
			// 根据name切换城市 写入缓存
			switchCityByName(city) {
				// 写入Vuex和缓存
				this.cityName = city
				utils.storeToLocal('cityname', city)
				// 根据城市向服务器申请数据
				this.requestData(city)
			},
			// 读取服务器数据
			requestData(city) {
				// 任务计数器归零
				this.completedRequestCount = 0
				this.setPageLayout(city)
				this.loadShandongData(city)
			},
			// 读取山东预报数据 包括天气 潮汐 近海 浴场 精细化 五日 威海专项
			loadShandongData (cityname) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetShandongData',
					data: {name: 'admin', city: cityname},
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 山东预报数据')
						// 判断返回数据有效性
						if (!res.data.d | res.data.d === '无权访问该接口' | res.data.d === '无该地区数据') { // 返回的值为空
							console.log('[服务器]: 返回 山东预报数据 返回值为空')
							return false
						}
						res = JSON.parse(res.data.d)
						// 天气预报
						// 写入Vuex
						that.weatherData = res.weatherData
						// 天气图标 pm2.5字体颜色
						that.weatherData.weatherIcon = utils.setWeatherIcon(res.weatherData.weather)
						that.weatherData.pm25Style = utils.setAirconClass(res.weatherData.airconDesc)

						// 潮汐预报
						if (res.astroDatas.length > 1) {	// 如果是青岛
							that.tideData.chartTideTwoShow = true
							that.tideData.chartTideOneTitle = '第一海水浴场'
							that.tideData.chartTideTwoTitle = '金沙滩'
							for (let i = 0; i < res.astroDatas.length; i++) {
								let tide = utils.buildTidedata(res.astroDatas[i].tidedata)
								let mark = utils.buildMarkdata(res.astroDatas[i].markdata)
								if (res.astroDatas[i].location === '第一海水浴场') {
									that.tideData.optionTideOne = utils.getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
								} else {
									let optiontwo = utils.getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
									optiontwo.series[0].lineStyle.color = "#0092d4"
									that.tideData.optionTideTwo = optiontwo
								}
							}
						} else {	// 如果是青岛以外的城市
							that.tideData.chartTideTwoShow = false
							that.tideData.chartTideOneTitle = ''
							that.tideData.chartTideTwoTitle = ''
							for (let i = 0; i < res.astroDatas.length; i++) {
								let tide = utils.buildTidedata(res.astroDatas[i].tidedata)
								let mark = utils.buildMarkdata(res.astroDatas[i].markdata)
								that.tideData.optionTideOne = utils.getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
							}
						} // if-else 是否是青岛

						// 近海预报
						// 写入Vuex
						that.inshoreData = res.inshoreData

						// 浴场预报
						// 写入Vuex
						that.bathsData = res.bathsData

						// 精细化预报
						// 判断城市
						if (cityname === '滨州') {
							that.refinedData.show = false
						} else {
							that.refinedData.show = true
						}
						if (res.refinedDatas.length > 1) {	// 如果是青岛
							that.refinedData.showTwo = true
							for (let i = 0; i < res.refinedDatas.length; i++) {
								let tide = utils.buildTidedata(res.refinedDatas[i].tideinfo.tidedata)
								let mark = utils.buildMarkdata(res.refinedDatas[i].tideinfo.markdata)
								let option = utils.getAstroOptionNew(tide, mark, res.refinedDatas[i].tideinfo.max, res.refinedDatas[i].tideinfo.min)
								// 曲线颜色蓝色
								option.series[0].lineStyle.color = '#0092d4'
								// label颜色绿色
								option.series[0].label.color = '#1c8d3b'
								// 时间颜色红色
								option.series[0].markLine.label.textStyle.color = 'red'
								// 不显示日期
								option.xAxis.axisLabel.show = false
								// 将地名字母代号转为中文地名
								res.refinedDatas[i].extrainfo[0].loc = utils.getLocName(res.refinedDatas[i].extrainfo[0].loc)
								if (res.refinedDatas[i].tideinfo.location === 'DJKP') {
									that.refinedData.optionOne = option
									that.refinedData.dataOne = res.refinedDatas[i].extrainfo
								} else {
									that.refinedData.optionTwo = option
									that.refinedData.dataTwo = res.refinedDatas[i].extrainfo
								}
							}
						} else {	// 如果是青岛以外的城市
							that.refinedData.showTwo = false
							for (let i = 0; i < res.refinedDatas.length; i++) {
								let tide = utils.buildTidedata(res.refinedDatas[i].tideinfo.tidedata)
								let mark = utils.buildMarkdata(res.refinedDatas[i].tideinfo.markdata)
								let option = utils.getAstroOptionNew(tide, mark, res.refinedDatas[i].tideinfo.max, res.refinedDatas[i].tideinfo.min)
								// 曲线颜色蓝色
								option.series[0].lineStyle.color = '#0092d4'
								// label颜色绿色
								option.series[0].label.color = '#1c8d3b'
								// 时间颜色红色
								option.series[0].markLine.label.textStyle.color = 'red'
								// 不显示日期
								option.xAxis.axisLabel.show = false
								that.refinedData.optionOne = option
								// 将地名字母代号转为中文地名
								res.refinedDatas[i].extrainfo[0].loc = utils.getLocName(res.refinedDatas[i].extrainfo[0].loc)
								that.refinedData.dataOne = res.refinedDatas[i].extrainfo
							}
						}

						// 五日天气预报
						let fivedayData = {
							fivedayWeather: res.fivedayData.fivedayWeathers,
							optionFiveday: utils.setFivedayChartOptionNew(res.fivedayData.higharr, res.fivedayData.lowarr, res.fivedayData.max, res.fivedayData.min)
						}
						for (let i = 0; i < fivedayData.fivedayWeather.length; i++) {
							fivedayData.fivedayWeather[i].weatherIcon = utils.setWeatherIcon(fivedayData.fivedayWeather[i].weather)
						}
						// 写入Vuex
						that.fivedayData = fivedayData

						// 威海专项
						// 判断城市
						if (res.weihaiDatas.length > 0) {	// 如果是威海
							that.weihaiData.show = true
							that.weihaiData.first.show = true
							that.weihaiData.second.show = true
							that.weihaiData.third.show = true
							that.weihaiData.fourth.show = true
							for (let i = 0; i < res.weihaiDatas.length; i++) {
								let data = {
									show: res.weihaiDatas[i].show,
									REPORTAREA: res.weihaiDatas[i].REPORTAREA,
									FORECASTDATE: res.weihaiDatas[i].FORECASTDATE,
									WAVEHEIGHT: res.weihaiDatas[i].WAVEHEIGHT,
									WATERTEMP: res.weihaiDatas[i].WATERTEMP,
								}
								let tide = utils.buildTidedata(res.weihaiDatas[i].tideinfo.tidedata)
								let mark = utils.buildMarkdata(res.weihaiDatas[i].tideinfo.markdata)
								data.option = utils.getAstroOptionNew(tide, mark, res.weihaiDatas[i].tideinfo.max, res.weihaiDatas[i].tideinfo.min)
								data.option.grid = {
									top: '8%',
									left: '-3%',
									right: '5%',
									bottom: '20%',
									containLabel: true
								}
								switch (res.weihaiDatas[i].REPORTAREA) {
									case '成山头':
										that.weihaiData.first = data
										break
									case '乳山':
										that.weihaiData.second = data
										break
									case '石岛':
										that.weihaiData.third = data
										break
									case '文登':
										that.weihaiData.fourth = data
										break
									default:
										break
								}
							} // end-for res.weihaiDatas
						} else {	// 如果是威海以外的城市
							that.weihaiData.show = false
						}
						// 写入本地缓存
						utils.storeToLocal('weatherdata', JSON.stringify(res.weatherData))
						utils.storeToLocal('tidedata', JSON.stringify(that.tideData))
						utils.storeToLocal('inshoredata', JSON.stringify(res.inshoreData))
						utils.storeToLocal('bathsdata', JSON.stringify(that.bathsData))
						utils.storeToLocal('refineddata', JSON.stringify(that.refinedData))
						utils.storeToLocal('fivedaydata', JSON.stringify(fivedayData))
						utils.storeToLocal('weihaidata', JSON.stringify(that.weihaiData))

					}, // success-request
					fail: function (res) {
						console.log('[服务器]: 请求 山东预报数据 失败')
						that.completedRequestCount++
					},
					complete: function (res) {
						that.completedRequestCount++
					}
				})
			},
			// 根据城市设置各面板显隐
			setPageLayout (cityname) {
				switch (cityname) {
					case '青岛':
						// 显示第二个潮汐曲线
						this.tideData.chartTideTwoShow = true
						// 潮汐预报地区名称
						this.tideData.chartTideOneTitle = '第一海水浴场'
						this.tideData.chartTideTwoTitle = '金沙滩'
						// 显示精细化
						this.refinedData.show = true
						// 显示第二个精细化曲线
						this.refinedData.showTwo = true
						// 7到9月份显示浴场预报
						this.bathsData.showBaths = new Date().getMonth() > 5 & new Date().getMonth() < 9 ? true : false
						// 不显示威海专项预报
						this.weihaiData.show = false
						break
					case '威海':
						// 不显示第二个潮汐曲线
						this.tideData.chartTideTwoShow = false
						// 潮汐预报不显示地区名称
						this.tideData.chartTideOneTitle = ''
						this.tideData.chartTideTwoTitle = ''
						// 显示精细化
						this.refinedData.show = true
						// 不显示第二个精细化
						this.refinedData.showTwo = false
						// 不显示浴场预报
						this.bathsData.showBaths = false
						// 显示威海专项预报
						this.weihaiData.show = true
						this.weihaiData.first.show = true
						this.weihaiData.second.show = true
						this.weihaiData.third.show = true
						this.weihaiData.fourth.show = true
						break
					case '滨州':
						// 不显示第二个潮汐曲线
						this.tideData.chartTideTwoShow = false
						// 潮汐预报不显示地区名称
						this.tideData.chartTideOneTitle = ''
						this.tideData.chartTideTwoTitle = ''
						// 不显示精细化
						this.refinedData.show = false
						// 不显示第二个精细化
						this.refinedData.showTwo = false
						// 不显示浴场预报
						this.bathsData.showBaths = false
						// 显示威海专项预报
						this.weihaiData.show = false
						break
					default:
						// 不显示第二个潮汐曲线
						this.tideData.chartTideTwoShow = false
						// 潮汐预报不显示地区名称
						this.tideData.chartTideOneTitle = ''
						this.tideData.chartTideTwoTitle = ''
						// 显示精细化
						this.refinedData.show = true
						// 不显示第二个精细化
						this.refinedData.showTwo = false
						// 不显示浴场预报
						this.bathsData.showBaths = false
						// 显示威海专项预报
						this.weihaiData.show = false
						break
				}
			},
			// 初始化潮汐预报图表一
			handleInitTideOne(canvas, width, height) {
				chartTideOne = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartTideOne)
				chartTideOne.setOption(this.tideData.optionTideOne, true)
				return chartTideOne
			},
			// 初始化潮汐预报图表二
			handleInitTideTwo(canvas, width, height) {
				chartTideTwo = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartTideTwo)
				chartTideTwo.setOption(this.tideData.optionTideTwo, true)
				return chartTideTwo
			},
			// 初始化精细化预报图表一
			handleInitRefinedOne(canvas, width, height) {
				chartRefinedOne = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartRefinedOne)
				chartRefinedOne.setOption(this.refinedData.optionOne, true)
				return chartRefinedOne
			},
			// 初始化精细化预报图表二
			handleInitRefinedTwo(canvas, width, height) {
				chartRefinedTwo = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartRefinedTwo)
				chartRefinedTwo.setOption(this.refinedData.optionTwo, true)
				return chartRefinedTwo
			},
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
			},
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
                this.ballStatusRefinedOne.sndballLeft = this.trackwidth - 57
                this.ballStatusRefinedOne.trdballLeft = this.trackwidth - 28
                this.ballStatusRefinedTwo.sndballLeft = this.trackwidth - 57
                this.ballStatusRefinedTwo.trdballLeft = this.trackwidth - 28
            },
			// 设置日期球的状态 scrollLeft为滚动距最左边的距离 ballObj为包含一系列bool值的object
			setDateballStatus(scrollLeft, ballObj) {
				// 第二个球
                if (scrollLeft < 57) {
                    ballObj.sndballLeft = this.sndRightPos
                } else if (scrollLeft > this.stageOne) {
                    ballObj.sndballLeft = 29
                } else {
                    ballObj.sndballLeft = this.trackwidth - scrollLeft
                }
                // 第三个球
                if (scrollLeft < this.trackwidth) {
                    ballObj.trdballLeft = this.trdRightPos
                } else if (scrollLeft > this.stageTwo) {
                    ballObj.trdballLeft = 58
                } else {
                    ballObj.trdballLeft = this.scrollwidth - scrollLeft
                }
                // 颜色 箭头
                if (scrollLeft < this.stageOne) {
					// 颜色
					ballObj.fstballActive = true
                    ballObj.sndballActive = false
					ballObj.trdballActive = false
					// 箭头
					ballObj.chevronLeftShow = false
                } else if (scrollLeft < this.stageTwo) {
					// 颜色
					ballObj.fstballActive = false
                    ballObj.sndballActive = true
					ballObj.trdballActive = false
					// 箭头
					ballObj.chevronLeftShow = true
					ballObj.chevronRightShow = true
                } else {
					// 颜色
                    ballObj.fstballActive = false
                    ballObj.sndballActive = false
					ballObj.trdballActive = true
					// 箭头
					ballObj.chevronRightShow = false
				}
			},
			// 潮汐图表一滚动事件
			scrollTideOne (e) {
				if (e.detail.scrollLeft < 80) {
					this.tideOneChevronLeftShow = false
				} else if (e.detail.scrollLeft < 540) {
					this.tideOneChevronLeftShow = true
					this.tideOneChevronRightShow = true
				} else {
					this.tideOneChevronRightShow = false
				}
			},
			// 潮汐图表二滚动事件
			scrollTideTwo (e) {
				if (e.detail.scrollLeft < 80) {
					this.tideTwoChevronLeftShow = false
				} else if (e.detail.scrollLeft < 540) {
					this.tideTwoChevronLeftShow = true
					this.tideTwoChevronRightShow = true
				} else {
					this.tideTwoChevronRightShow = false
				}
			},
			// 精细化图表一滚动事件
			handleScrollRefinedOne(e) {
				// utils.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth - 60, this.ballStatus)
				this.setDateballStatus(e.detail.scrollLeft, this.ballStatusRefinedOne)
			},
			// 精细化图表二滚动事件
			handleScrollRefinedTwo(e) {
				// utils.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth - 60, this.ballStatus)
				this.setDateballStatus(e.detail.scrollLeft, this.ballStatusRefinedTwo)
			},
			// 自定义picker选择
			mypickerSelect(index, item) {
				// 弹出loading toast
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// 写入Vuex和缓存
				this.cityIndex = index
				utils.storeToLocal('cityindex', index)
				this.switchCityByIndex(index)
			}
		}, // end-methods
		watch: {
			// 完成的request
			completedRequestCount: {
				handler(newVal, oldVal) {
					if (newVal === 1) {
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				}
			},
			// 潮汐预报第一个chart更新
			tideDataOptionOne: {
				handler (newVal, oldVal) {
					if (chartTideOne !== undefined) {
						if (newVal) {
							chartTideOne.setOption(newVal, true)
							// this.$refs.echartsRefTideOne.init()
						}
					}
				}
			},
			// 潮汐预报第二个chart更新
			tideDataOptionTwo: {
				handler (newVal, oldVal) {
					if (chartTideTwo !== undefined) {
						if (newVal) {
							// chartTideTwo.setOption(newVal, true)
							this.$refs.echartsRefTideTwo.init()
						}
					}
				}
			},
			// 精细化预报第一个chart更新
			refinedDataOptionOne: {
				handler (newVal, oldVal) {
					if (chartRefinedOne !== undefined) {
						if (newVal) {
							chartRefinedOne.setOption(newVal, true)
							// this.$refs.echartsRefRefinedOne.init()
						}
					}
				}
			},
			// 精细化预报第二个chart更新
			refinedDataOptionTwo: {
				handler (newVal, oldVal) {
					if (chartRefinedTwo !== undefined) {
						if (newVal) {
							// chartRefinedTwo.setOption(newVal, true)
							this.$refs.echartsRefRefinedTwo.init()
						}
					}
				}
			},
			// 威海专项第一个chart更新
			weihaiDataOptionOne: {
				handler (newVal, oldVal) {
					if (chartWeihaiOne !== undefined) {
						if (newVal) {
							// chartWeihaiOne.setOption(newVal, true)
							this.$refs.echartsRefWeihaiOne.init()
						}
					}
				}
			},
			// 威海专项第二个chart更新
			weihaiDataOptionTwo: {
				handler (newVal, oldVal) {
					if (chartWeihaiTwo !== undefined) {
						if (newVal) {
							// chartWeihaiTwo.setOption(newVal, true)
							this.$refs.echartsRefWeihaiTwo.init()
						}
					}
				}
			},
			// 威海专项第三个chart更新
			weihaiDataOptionThree: {
				handler (newVal, oldVal) {
					if (chartWeihaiThree !== undefined) {
						if (newVal) {
							// chartWeihaiThree.setOption(newVal, true)
							this.$refs.echartsRefWeihaiThree.init()
						}
					}
				}
			},
			// 威海专项第四个chart更新
			weihaiDataOptionFour: {
				handler (newVal, oldVal) {
					if (chartWeihaiFour !== undefined) {
						if (newVal) {
							// chartWeihaiFour.setOption(newVal, true)
							this.$refs.echartsRefWeihaiFour.init()
						}
					}
				}
			}
		},
		onLoad() {
			console.log('cityforecast page onload.')
		},
		onReady() {
			console.log('cityforecast page ready.')
		},
		mounted() {
			console.log('cityforecast vue mounted.')
			// 加载时根据当前日期设置日期球文字
            this.setDateballText()
            this.setDateballLeft()
		},
		onPullDownRefresh() {
			console.log('[界面]: 城市预报 下拉刷新')
			this.requestData(this.cityName)
		},
		onNavigationBarButtonTap() {
			this.$refs.citypicker.switchDialog()
		}
	}
</script>

<style scoped>
	@import "../../common/FontAwesome.css";
	@import "../../common/generic.css";

	.header {
		/* background-color: #fff; */
		height: 80upx;
		display: flex;
		align-items: center;
	}

	/* 微信小程序城市选择器 */
	.container {
		display: flex;
		height: 80upx;
		width: 100%;
	}
	.main {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.sidebar {
		width: 150upx;
		height: 100%;
	}
	.city-picker {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sidebar-cell {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 潮汐曲线容器 */
	.chart-container {
		display: flex;
		flex-direction: column;
	}
	.chart-container-one {
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
		width: 290%;
		height: 250upx;
	}

	/* 整个精细化组件的容器 */
	.refinedChart-body {
		position: relative;
	}

	/* 曲线图的容器 必须设置宽度和高度 */
	.chart-refined {
		width: 290%;
		height: 250upx;
	}

	/* 日期球的外观样式 */
	.dateball {
		display: flex;
		width: 62upx;
		height: 62upx;
        position: absolute;
        bottom: 11upx;
		background-color: rgba(148, 148, 148, 0.8);
		border-radius: 62upx;
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
		flex: 1;
		padding: 10upx;
		white-space: pre-wrap;
	}

	/* 左边的列 文字水平靠右 */
	.infocolumn-left {
		text-align: right;
	}

	/* 威海专项图表 */
	.chart-weihai {
		width: 100%;
		height: 250upx;
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

	/* 潮汐曲线上左右箭头 */
	.chevron {
		position: absolute;
		bottom: 125upx;
		color: #666;
	}
	/* 精细化曲线上左右箭头 */
	.chevron-refined {
		position: absolute;
		bottom: 205upx;
		color: #666;
	}
	.chevron-right {
		right: 2.5%;
	}
	.chevron-left {
		left: 2.5%;
	}
</style>