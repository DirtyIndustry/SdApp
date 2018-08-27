<template>
	<!-- <view style="background-image: url(../../static/Images/back_images.jpg); background-repeat: no-repeat; background-size: contain; background-attachment: scroll;"> -->
	<view>
		<myPicker ref="citypicker"></myPicker>
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
				<text>{{tideData.chartTideOneTitle}}</text>
				<scroll-view scroll-x="true">
					<view class="chart-tide">
						<myChart :option="tideData.optionTideOne" canvasId="tideOne" />
					</view>
				</scroll-view>
			</view>
			<!-- 第二个图表 只在青岛地区显示 -->
			<view class="page-section" v-show="tideData.chartTideTwoShow">
				<text>{{tideData.chartTideTwoTitle}}</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollTideTwo">
					<view class="chart-tide">
						<myChart :option="tideData.optionTideTwo" canvasId="tideTwo" />
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
				<refinedChart :option="refinedData.optionOne" :data="refinedData.dataOne" canvasId="refinedOne" />
				<!-- 两个图表之间的空白 -->
				<view style="height: 60px" v-if="refinedData.showTwo"/>
				<view v-show="refinedData.showTwo">
					<refinedChart :option="refinedData.optionTwo" :data="refinedData.dataTwo" canvasId="refinedTwo" />
				</view>
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section">
				<fivedayForcast :option="fivedayData.optionFiveday" :fivedayWeather="fivedayData.fivedayWeather" canvasId="fiveday"/>
			</view>
			<!-- <view class="page-section" /> -->
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import myChart from '../../components/myChart.vue'
	import weatherSection from '../../components/weatherSection.vue'
	import fivedayForcast from '../../components/fivedayForcast.vue'
	import inshoreTable from '../../components/inshoreTable.vue'
	import bathsTable from '../../components/bathsTable.vue'
	import refinedChart from '../../components/refinedChart.vue'
	import myPicker from '../../components/myPicker.vue'

	export default {
		components: {
			myChart,
			weatherSection,
			fivedayForcast,
			inshoreTable,
			bathsTable,
			refinedChart,
			myPicker
		},
		data() {
			return {
				// 完成的request计数
				completedRequestCount: 0,
				
				// 警报数据
				warningData: {
					typhoonWarning: '',
					waveWarning: ''
				},
			}
		},
		computed: {
			// 城市选择列表
			cityArray () { return this.$store.state.Infos.cityarray },
			// 城市选择列表 所选index
			cityIndex: {
				get () { return this.$store.state.Infos.cityindex },
				set (value) { this.$store.dispatch('setCityIndex', value) }
			},
			// 当前城市名称
			cityName: {
				get () { return this.$store.state.Datas.cityname },
				set (value) { this.$store.dispatch('setCityName', value) }
			},
			// 实时天气
			weatherData: {
				get () {return this.$store.state.Datas.weatherdata},
				set (value) {this.$store.dispatch('setWeatherData', value)}
			},
			// 潮汐预报
			tideData: {
				get () {return this.$store.state.Datas.tidedata},
				set (value) {this.$store.dispatch('setTideData', value)}
			},
			// 近海预报
			inshoreData: {
				get () {return this.$store.state.Datas.inshoredata},
				set (value) {this.$store.dispatch('setInshoreData', value)}
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
			switchCityByIndex (index) {
				// 切换城市
				utils.switchCity(this.cityArray[index], this.switchCityByName)
			},
			// 根据name切换城市 写入缓存
			switchCityByName (city) {
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
						console.log('[服务器]: 返回 台风列表')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 台风列表 返回值为空')
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
								console.log('[服务器]: 返回 台风详情')
								if (!res2.data.d) { // 返回的值为空
									console.log('[服务器]: 返回 台风详情 返回值为空')
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
						console.log('[服务器]: 返回 海浪预警列表')
						if (!res.data.d) { // 返回的值为空
							console.log('[服务器]: 返回 海浪预警列表 返回值为空')
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
						that.tideData = result
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
					data: []
				}
				// 不是威海则没有此项
				if (city !== '威海') {
					// 写入Vuex和缓存
					this.weihaiData = result
					utils.storeToLocal('weihaidata', JSON.stringify(result))
					this.completedRequestCount++
					return true
				}
				uni.request({
					url: appsettings.hosturl + 'GetWeihaiCity_BH',
					data: { name: 'admin', areaflg: '北海' },
					method: 'POST',
					success: function (res) {

					},
					fail: function (res) {

					}
				})
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
			console.log('index page onload.')
			// this.loadWeather()
			// this.loadWarning()
			// this.loadInshore()
			// this.loadBaths()
		},
		onReady() {
			console.log('index page ready.')
			// this.loadAstronomicalTide()
			// this.loadRefined()
		},
		mounted () {
			console.log('index vue mounted.')
			// 根据index切换城市 允许自动定位 不写入缓存 
			this.switchCityByIndex(this.cityIndex)
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
		},
		onNavigationBarButtonTap() {
			console.log('navibar button tapped.')
			// uni.showActionSheet({
			// 	itemList: ['自动', '青岛', '烟台', '潍坊', '威海', '日照'],
			// 	success: function (res) {
			// 		console.log('选中了第' + (res.tapIndex + 1) + '个按钮')
			// 	},
			// 	fail: function (res) {
			// 		console.log(res.errMsg)
			// 	}
			// })
			this.$refs.citypicker.switchDialog()
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