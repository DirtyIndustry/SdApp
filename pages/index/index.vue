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
			<view style="height: 100px;" />
			<!-- 天气预报模块 -->
			<view class="page-section">
				<weatherSection :weatherData="weatherData" />
			</view>
			<!-- 警报模块 -->
			<view class="page-section">
				<!-- 台风警报 -->
				<view class="text" v-if="warningData.typhoonWarning != ''">
					{{warningData.typhoonWarning}}
				</view>
				<!-- 海浪警报 -->
				<view class="text" v-if="warningData.waveWarning != ''">
					{{warningData.waveWarning}}
				</view>
			</view>
			<!-- 潮汐预报模块 -->
			<!-- 第一个图表 -->
			<view class="page-section">
				<text>{{chartTideOneTitle}}</text>
				<scroll-view scroll-x="true">
					<view class="chart-tide">
						<myChart :option="optionTideOne" canvasId="tideOne" />
					</view>
				</scroll-view>
			</view>
			<!-- 第二个图表 只在青岛地区显示 -->
			<view class="page-section" v-show="chartTideTwoShow">
				<text>{{chartTideTwoTitle}}</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollTideTwo">
					<view class="chart-tide">
						<myChart :option="optionTideTwo" canvasId="tideTwo" />
					</view>
				</scroll-view>
			</view>
			<!-- 近海预报 -->
			<view class="page-section">
				<inshoreTable :inshoreData="inshoreData" />
			</view>
			<!-- 浴场预报 -->
			<view class="page-section" v-if="showBaths">
				<bathsTable :bathsData="bathsData" />
			</view>
			<!-- 精细化预报 -->
			<view class="page-section" v-show="showRefined">
				<view>精细化预报</view>
				<refinedChart :option="optionRefinedOne" :data="refinedDataOne" canvasId="refinedOne" />
				<!-- 两个图表之间的空白 -->
				<view style="height: 60px" v-if="showRefinedTwo"/>
				<view v-show="showRefinedTwo">
					<refinedChart :option="optionRefinedTwo" :data="refinedDataTwo" canvasId="refinedTwo" />
				</view>
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section">
				<fivedayForcast :option="optionFiveday" :fivedayWeather="fivedayWeather" canvasId="fiveday"/>
			</view>
			<!-- <view class="page-section" /> -->
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import myChart from '../../components/myChart.vue'
	import weatherSection from '../../components/weatherSection.vue'
	import fivedayForcast from '../../components/fivedayForcast.vue'
	import inshoreTable from '../../components/inshoreTable.vue'
	import bathsTable from '../../components/bathsTable.vue'
	import refinedChart from '../../components/refinedChart.vue'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	export default {
		components: {
			mpvueEcharts,
			myChart,
			weatherSection,
			fivedayForcast,
			inshoreTable,
			bathsTable,
			refinedChart
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
				// 精细化预报
				optionRefinedOne: {},	// 两个图表的option
				optionRefinedTwo: {},
				showRefined: true,	// 精细化模块是否显示
				showRefinedTwo: true,	// 第二个图表是否显示
				refinedDataOne: [	// 图标周围显示的数据
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
				],
				refinedDataTwo: [	// 图标周围显示的数据
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
		computed: {
			...mapState(['location', 'systemInfo'])
		},
		methods: {
			...mapMutations(['setLocation']),
			// 地区选择变化
			bindPickerChange: function (e) {
				// 弹出loading toast
				uni.showLoading(
					{ title: '加载中' }
				);
				this.setLocation(e.target.value)
				this.requestData(this.array[e.target.value])
				// 10秒后关闭toast
				setTimeout(function () {
					uni.hideLoading()
				}.bind(this), 10000)
			},
			// 读取服务器数据
			requestData(city) {
				this.completedRequestCount = 0
				this.loadWeather(city)
				this.loadWarning()
				this.loadAstronomicalTide(city)
				this.loadInshore(city)
				this.loadBaths(city)
				this.loadRefined(city)
			},
			// 读取服务器天气数据
			loadWeather(city) {
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
						if (result.result === null) {
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
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
						let higharr = []
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
			loadWarning() {
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
			loadAstronomicalTide(city) {
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
						let StationOne = ''	// 第一组数据的地名编号
						StationOne = resarr[0].STATION
						// 按照不同的STATION分组
						for (let i = 0; i < resarr.length; i++) {
							if (resarr[i].STATION === StationOne) {
								arrOne.push(resarr[i])
							} else {
								arrTwo.push(resarr[i])
							}
						}
						// 根据STATION代号设置图表标题(地名)
						that.chartTideOneTitle = utils.getLocName(StationOne)
						// 由数组生成echarts所需的option
						that.optionTideOne = utils.setTideChartOption(arrOne)
						// 如果第二个数组arrTwo有内容 说明第二个图表需要显示
						if (arrTwo.length > 0) {
							that.chartTideTwoShow = true
							that.chartTideTwoTitle = utils.getLocName(arrTwo[0].STATION)	// 标题地名
							that.optionTideTwo = utils.setTideChartOption(arrTwo)	// 图表数据
						} else {	// 不需要显示第二个图表
							that.chartTideTwoShow = false
						}
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
			loadBaths(city) {
				let that = this
				// 如果不是青岛 直接返回
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
						// 在数组前端加入表头
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
						that.showBaths = false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
			},
			// 读取服务器精细化预报
			loadRefined(city) {
				let that = this
				// 滨州没有精细化预报 设置模块隐藏并返回
				if (this.array[this.location] === '滨州') {
					console.log('滨州无精细化预报')
					this.showRefined = false
					this.showRefinedTwo = false	// 第二个图表是否显示
					this.completedRequestCount++
					return true
				}
				uni.request({
					url: appsettings.hosturl + 'GetRefinedForecast_2018',
					data: { name: 'admin', areaflg: '山东', city: that.array[that.location] },
					method: 'POST',
					success: function (res) {
						console.log('成功获取精细化预报数据')
						if (!res.data.d) { // 返回的值为空
							console.log('返回值为空')
							that.completedRequestCount++
							return false
						}
						let resdata = JSON.parse(res.data.d)
						that.showRefined = true
						let attrcounter = 0	// 统计返回值有多少组数据
						for (let attr in resdata) {
							if (resdata.hasOwnProperty(attr)) {
								if (attrcounter === 0) {	// 第一组数据
									that.optionRefinedOne = utils.setRefinedChartOption(resdata[attr].tide)
									that.refinedDataOne = utils.setRefinedData(resdata[attr])
									attrcounter++
								} else if (attrcounter === 1) {	// 超过一组数据
									that.optionRefinedTwo = utils.setRefinedChartOption(resdata[attr].tide)
									that.refinedDataTwo = utils.setRefinedData(resdata[attr])
									attrcounter++
									break
								}
							}
						} // end-for
						// 如果有多于一组数据 则第二个chart显示
						that.showRefinedTwo = attrcounter > 1 ? true : false
						that.completedRequestCount++
					}, // end-success
					fail: function (res) {
						// 网络请求失败 返回false
						that.showBaths = false
						that.completedRequestCount++
						return false
					}
				}) // end-request
				return true
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
			}
		},
		onLoad() {
			uni.showLoading()
			this.loadWeather()
			this.loadWarning()
			this.loadInshore()
			this.loadBaths()
		},
		onReady() {
			this.loadAstronomicalTide()
			this.loadRefined()
			// 10秒后关闭toast
			setTimeout(function () {
				uni.hideLoading()
			}.bind(this), 10000)
		},
		onPullDownRefresh() {
			console.log('refresh')
			this.requestData(this.array[this.location])
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
</style>