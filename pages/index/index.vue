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
								{{array[location]}}地区预报
							</view>
							<view class="sidebar">
								<!-- 切换城市按钮 -->
								<picker @change="bindPickerChange" :value="location" :range="array">
									<view class="uni-input">切换城市</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 占位空白模块 -->
			<view style="height: 100px;">

			</view>
			<!-- 天气预报模块 -->
			<view class="page-section">
				<weatherSection :weatherData="weatherData" />
			</view>
			<!-- 警报模块 -->
			<view class="page-section">
				<!-- 台风警报 -->
				<view class="text">
					{{warningData.typhoonWarning}}
				</view>
				<!-- 海浪警报 -->
				<view class="text">
					{{warningData.waveWarning}}
				</view>
			</view>
			<!-- 潮汐预报模块 -->
			<!-- 第一个图表 -->
			<view class="page-section">
				<text>{{chartTideOneTitle}}</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollTideOne">
					<view class="chart-tide">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitTideOne" canvasId="canvasTideOne" ref="echartsTideOne"></mpvue-echarts>
					</view>
					<!-- 滑动的日期球，Move属性决定球是否显示 -->
					<view class="balltrack">
						<view class="dateball slideball-Snd" v-show="ballTideOne.sndballMove">{{sndballText}}</view>
						<view class="dateball slideball-Trd" v-show="ballTideOne.trdballMove">{{trdballText}}</view>
					</view>
				</scroll-view>
				<!-- 固定在两端的日期球
				Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
				特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
				<view class="balltrack-fix">
					<view class="dateball fixball-Fst" :class="{'dateball-active': ballTideOne.fstballActive}">{{fstballText}}</view>
					<view class="dateball fixball-Snd" :class="{'dateball-active': ballTideOne.sndballActive, 'fixball-Snd-left': ballTideOne.sndballLeft}"
					 v-show="!ballTideOne.sndballMove">{{sndballText}}</view>
					<view class="dateball fixball-Trd" :class="{'dateball-active': ballTideOne.trdballActive, 'fixball-Trd-lone': ballTideOne.sndballMove, 'fixball-Trd-left': ballTideOne.trdballLeft}"
					 v-show="!ballTideOne.trdballMove">{{trdballText}}</view>
				</view>
			</view>
			<!-- 第二个图表 只在青岛地区显示 -->
			<view class="page-section" v-show="chartTideTwoShow">
				<text>{{chartTideTwoTitle}}</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollTideTwo">
					<view class="chart-tide">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitTideTwo" canvasId="canvasTideTwo"></mpvue-echarts>
					</view>
					<!-- 滑动的日期球，Move属性决定球是否显示 -->
					<view class="balltrack">
						<view class="dateball slideball-Snd" v-show="ballTideTwo.sndballMove">{{sndballText}}</view>
						<view class="dateball slideball-Trd" v-show="ballTideTwo.trdballMove">{{trdballText}}</view>
					</view>
				</scroll-view>
				<!-- 固定在两端的日期球
					Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
					特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
				<view class="balltrack-fix">
					<view class="dateball fixball-Fst" :class="{'dateball-active': ballTideTwo.fstballActive}">{{fstballText}}</view>
					<view class="dateball fixball-Snd" :class="{'dateball-active': ballTideTwo.sndballActive, 'fixball-Snd-left': ballTideTwo.sndballLeft}"
					 v-show="!ballTideTwo.sndballMove">{{sndballText}}</view>
					<view class="dateball fixball-Trd" :class="{'dateball-active': ballTideTwo.trdballActive, 'fixball-Trd-lone': ballTideTwo.sndballMove, 'fixball-Trd-left': ballTideTwo.trdballLeft}"
					 v-show="!ballTideTwo.trdballMove">{{trdballText}}</view>
				</view>
			</view>
			<!-- 近海预报 -->
			<view class="page-section">
				<inshoreTable :inshoreData="inshoreData" />
			</view>
			<!-- 浴场预报 -->
			<view class="page-section" v-if="showBaths">
				<bathsTable :bathsData="bathsData" />
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section container-fiveday">
				<fivedayForcast :fivedayWeather="fivedayWeather" />
				<view class="chart-fiveday">
					<mpvue-echarts :echarts="echarts" :onInit="handleInitFiveday" canvasId="canvasFiveday" />
				</view>
			</view>
			<!-- <view class="page-section" /> -->
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import weatherSection from '../../components/weatherSection.vue'
	import fivedayForcast from '../../components/fivedayForcast.vue'
	import inshoreTable from '../../components/inshoreTable.vue'
	import bathsTable from '../../components/bathsTable.vue'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chartTideOne, chartTideTwo // 金沙滩和一浴的图表
	let chartFiveday // 五日天气预报图标

	export default {
		components: {
			mpvueEcharts,
			weatherSection,
			fivedayForcast,
			inshoreTable,
			bathsTable
		},
		data() {
			return {
				// 城市列表
				array: ['青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
				// 上一个选择的城市
				lastSelectedCityIndex: 0,
				// 完成的request计数
				completedRequestCount: 0,
				// 天气数据
				weatherData: {
					temperature: '25', // 气温
					aircondition: '35', // 空气质量
					airconDesc: '优',
					airconIcon: '../../static/Images/right_leaf_sev.png', // 空气质量绿叶图标
					weather: '晴',
					weatherIcon: '../../static/Images/right_weather_fine.png', // 天气图表
					pm25: '8', // PM2.5
					pm25Style: 'good'
				},
				// 警报数据
				warningData: {
					typhoonWarning: '',
					waveWarning: ''
				},
				// 潮汐预报两个图表的地区
				chartTideOneTitle: '',
				chartTideTwoTitle: '',
				// 潮汐预报第二个图表是否显示
				chartTideTwoShow: true,
				// 潮汐预报图表数据
				optionTideOne: {},
				optionTideTwo: {},
				// 日期球的日期文字
				fstballText: '1st',
				sndballText: '2nd',
				trdballText: '3rd',
				// 潮汐预报一号日期球控制参数
				ballTideOne: {
					fstballActive: true, // 第一个球是否激活（显示为蓝色）
					sndballActive: false, // 第二个球是否激活（显示为蓝色）
					sndballMove: false, // 第二个球是否滑动
					sndballLeft: false, // 第二个球是否位于左端
					trdballActive: false, // 第三个球是否激活（显示为蓝色）
					trdballMove: false, // 第三个球是否滑动
					trdballLeft: false // 第三个球是否位于左端
				},
				// 潮汐预报二号日期球控制参数
				ballTideTwo: {
					fstballActive: true,
					sndballActive: false,
					sndballMove: false,
					sndballLeft: false,
					trdballActive: false,
					trdballMove: false,
					trdballLeft: false
				},
				// 五日天气预报
				fivedayWeather: [], // 天气详情
				fivedayHighTemp: [], // 每日最高温度
				fivedayLowTemp: [], // 每日最低温度
				optionFiveday: {}, // 高低温chart option
				// 近海预报
				inshoreData: {},
				// 浴场预报
				showBaths: true,
				bathsData: {},
				echarts
			}
		},
		computed: {
			...mapState(['location', 'systemInfo'])
		},
		methods: {
			...mapMutations(['setLocation']),
			// 地区选择变化
			bindPickerChange: function (e) {
				uni.showLoading(
					// {title: '加载中'}
				);
				this.setLocation(e.target.value)
				this.requestData(this.array[e.target.value])
			},
			// 读取服务器数据
			requestData (city) {
				this.completedRequestCount = 0
				this.loadWeather(city)
				this.loadWarning()
				this.loadAstronomicalTide(city)
				this.loadInshore(city)
				this.loadBaths(city)
			},
			// 读取服务器天气数据
			loadWeather (city) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetCityWeather',
					data: {
						weather: that.array[that.location],
						// weather: city,
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取天气数据!')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						let result = JSON.parse(res.data.d)
						// 气温数值
						that.weatherData.temperature =
							result.result.data.realtime.weather.temperature
						// 空气质量数值
						that.weatherData.aircondition = result.result.data.pm25.pm25.curPm
						// 空气质量文字描述
						that.weatherData.airconDesc = result.result.data.pm25.pm25.quality
						// pm2.5数值
						that.weatherData.pm25 = result.result.data.pm25.pm25.pm25
						// 天气情况
						that.weatherData.weather = result.result.data.realtime.weather.info
						// 天气图标
						that.weatherData.weatherIcon = utils.setWeatherIcon(
							that.weatherData.weather
						)
						// 空气质量图标及pm2.5字体颜色
						that.weatherData.airconIcon = utils.setAirconIcon(
							that.weatherData.airconDesc
						)
						that.weatherData.pm25Style = utils.setAirconClass(
							that.weatherData.airconDesc
						)
						// 五日天气预报数组，高低温数组
						let fivedayarr = result.result.data.weather
						// 清空数组
						that.fivedayWeather = []
						that.fivedayHighTemp = []
						that.fivedayLowTemp = []
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
							that.fivedayWeather.push({
								week: week,
								date: date,
								weather: weather,
								weatherIcon: weatherIcon,
								windDir: windDir,
								windLvl: windLvl
							})
							// 高低温数组
							that.fivedayHighTemp.push(Number(tempHigh))
							that.fivedayLowTemp.push(Number(tempLow))
						} // end-for
						that.optionFiveday = utils.setFivedayChartOption(
							that.fivedayHighTemp,
							that.fivedayLowTemp
						)
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
			// 读取服务器台风和海浪警报
			loadWarning () {
				let that = this
				// 读取台风信息
				// 请求服务器台风列表
				uni.request({
					url: appsettings.hosturl + 'GetTyphoonList',
					data: {
						areaflg: '青岛',
						Typhoonyear: new Date().getFullYear()
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取台风列表')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						// TODO： 接口返回值改为json格式
						// 字符串用#,分割
						let typhoonlist = res.data.d.toString().split('#,')
						// 获取列表中最后一个（最新）台风的详细信息
						// 数组[台风编号，台风中文名，台风英文名]
						let lasttyphoon = typhoonlist[typhoonlist.length - 1].split(',')
						// 请求last typhoon详情数据
						uni.request({
							url: appsettings.hosturl + 'GetTyphoonPath',
							data: {
								areaflg: '青岛',
								typhoonNumber: lasttyphoon[0] // 台风编号
							},
							method: 'POST',
							success: function (res2) {
								console.log('成功获取台风详情')
								if (!res2.data.d) { // 返回的值为空
									console.log('返回值为空')
									that.completedRequestCount++
									return false
								}
								// TODO： 接口返回值改为json格式
								// 字符串用#$分割
								let datelist = res2.data.d.toString().split('#$')
								// 数组中最后一项为空，倒数第二项为最后一个有效值
								let typhoondate = new Date(
									datelist[datelist.length - 2].split(',')[0].replace(/-/g, '/')
								)
								let nowdate = new Date()
								nowdate.setHours(nowdate.getHours() - 10)
								if (typhoondate > nowdate) {
									// 有台风警报
									console.log('有台风警报')
									that.warningData.typhoonWarning =
										'编号:' +
										lasttyphoon[0] +
										'"' +
										lasttyphoon[1] +
										'"正在靠近……'
								} // end-if (typhoondate > nowdate)
							}, // end-success-request
							fail: function (res) {
								// 网络请求失败 返回false
								that.completedRequestCount++
								return false
							}
						}) // end-request 请求服务器台风详情
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.completedRequestCount++
						return false
					}
				}) // end-request 请求服务器台风列表
				// 请求服务器海浪预警列表
				uni.request({
					url: appsettings.hosturl + 'GetEachWarning_ceshi',
					data: {
						name: 'admin',
						areaflg: '青岛'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取海浪预警列表')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						// TODO： 接口返回值改为json格式
						// 垃圾接口，就懒得写说明了，改了以后在说
						let warninglist = res.data.d.toString().split('.html')
						warninglist.pop()
						if (warninglist.length > 0) {
							let firstwarning = warninglist[0].split(',')
							let warningname
							let warningdate
							for (let i = 0; i < firstwarning.length; i++) {
								if (firstwarning[i] != '') {
									warningname = firstwarning[i]
									warningdate = firstwarning[i + 1]
									break
								}
							} // end-for
							that.warningData.waveWarning =
								warningname + ',' + warningdate + '……'
						} // end-if (warninglist.length > 0)
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.completedRequestCount++
						return false
					}
				}) // end-request 请求海浪预警
				that.completedRequestCount++
				return true
			},
			// 读取服务器潮汐预报
			loadAstronomicalTide (city) {
				let that = this
				// 根据城市选择url和data
				let req = utils.getTideReqData(this.array[this.location])
				// let req = utils.getTideReqData(city)
				uni.request({
					url: appsettings.hosturl + req.url,
					data: req.data,
					method: 'POST',
					success: function (res) {
						console.log('成功获取潮汐预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						let resarr = JSON.parse(res.data.d)
						let arrOne = []		// 第一个图表数据数组
						let arrTwo = []		// 第二个图表数据数组
						let StationOne = ''	// 第一组数据的地名
						let StationTwo = ''	// 第二组数据的地名
						StationOne = resarr[0].STATION
						// 按照不同的STATION分组
						for (let i = 0; i < resarr.length; i++) {
							if (resarr[i].STATION === StationOne) {
								arrOne.push(resarr[i])
							} else {
								arrTwo.push(resarr[i])
							}
						}
						// 如果第二个数组arrTwo有内容 说明第二个图表需要显示
						if (arrTwo.length > 0) {
							that.chartTideTwoShow = true
							StationTwo = arrTwo[0].STATION
						} else {
							that.chartTideTwoShow = false
						}
						// 根据STATION代号设置图表标题(地名)
						that.chartTideOneTitle = utils.getLocName(StationOne)
						that.chartTideTwoTitle = utils.getLocName(StationTwo)
						// 由数组生成echarts所需的option
						that.optionTideOne = utils.setTideChartOption(arrOne)
						that.optionTideTwo = utils.setTideChartOption(arrTwo)
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
			loadInshore (city) {
				let that = this
				let req = utils.getInshoreReqData(this.array[this.location])
				uni.request({
					url: appsettings.hosturl + req.url,
					data: req.data,
					method: 'POST',
					success: function (res) {
						console.log('成功获取近海预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						let resdata = JSON.parse(res.data.d)
						that.inshoreData = utils.setInshoreTableData(resdata.wave)
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
			loadBaths (city) {
				let that = this
				if (this.array[this.location] != '青岛') {
					this.showBaths = false
					that.completedRequestCount++
					return true
				}
				this.showBaths = true
				uni.request({
					url: appsettings.hosturl + 'GetBathsForecast_0823',
					data: { name: 'admin', areaflg: '青岛' },
					method: 'POST',
					success: function (res) {
						console.log('成功获取浴场预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.showBaths = false
							that.completedRequestCount++
							return false
						}
						that.bathsData = JSON.parse(res.data.d)
						that.bathsData.unshift({
							PublishDate: new Date().toString(),
							BathsName: '浴场名称',
							WaveHeight: '浪高(m)',
							WaterTemp: '水温(℃)',
							Swimming: '游泳指数'
						})
						that.completedRequestCount++
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
						that.showBaths =  false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 初始化潮汐预报一号图表
			handleInitTideOne (canvas, width, height) {
				chartTideOne = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartTideOne)
				chartTideOne.setOption(this.optionTideOne)
				return chartTideOne
			},
			// 初始化潮汐预报二号图表
			handleInitTideTwo (canvas, width, height) {
				chartTideTwo = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartTideTwo)
				chartTideTwo.setOption(this.optionTideTwo)
				return chartTideTwo
			},
			// 五日天气预报图表
			handleInitFiveday (canvas, width, height) {
				chartFiveday = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartFiveday)
				chartFiveday.setOption(this.optionFiveday)
				return chartFiveday
			},
			// 潮汐预报一号图表滚动事件
			scrollTideOne (e) {
				utils.setDateballStatus(
					e.detail.scrollLeft,
					this.systemInfo.windowWidth,
					this.ballTideOne
				)
			},
			// 潮汐预报二号图表滚动事件
			scrollTideTwo (e) {
				utils.setDateballStatus(
					e.detail.scrollLeft,
					this.systemInfo.windowWidth,
					this.ballTideTwo
				)
			},
			// 设置曲线图下方日期球的日期
			setDateballText () {
				let now = new Date()
				function formatDate(date) {
					// 格式化日期为MM-dd
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
		watch: {
			// 完成的request
			completedRequestCount: {
				handler (newVal, oldVal) {
					if (newVal === 5) {
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				}
			},
			// 潮汐一option
			optionTideOne: {
				handler (newVal, oldVal) {
					if (chartTideOne !== undefined) {
						if (newVal) {
							chartTideOne.setOption(newVal)
						}
					}
				}
			},
			// 潮汐二option
			optionTideTwo: {
				handler (newVal, oldVal) {
					if (chartTideTwo !== undefined) {
						if (newVal) {
							chartTideTwo.setOption(newVal)
						}
					}
				}
			},
			// 五日天气预报option
			optionFiveday: {
				handler (newVal, oldVal) {
					if (chartFiveday !== undefined) {
						if (newVal) {
							chartFiveday.setOption(newVal)
						}
					}
				}
			}
		},
		onLoad() {
			uni.showLoading()
			this.loadWeather()
			this.loadWarning()
			this.loadInshore()
			this.loadBaths()
			this.setDateballText()
		},
		onReady() {
			this.loadAstronomicalTide()
		},
		onPullDownRefresh() {
			console.log('refresh')
			this.requestData(this.array[this.location])
		}
	}
</script>

<style>
	@import "../../common/uni.css";

	.page-body {
		/* width: 100%; */
		height: 100%;
		padding: 0 30px;
		flex-grow: 1;
		overflow-x: hidden;
		/*
		background-repeat: no-repeat;
		background-size: contain;
		background-attachment: fixed;
		*/
	}

	.page-section {
		/* width: 96%; */
		/* margin: auto; */
		/* padding: 5%; */
		/* margin: 5%; */
		margin-bottom: 60px;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.background-panel {
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

	/* 曲线图的容器 必须设置宽度和高度 */
	.chart-tide {
		width: 290%;
		height: 250px;
		border: 1px solid #000;
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

	/* 左右边框 */
	.border-horizontal {
		border-left: 1px solid #000;
		border-right: 1px solid #000;
	}

	/* 上下边框 */
	.border-vertical {
		border-top: 1px solid #000;
		border-bottom: 1px solid #000;
	}

	/* 五日天气预报容器 */
	.container-fiveday {
		position: relative;
	}
	/* 五日天气预报气温图表 */
	.chart-fiveday {
		width: 100%;
		height: 235px;
		/* margin-top: -360px; */
		top: 240px;
		position: absolute;
	}
</style>
