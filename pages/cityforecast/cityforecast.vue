<template>
	<!-- <view style="background-image: url(../../static/Images/back_images.jpg); background-repeat: no-repeat; background-size: contain; background-attachment: scroll;"> -->
	<view>
		<view class="page-body">
			<image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"
			/>
			<!-- 地区选择模块 -->
			<!-- <view class="page-section"> -->
			<view style="position: fixed; width: 100%; left: 0; opacity: 0.9; z-index: 9;">
				<view class="uni-list">
					<view class="uni-list-cell">
						<!-- 布局右侧宽度固定，左侧自适应 -->
						<view class="container">
							<view class="main">
								{{cityName}}地区预报
							</view>
							<view class="sidebar">
								<!-- 切换城市按钮 -->
								<picker @change="bindPickerChange" :value="cityIndex" :range="cityArray">
									<view class="uni-input">切换城市</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 占位空白模块 -->
			<view style="height: 100px;" />
			<!-- 潮汐预报模块 -->
			<!-- 第一个图表 -->
			<view class="page-section">
				<text>{{tideData.chartTideOneTitle}}</text>
				<scroll-view scroll-x="true">
					<view class="chart-tide">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitTideOne" canvasId="canvasIdTideOne" ref="echartsRefTideOne"></mpvue-echarts>
					</view>
				</scroll-view>
			</view>
			<!-- 第二个图表 只在青岛地区显示 -->
			<view class="page-section" v-show="tideData.chartTideTwoShow">
				<text>{{tideData.chartTideTwoTitle}}</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollTideTwo">
					<view class="chart-tide">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitTideTwo" canvasId="canvasIdTideTwo" ref="echartsRefTideTwo"></mpvue-echarts>
					</view>
				</scroll-view>
			</view>
			<!-- 近海预报 -->
			<view class="page-section">
				<inshoreTable :inshoreData="inshoreData" />
			</view>
			<!-- 浴场预报 -->
			<view class="page-section" v-if="bathsData.showBaths">
				<bathsTable :bathsData="bathsData.data" />
			</view>
			<!-- 精细化预报 -->
			<view class="page-section" v-show="refinedData.show">
				<view>精细化预报</view>
				<view class="refinedChart-body">
					<!-- 地名 -->
					<view v-if="refinedData.dataOne.length > 0">{{refinedData.dataOne[0].loc}}</view>
					<scroll-view scroll-x="true" @scroll="handleScrollRefinedOne">
						<view class="chart-refined">
							<mpvue-echarts :echarts="echarts" :onInit="handleInitRefinedOne" canvasId="canvasIdRefinedOne" ref="echartsRefRefinedOne"></mpvue-echarts>
						</view>
						<!-- 滑动的日期球，Move属性决定球是否显示 -->
						<view class="balltrack">
							<view class="dateball slideball-Snd" v-if="ballStatusRefinedOne.sndballMove">{{sndballText}}</view>
							<view class="dateball slideball-Trd" v-if="ballStatusRefinedOne.trdballMove">{{trdballText}}</view>
						</view>
						<!-- 信息面板 -->
						<view class="infopanel">
							<view class="infopanel-day" v-for="(item, index) in refinedData.dataOne" :key="index">
								<view class="infocolumn infocolumn-left">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
								<view class="infocolumn">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
							</view>
						</view>
					</scroll-view>
					<!-- 固定在两端的日期球
					Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
					特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
					<view class="balltrack-fix">
						<view class="dateball fixball-Fst" :class="{'dateball-active': ballStatusRefinedOne.fstballActive}">{{fstballText}}</view>
						<view class="dateball fixball-Snd" :class="{'dateball-active': ballStatusRefinedOne.sndballActive, 'fixball-Snd-left': ballStatusRefinedOne.sndballLeft}"
						 v-if="ballStatusRefinedOne.sndballMove == false">{{sndballText}}</view>
						<view class="dateball fixball-Trd" :class="{'dateball-active': ballStatusRefinedOne.trdballActive, 'fixball-Trd-lone': ballStatusRefinedOne.sndballMove, 'fixball-Trd-left': ballStatusRefinedOne.trdballLeft}"
						 v-if="!ballStatusRefinedOne.trdballMove">{{trdballText}}</view>
					</view>
				</view>
				<!-- 两个图表之间的空白 -->
				<view style="height: 60px" v-if="refinedData.showTwo" />
				<view v-show="refinedData.showTwo">
					<view class="refinedChart-body">
						<!-- 地名 -->
						<view v-if="refinedData.dataTwo.length > 0">{{refinedData.dataTwo[0].loc}}</view>
						<scroll-view scroll-x="true" @scroll="handleScrollRefinedTwo">
							<view class="chart-refined">
								<mpvue-echarts :echarts="echarts" :onInit="handleInitRefinedTwo" canvasId="canvasIdRefinedTwo" ref="echartsRefRefinedTwo"></mpvue-echarts>
							</view>
							<!-- 滑动的日期球，Move属性决定球是否显示 -->
							<view class="balltrack">
								<view class="dateball slideball-Snd" v-if="ballStatusRefinedTwo.sndballMove">{{sndballText}}</view>
								<view class="dateball slideball-Trd" v-if="ballStatusRefinedTwo.trdballMove">{{trdballText}}</view>
							</view>
							<!-- 信息面板 -->
							<view class="infopanel">
								<view class="infopanel-day" v-for="(item, index) in refinedData.dataTwo" :key="index">
									<view class="infocolumn infocolumn-left">浪高：{{item.wave}}米\n风力：{{item.windLvl}}级</view>
									<view class="infocolumn">水温：{{item.temp}}℃\n风向：{{item.windDir}}</view>
								</view>
							</view>
						</scroll-view>
						<!-- 固定在两端的日期球
						Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
						特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
						<view class="balltrack-fix">
							<view class="dateball fixball-Fst" :class="{'dateball-active': ballStatusRefinedTwo.fstballActive}">{{fstballText}}</view>
							<view class="dateball fixball-Snd" :class="{'dateball-active': ballStatusRefinedTwo.sndballActive, 'fixball-Snd-left': ballStatusRefinedTwo.sndballLeft}"
							 v-if="ballStatusRefinedTwo.sndballMove == false">{{sndballText}}</view>
							<view class="dateball fixball-Trd" :class="{'dateball-active': ballStatusRefinedTwo.trdballActive, 'fixball-Trd-lone': ballStatusRefinedTwo.sndballMove, 'fixball-Trd-left': ballStatusRefinedTwo.trdballLeft}"
							 v-if="!ballStatusRefinedTwo.trdballMove">{{trdballText}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 威海专项预报 -->
			<view class="page-section" v-if="weihaiData.show">
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
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import inshoreTable from '../../components/inshoreTable.vue'
	import bathsTable from '../../components/bathsTable.vue'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chartTideOne
	let chartTideTwo
	let chartRefinedOne
	let chartRefinedTwo
	let chartWeihaiOne = undefined
	let chartWeihaiTwo = undefined
	let chartWeihaiThree = undefined
	let chartWeihaiFour = undefined

	export default {
		components: {
			inshoreTable,
			bathsTable,
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
                    sndballMove: false,		// 第二个球是否滑动
                    sndballLeft: false,		// 第二个球是否位于左端
                    trdballActive: false,	// 第三个球是否激活（显示为蓝色）
                    trdballMove: false,		// 第三个球是否滑动
                    trdballLeft: false,		// 第三个球是否位于左端
                },
                // 日期球控制参数
                ballStatusRefinedTwo: {
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
				get () { return this.$store.state.Datas.weihaidata },
				set (value) { this.$store.dispatch('setWeihaiData', value) }
			}
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

				// 10秒后关闭toast
				setTimeout(function () {
					uni.hideLoading()
				}.bind(this), 10000)
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
				this.loadWeather(city)
				this.loadAstronomicalTide(city)
				this.loadInshore(city)
				this.loadBaths(city)
				this.loadRefined(city)
				this.loadWeihai(city)
			},
			// 读取服务器天气数据
			loadWeather(city) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetCityWeather',
					data: {
						// weather: that.array[that.location],
						weather: city,
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 天气数据')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 天气数据 返回值为空')
							that.completedRequestCount++
							return false
						}
						let result = JSON.parse(res.data.d)
						if (result.result === null) {
							console.log('[服务器]: 返回 天气数据 返回值为空')
							that.completedRequestCount++
							return false
						}
						let weatherresult = {}
						// 气温数值
						weatherresult.temperature = result.result.data.realtime.weather.temperature
						// 空气质量数值
						weatherresult.aircondition = result.result.data.pm25.pm25.curPm
						// 空气质量文字描述
						weatherresult.airconDesc = result.result.data.pm25.pm25.quality
						// pm2.5数值
						weatherresult.pm25 = result.result.data.pm25.pm25.pm25
						// 天气情况
						weatherresult.weather = result.result.data.realtime.weather.info
						// 天气图标
						weatherresult.weatherIcon = utils.setWeatherIcon(weatherresult.weather)
						// 空气质量图标及pm2.5字体颜色
						weatherresult.airconIcon = utils.setAirconIcon(weatherresult.airconDesc)
						weatherresult.pm25Style = utils.setAirconClass(weatherresult.airconDesc)

						// 五日天气预报数组，高低温数组
						let fivedayarr = result.result.data.weather
						// 准备空数组
						let dataarr = []	// 显示用数据
						let higharr = []	// 高低温
						let lowarr = []
						for (let i = 0; i < fivedayarr.length; i++) {
							// 星期 由'一'改为'周一'
							let week = '周' + fivedayarr[i].week
							// 日期 由yyyy-MM-dd改为MM-dd
							let date = fivedayarr[i].date.substr(5)
							// 天气 取day的天气
							let weather = fivedayarr[i].info.day[1]
							// 天气图标
							let weatherIcon = utils.setWeatherIcon(weather)
							// 风向
							let windDir = fivedayarr[i].info.day[3]
							// 风力
							let windLvl = fivedayarr[i].info.day[4]
							// 高温
							let tempHigh = fivedayarr[i].info.day[2]
							// 低温
							let tempLow = fivedayarr[i].info.night[2]
							// 五日天气数组
							dataarr.push({
								week: week,
								date: date,
								weather: weather,
								weatherIcon: weatherIcon,
								windDir: windDir,
								windLvl: windLvl
							})
							// 高低温数组
							higharr.push(Number(tempHigh))
							lowarr.push(Number(tempLow))
						} // end-for
						let fivedayresult = {
							fivedayWeather: dataarr,
							optionFiveday: utils.setFivedayChartOption(higharr, lowarr)
						}
						// 写入Vuex
						that.weatherData = weatherresult
						that.fivedayData = fivedayresult
						// 写入本地缓存
						utils.storeToLocal('weatherdata', JSON.stringify(weatherresult))
						utils.storeToLocal('fivedaydata', JSON.stringify(fivedayresult))
						that.completedRequestCount++
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取服务器潮汐预报
			loadAstronomicalTide(city) {
				let that = this
				// 根据城市选择url和data
				// let req = utils.getTideReqData(this.array[this.location])
				let req = utils.getTideReqData(city)
				uni.request({
					url: appsettings.hosturl + req.url,
					data: req.data,
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 潮汐预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 潮汐预报数据 返回值为空')
							that.completedRequestCount++
							return false
						}
						let resarr = JSON.parse(res.data.d)
						let result = {
							chartTideOneTitle: '',
							chartTideTwoTitle: '',
							chartTideTwoShow: true,
							optionTideOne: {},
							optionTideTwo: {}
						}
						// 如果city是青岛则第二个图表提前显示
						if (city === '青岛') {
							that.tideData.chartTideTwoShow = true
						}
						let arrOne = []		// 第一个图表数据数组
						let arrTwo = []		// 第二个图表数据数组
						let StationOne = ''	// 第一组数据的地名编号
						StationOne = resarr[0].STATION
						// 按照不同的STATION分组
						for (let i = 0; i < resarr.length; i++) {
							if (resarr[i].STATION === StationOne) {
								arrOne.push(resarr[i])
							} else {
								arrTwo.push(resarr[i])
								// 第二个数组有内容 提前显示所属的view 牺牲一点性能（每次循环都判断一次if）
								// if (that.chartTideTwoShow === false) {
								// 	that.chartTideTwoShow = true
								// }
							}
						}
						// 根据STATION代号设置图表标题(地名)
						result.chartTideOneTitle = utils.getLocName(StationOne)
						// 由数组生成echarts所需的option
						result.optionTideOne = utils.setTideChartOption(arrOne)
						// 如果第二个数组arrTwo有内容 说明第二个图表需要显示
						if (arrTwo.length > 0) {
							// that.chartTideTwoShow = true
							result.chartTideTwoTitle = utils.getLocName(arrTwo[0].STATION)	// 标题地名
							result.optionTideTwo = utils.setTideChartOption(arrTwo)	// 图表数据
						} else {	// 不需要显示第二个图表
							result.chartTideTwoShow = false
						}
						// 写入Vuex
						// 为ios设置延迟
						setTimeout(function(){
							that.tideData = result
						}.bind(that),300)
						// 写入本地缓存
						utils.storeToLocal('tidedata', JSON.stringify(result))
						that.completedRequestCount++
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取服务器近海预报
			loadInshore(city) {
				let that = this
				// 根据所选城市选择url和data
				// let req = utils.getInshoreReqData(this.array[this.location])
				let req = utils.getInshoreReqData(city)
				uni.request({
					url: appsettings.hosturl + req.url,
					data: req.data,
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 近海预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 近海预报数据 返回值为空')
							that.completedRequestCount++
							return false
						}
						let resdata = JSON.parse(res.data.d)
						let result = utils.setInshoreTableData(resdata.wave)
						// 写入Vuex
						that.inshoreData = result
						// 写入本地缓存
						utils.storeToLocal('inshoredata', JSON.stringify(result))
						that.completedRequestCount++
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取服务器浴场预报
			loadBaths(city) {
				let that = this
				let result = {
					showBaths: false,
					data: []
				}
				// 如果不是青岛 直接返回
				if (city !== '青岛') {
					// 写入Vuex
					this.bathsData = result
					// 写入本地缓存
					utils.storeToLocal('bathsdata', JSON.stringify(result))
					that.completedRequestCount++
					return true
				}
				result.showBaths = true
				uni.request({
					url: appsettings.hosturl + 'GetBathsForecast_0823',
					data: { name: 'admin', areaflg: '青岛' },
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 浴场预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 浴场预报数据 返回值为空')
							result.showBaths = false
							that.completedRequestCount++
							return false
						}
						result.data = JSON.parse(res.data.d)
						// 在数组前端加入表头
						result.data.unshift({
							PublishDate: new Date().toString(),
							BathsName: '浴场名称',
							WaveHeight: '浪高(m)',
							WaterTemp: '水温(℃)',
							Swimming: '游泳指数'
						})
						// 写入Vuex
						that.bathsData = result
						// 写入本地缓存
						utils.storeToLocal('bathsdata', JSON.stringify(result))
						that.completedRequestCount++
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.bathsData.showBaths = false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取服务器精细化预报
			loadRefined(cityname) {
				let that = this
				let result = {
					optionOne: {},
					optionTwo: {},
					show: false,
					showTwo: false,
					dataOne: [],
					dataTwo: []
				}
				// 滨州没有精细化预报 设置模块隐藏并返回
				// if (this.array[this.location] === '滨州') {
				if (cityname === '滨州') {
					console.log('滨州无精细化预报')
					// 写入Vuex
					this.refinedData = result
					// 写入本地缓存
					utils.storeToLocal('refineddata', JSON.stringify(result))
					this.completedRequestCount++
					return true
				}
				// 提前显示相关view
				uni.request({
					url: appsettings.hosturl + 'GetRefinedForecast_2018',
					// data: { name: 'admin', areaflg: '山东', city: that.array[that.location] },
					data: { name: 'admin', areaflg: '山东', city: cityname },
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 精细化预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 精细化预报数据 返回值为空')
							that.completedRequestCount++
							return false
						}
						let resdata = JSON.parse(res.data.d)
						result.show = true
						let attrcounter = 0	// 统计返回值有多少组数据
						for (let attr in resdata) {
							if (resdata.hasOwnProperty(attr)) {
								if (attrcounter === 0) {	// 第一组数据
									// that.optionRefinedOne = utils.setRefinedChartOption(resdata[attr].tide)
									result.optionOne = utils.setRefinedChartOption(resdata[attr].tide)
									// that.refinedDataOne = utils.setRefinedData(resdata[attr])
									result.dataOne = utils.setRefinedData(resdata[attr])
									attrcounter++
								} else if (attrcounter === 1) {	// 超过一组数据
									// that.optionRefinedTwo = utils.setRefinedChartOption(resdata[attr].tide)
									result.optionTwo = utils.setRefinedChartOption(resdata[attr].tide)
									// that.refinedDataTwo = utils.setRefinedData(resdata[attr])
									result.dataTwo = utils.setRefinedData(resdata[attr])
									result.showTwo = true
									attrcounter++
									break
								}
							}
						} // end-for
						// 如果有多于一组数据 则第二个chart显示
						// that.showRefinedTwo = attrcounter > 1 ? true : false
						// 写入Vuex
						that.refinedData = result
						// 写入本地缓存
						utils.storeToLocal('refineddata', JSON.stringify(result))
						that.completedRequestCount++
					}, // end-success
					fail: function (res) {
						// 网络请求失败 返回false
						that.refinedData.show = false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取威海专项预报
			loadWeihai(cityname) {
				let that = this
				let result = {
					show: false,
					first: {show: false},
					second: {show: false},
					third: {show: false},
					fourth: {show: false}
				}
				// 不是威海则没有此项
				if (cityname !== '威海') {
					// 写入Vuex和缓存
					this.weihaiData = result
					utils.storeToLocal('weihaidata', JSON.stringify(result))
					this.completedRequestCount++
					return true
				}
				uni.request({
					url: appsettings.hosturl + 'GetWeihaiCity_BH_0828',
					data: { name: 'admin', areaflg: '北海' },
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 威海专项预报数据')
						// 判断返回数据有效性
						if (!res.data.d | res.data.d.length <= 0 | res.data.d === '没有权限访问此权限') { // 返回的值为空
							console.log('[服务器]: 返回 威海专项预报数据 返回值为空')
							that.weihaiData.show = false
							that.completedRequestCount++
							return false
						}
						let resdata = JSON.parse(res.data.d)
						let counter = 0
						for (let i = 0; i < resdata.length; i++) {
							let spdata = {}
							if (resdata[i].FIRSTHIGHTIME === '' | resdata[i].FIRSTLOWTIME === '' | resdata[i].SECONDHIGHTIME === '' | resdata[i].SECONDLOWTIME) {
								continue
							}
							spdata.show = true
							spdata.FORECASTDATE = resdata[i].FORECASTDATE
							spdata.REPORTAREA = resdata[i].REPORTAREA
							spdata.WAVEHEIGHT = resdata[i].WAVEHEIGHT
							spdata.WATERTEMP = resdata[i].WATERTEMP
							spdata.option = utils.setWeihaiChartOption(resdata[i])
							// if (Number(resdata[i].FIRSTLOW) < Number(resdata[i].SECONDLOW)) {
							// 	spdata.option.yAxis.min = Number(resdata[i].FIRSTLOW) - 100
							// } else {
							// 	spdata.option.yAxis.min = Number(resdata[i].SECONDLOW - 100)
							// }
							
							switch (counter) {
								case 0:
									result.first = spdata
									counter++
									break
								case 1:
									result.second = spdata
									counter++
									break
								case 2:
									result.third = spdata
									counter++
									break
								case 3:
									result.fourth = spdata
									counter++
									break
								default:
									break
							}
						}
						if (result.first.show === true | result.second.show === true | result.third.show === true | result.fourth.show === true) {
							result.show = true
						}
						// 写入Vuex和本地缓存
						that.weihaiData = result
						utils.storeToLocal('weihaidata', JSON.stringify(result))
						that.completedRequestCount++
						return true
					},
					fail: function (res) {
						// 网络请求失败 返回false
						that.weihaiData.show = false
						that.completedRequestCount++
						return false
					}
				}) // end-request
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
			// 精细化图标一滚动事件
            handleScrollRefinedOne(e) {
                // utils.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth - 60, this.ballStatus)
                this.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth, this.ballStatusRefinedOne)
			},
			// 精细化图表二滚动事件
            handleScrollRefinedTwo(e) {
                // utils.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth - 60, this.ballStatus)
                this.setDateballStatus(e.detail.scrollLeft, this.systemInfo.windowWidth, this.ballStatusRefinedTwo)
            }
		}, // end-methods
		watch: {
			// 完成的request
			completedRequestCount: {
				handler(newVal, oldVal) {
					if (newVal === 6) {
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				}
			},
			// 潮汐预报模块的两个chart更新
			tideData: {
				handler(newVal, oldVal) {
					if (chartTideOne !== undefined) {
						if (newVal) {
							chartTideOne.setOption(newVal.optionTideOne, true)
							// this.$refs.echartsRefTideOne.init()
						}
					}
					if (chartTideTwo !== undefined) {
						if (newVal) {
							// chartTideTwo.setOption(newVal.optionTideTwo, true)
							this.$refs.echartsRefTideTwo.init()
						}
					}
				}
			},
			// 精细化预报的两个chart更新
			refinedData: {
				handler(newVal, oldVal) {
					if (chartRefinedOne !== undefined) {
						if (newVal) {
							chartRefinedOne.setOption(newVal.optionOne, true)
							// this.$refs.echartsRefTideOne.init()
						}
					}
					if (chartRefinedTwo !== undefined) {
						if (newVal) {
							chartRefinedTwo.setOption(newVal.optionTwo, true)
							// this.$refs.echartsRefTideTwo.init()
						}
					}
				}
			},
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
		},
		onLoad() {
			console.log('cityforecast page onload.')
			// this.loadWeather()
			// this.loadWarning()
			// this.loadInshore()
			// this.loadBaths()
		},
		onReady() {
			console.log('cityforecast page ready.')
			// this.loadAstronomicalTide()
			// this.loadRefined()
		},
		mounted() {
			console.log('cityforecast vue mounted.')
			// 加载时根据当前日期设置日期球文字
            this.setDateballText()
			// 根据index切换城市 允许自动定位 不写入缓存 
			// this.switchCityByIndex(this.cityIndex)
			// 10秒后关闭toast
			setTimeout(function () {
				uni.hideLoading()
			}.bind(this), 10000)
		},
		onPullDownRefresh() {
			console.log('pull down refresh.')
			this.requestData(this.cityName)
			// 10秒后关闭提示
			setTimeout(function () {
				uni.stopPullDownRefresh()
			}.bind(this), 10000)
		}
	}
</script>

<style>
	@import "../../common/uni.css";

	.page-body {
		/* width: 100%; */
		height: 100%;
		padding: 0 30px;
		/* margin: 0 30px; */
		flex-grow: 1;
		overflow-x: hidden;
		/*
		background-repeat: no-repeat;
		background-size: contain;
		background-attachment: fixed;
		*/
	}

	.page-section {
		margin-bottom: 60px;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.uni-list-cell {
		justify-content: flex-start;
	}

	.container {
		display: table;
		width: 100%;
	}

	.main {
		display: table-cell;
	}

	.sidebar {
		display: table-cell;
		width: 150px;
	}

	.text {
		margin: 10px;
		padding: 0 20px;
		background-color: #ebebeb;
		height: 70px;
		line-height: 70px;
		text-align: center;
		color: #cfcfcf;
		font-size: 26px;
	}

	/* 潮汐预报曲线图的容器 必须设置宽度和高度 */
	.chart-tide {
		width: 290%;
		height: 250px;
		border: 1px solid #000;
	}

	/* 整个精细化组件的容器 */
    .refinedChart-body {
        position: relative;
    }

	/* 曲线图的容器 必须设置宽度和高度 */
    .chart-refined {
        width: 290%;
        height: 250px;
        border: 1px solid #000000;
    }

    /* 日期球的外观样式 */
    .dateball {
        display: flex;
        width: 62px;
        height: 62px;
        background-color: rgba(148, 148, 148, 0.8);
        border-radius: 62px;
        font-size: 20px;
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
        font-size: 20px;
        padding: 10px;
        white-space: pre-wrap;
    }

    /* 左边的列 文字水平靠右 */
    .infocolumn-left {
        text-align: right;
    }

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
		border: 1px solid #000;
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