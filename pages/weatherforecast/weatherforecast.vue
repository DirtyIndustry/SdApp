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
			<!-- 天气预报模块 -->
			<view class="page-section">
				<weatherSection :weatherData="weatherData" />
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section">
				<view class="fiveday-body">
					<view class="uni-flex uni-row">
						<!-- 依据fivedayWeather生成列 -->
						<view class="fiveday-column uni-flex uni-column" :class="{'fiveday-column-left': index < 4}" v-for="(item, index) in fivedayData.fivedayWeather"
						 :key="index">
							<!-- 自上而下分别为 周，日期，天气，天气图标，折线空格，风向，风力 -->
							<view class="flex-cell-single">{{item.week}}</view>
							<view class="flex-cell-single">{{item.date}}</view>
							<view class="flex-cell-single">{{item.weather}}</view>
							<view class="flex-cell-single">
								<image :src="item.weatherIcon" mode="widthFix" style="width: 50px; height: 50px" />
							</view>
							<view class="flex-cell-quad"> </view>
							<view class="flex-cell-single">{{item.windDir}}</view>
							<view class="flex-cell-single">{{item.windLvl}}</view>
						</view>
					</view>
					<view class="chart-fiveday">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitFiveday" canvasId="canvasIdFiveday" ref="echartsRefFiveday"></mpvue-echarts>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import weatherSection from '../../components/weatherSection.vue'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chartFiveday

	export default {
		components: {
			weatherSection,
			mpvueEcharts
		},
		data() {
			return {
				// 完成的request计数
				completedRequestCount: 0,
				echarts
			}
		},
		computed: {
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
				// this.loadAstronomicalTide(city)
				this.loadAstroTide(city)
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
							return false
						}
						let result = JSON.parse(res.data.d)
						if (result.result === null) {
							console.log('[服务器]: 返回 天气数据 返回值为空')
							return false
						}
						let weatherresult = {}
						// 气温数值
						weatherresult.temperature = result.result.data.realtime.weather.temperature
						// 空气质量数值
						weatherresult.aircondition = result.result.data.pm25.pm25.curPm
						// 空气质量文字描述
						weatherresult.airconDesc =	result.result.data.pm25.pm25.quality
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
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败 返回false
					},
					complete: function (res) {
						that.completedRequestCount++
					}
				}) // end-request
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
						that.tideData = result
						// 写入本地缓存
						utils.storeToLocal('tidedata', JSON.stringify(result))
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败
					},
					complete: function (res) {
						that.completedRequestCount++
					}
				}) // end-request
				return true
			},
			loadAstroTide(city) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetAstronomicalTide_0907',
					data: {name:'admin', areaflg:'山东', city:city},
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 潮汐预报数据')
						if (!res.data.d | res.data.d === '您无权访问此端口') { // 返回的值为空
							console.log('[服务器]: 返回 潮汐预报数据 返回值为空')
							return false
						}
						let resarr = JSON.parse(res.data.d)
						if (resarr.length === 0) {
							console.log('[服务器]: 返回 潮汐预报数据 返回值为空')
							return false
						}
						// 提前展开section
						if (city === '青岛') {
							that.tideData.chartTideTwoShow = true
						}
						let result = {
							chartTideOneTitle: '',
							chartTideTwoTitle: '',
							chartTideTwoShow: false,
							optionTideOne: {},
							optionTideTwo: {}
						}
						// 处理第一组数据
						let tidedataOne = []
						let markdataOne = []
						// tidedata
						for (let i = 0; i < resarr[0].tidedata.length; i++) {
							let item = resarr[0].tidedata[i]
							// 添加曲线数据
							let newdata = {
								value: [new Date(item.time), Number(item.data)]
							}
							// 如果由label值 则添加label数据
							if (item.label !== '') {
								newdata.label = {
									show: true,
									position: 'top',
									formatter: item.label + 'cm'
								}
							}
							tidedataOne.push(newdata)
						}
						// markdata不需处理直接添加
						for (let j = 0; j < resarr[0].markdata.length; j++) {
							let item = resarr[0].markdata[j]
							markdataOne.push([
								{
									coord: [new Date(item.time), Number(item.data)]
								},
								{
									coord: [new Date(item.time), 0]
								}
							])
						}
						// 第一个chart地区名
						result.chartTideOneTitle = resarr[0].location
						// 第一个chart曲线数据
						result.optionTideOne = utils.getAstroOption(tidedataOne, markdataOne)
						// 处理第二组数据
						if (resarr.length > 1) {
							let tidedataTwo = []
							let markdataTwo = []
							for (let k = 0; k < resarr[1].tidedata.length; k++) {
								let item = resarr[1].tidedata[k]
								// 添加曲线数据
								let newdata = {
									value: [new Date(item.time), Number(item.data)]
								}
								// 如果由label值 则添加label数据
								if (item.label !== '') {
									newdata.label = {
										show: true,
										position: 'top',
										formatter: item.label + 'cm'
									}
								}
								tidedataTwo.push(newdata)
							}
							// markdata不需处理直接添加
							for (let l = 0; l < resarr[1].markdata.length; l++) {
								let item = resarr[1].markdata[l]
								markdataTwo.push([
									{
										coord: [new Date(item.time), Number(item.data)]
									},
									{
										coord: [new Date(item.time), 0]
									}
								])
							}
							// 显示第二个chart
							result.chartTideTwoShow = true
							// 第一个chart地区名
							result.chartTideTwoTitle = resarr[1].location
							// 第一个chart曲线数据
							result.optionTideTwo = utils.getAstroOption(tidedataTwo, markdataTwo)
						} // end-if 有第二组数据
						// 写入Vuex
						that.tideData = result
						// 写入本地缓存
						utils.storeToLocal('tidedata', JSON.stringify(result))
					}, // end-success
					complete: function (res) {
						that.completedRequestCount++
					}
				}) // end-request
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
							return false
						}
						let resdata = JSON.parse(res.data.d)
						let result = utils.setInshoreTableData(resdata.wave)
						// 写入Vuex
						that.inshoreData = result
						// 写入本地缓存
						utils.storeToLocal('inshoredata', JSON.stringify(result))
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败
					},
					complete: function (res) {
						that.completedRequestCount++
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
							that.bathsData.showBaths = false
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
					}, // end-success-request
					fail: function (res) {
						// 网络请求失败
					},
					complete: function (res) {
						that.completedRequestCount++
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
					}, // end-success
					fail: function (res) {
						// 网络请求失败
						that.refinedData.show = false
					},
					complete: function (res) {
						that.completedRequestCount++
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
					this.weihaiData.show = false
					utils.storeToLocal('weihaidata', JSON.stringify(this.weihaiData))
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
							return false
						}
						let resdata = JSON.parse(res.data.d)
						let counter = 0	// 计数器
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
							// 依次放入第一至四个obj中
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
						// 任意一个地区有有效数据则显示模块
						if (result.first.show === true | result.second.show === true | result.third.show === true | result.fourth.show === true) {
							result.show = true
						}
						// 写入Vuex和本地缓存
						that.weihaiData = result
						utils.storeToLocal('weihaidata', JSON.stringify(result))
					},
					fail: function (res) {
						// 网络请求失败 返回false
						that.weihaiData.show = false
					},
					complete: function (res) {
						that.completedRequestCount++
					}
				}) // end-request
			},
			// 初始化高低温图表
			handleInitFiveday(canvas, width, height) {
				chartFiveday = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartFiveday)
				chartFiveday.setOption(this.fivedayData.optionFiveday, true)
				return chartFiveday
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
			// 高低温图表option
			fivedayData: {
				handler(newVal, oldVal) {
					if (chartFiveday !== undefined) {
						if (newVal) {
							chartFiveday.setOption(newVal.optionFiveday, true)
							// this.$refs.echartsRefFiveday.init()
						}
					}
				}
			}
		},
		onLoad() {
			console.log('weatherforecast page onload.')
			// this.loadWeather()
			// this.loadWarning()
			// this.loadInshore()
			// this.loadBaths()
		},
		onReady() {
			console.log('weatherforecast page ready.')
			// this.loadAstronomicalTide()
			// this.loadRefined()
		},
		mounted() {
			console.log('weatherforecast vue mounted.')
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

	.uni-flex {
        display: flex;
        flex-direction: row;
    }

    .uni-row {
        flex-direction: row;
    }

    .uni-column {
        flex-direction: column;
    }

    /* 5日天气预报的容器 */
    .fiveday-body {
        position: relative;
    }

	/* 5日天气预报的列 */
	.fiveday-column {
		flex: 1;
		height: 600px;
	}

	/* 5日天气预报非最右边的列 添加右边框 */
	.fiveday-column-left {
		border-right: 1px solid #000000;
	}

	/* 5日天气预报中每列中的单元格 */
	.flex-cell-single {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 5日天气预报中占四行高度的单元格 */
	.flex-cell-quad {
		flex: 4;
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