<template>
	<view>
		<view class="page-body">
			<view class="page-section">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="container">
							<view class="main">
								{{array[location]}}地区预报
							</view>
							<view class="sidebar">
								<picker @change="bindPickerChange" :value="location" :range="array">
									<view class="uni-input">切换城市</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="page-section">
				<view class="uni-flex uni-row">
					<view class="text" style="width: 200px;height: 220px;display: flex; justify-content: center;align-items: center;">
						{{weatherData.temperature}}℃
					</view>
					<view class="uni-flex uni-column" style="flex: 1;justify-content: space-between;">
						<view class="text" style="height: 120px;text-align: left;padding-left: 20px;padding-top: 10px;">
							<image :src="weatherData.weatherIcon" style="width: 50px;height: 50px;" /> {{weatherData.weather}}
						</view>
						<view class="uni-flex uni-row">
							<view class="text" style="flex: 1;">
								<image :src="weatherData.airconIcon" style="width: 30px;height: 30px;" /> {{weatherData.aircondition}} {{weatherData.airconDesc}}
							</view>
							<view class="text" style="flex: 1;">
								<text v-bind:class="weatherData.pm25Style">PM2.5</text>
								{{weatherData.pm25}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="page-section">
				<view class="text">
					{{warningData.typhoonWarning}}
				</view>
				<view class="text">
					{{warningData.waveWarning}}
				</view>
			</view>
			<view class="page-section">
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="chart">
						<myChart :option="optionJST"></myChart>
					</view>
				</scroll-view>
			</view>
			<view class="page-section">
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="chart">
						<myChart :option="optionJST"></myChart>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import pageHead from '../../components/page-head.vue'
	import myChart from '../../components/myChart.vue'
	export default {
		components: {
			pageHead,
			myChart
		},
		data() {
			return {
				// 城市列表
				array: ['青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
				// 天气数据
				weatherData: {
					temperature: '25',
					aircondition: '35',
					airconDesc: '优',
					airconIcon: '../../static/Images/right_leaf_sev.png',
					weather: '晴',
					weatherIcon: '../../static/Images/right_weather_fine.png',
					pm25: '8',
					pm25Style: 'good'
				},
				// 警报数据
				warningData: {
					typhoonWarning: '',
					waveWarning: ''
				},
				// 金沙滩和一浴图表数据
				optionJST: {},
				optionYY: {}
			}
		},
		computed: {
			...mapState(['location'])
		},
		methods: {
			...mapMutations(['setLocation']),
			// 地区选择变化
			bindPickerChange: function (e) {
				//console.log('picker changed. value is: ', e.target.value)
				this.index = e.target.value
				this.setLocation(e.target.value)
				this.loadWeather()
			},
			// 读取服务器天气数据
			loadWeather() {
				let that = this
				uni.request({
					url: 'http://123.234.129.238:8001/MyWebService.asmx/GetCityWeather',
					data: {
						weather: that.array[that.location],
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
					//dataType: 'text',
					success: function (res) {
						console.log('成功获取天气数据!')
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

						that.setWeatherIcon(that.weatherData.weather)
						that.setAirconIcon(that.weatherData.airconDesc)
					}
				})
			},
			// 根据天气设置图标
			setWeatherIcon(weather) {
				switch (weather) {
					case '晴':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_fine.png'
						break
					case '多云':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_cloudy.png'
						break
					case '阴':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_sky.png'
						break
					case '雾':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_fog.png'
						break
					case '风':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_wind.png'
						break
					case '小雨':
					case '中雨':
					case '小到中雨':
					case '大雨':
					case '暴雨':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_rainy.png'
						break
					case '阵雨':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_rainysh.png'
						break
					case '大到暴雨':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_rainstorm.png'
						break
					case '雷雨':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_thunder.png'
						break
					case '雪':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_snow.png'
						break
					case '雨加雪':
						this.weatherData.weatherIcon =
							'../../static/Images/right_weather_raisnow.png'
						break
				}
			},
			// 根据空气质量设置图标和文字style
			setAirconIcon(airconDesc) {
				switch (airconDesc) {
					case '重度污染':
						this.weatherData.airconIcon =
							'../../static/Images/right_leaf_sev.png'
						this.weatherData.pm25Style = 'sev'
						break
					case '轻度污染':
						this.weatherData.airconIcon =
							'../../static/Images/right_leaf_bad.png'
						this.weatherData.pm25Style = 'bad'
						break
					case '良':
						this.weatherData.airconIcon =
							'../../static/Images/right_leaf_very.png'
						this.weatherData.pm25Style = 'very'
						break
					case '优':
						this.weatherData.airconIcon =
							'../../static/Images/right_leaf_excellent.png'
						this.weatherData.pm25Style = 'excellent'
						break
				}
			},
			// 读取服务器台风和海浪警报
			loadWarning() {
				let that = this
				// 读取台风信息
				// 请求服务器台风列表
				uni.request({
					url: 'http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList',
					data: {
						areaflg: '青岛',
						Typhoonyear: new Date().getFullYear()
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取台风列表')
						// 字符串用#,分割
						let typhoonlist = res.data.d.toString().split('#,')
						// 获取列表中最后一个（最新）台风的详细信息
						// 数组[台风编号，台风中文名，台风英文名]
						let lasttyphoon = typhoonlist[typhoonlist.length - 1].split(',')
						uni.request({
							url: 'http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonPath',
							data: {
								areaflg: '青岛',
								typhoonNumber: lasttyphoon[0]
							},
							method: 'POST',
							success: function (res2) {
								console.log('成功获取台风详情')
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
								}
							}
						}) // 请求服务器台风详情
					}
				}) // 请求服务器台风列表
				// 请求服务器海浪预警列表
				uni.request({
					url: 'http://123.234.129.238:8001/MyWebService.asmx/GetEachWarning_ceshi',
					data: {
						name: 'admin',
						areaflg: '青岛'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取海浪预警列表')
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
							}
							that.warningData.waveWarning =
								warningname + ',' + warningdate + '……'
						}
					}
				})
			},
			// 读取服务器潮汐预报
			loadAstronomicalTide() {
				let that = this
				uni.request({
					url: 'http://123.234.129.238:8001/MyWebService.asmx/GetAstronomicalTide_QD',
					data: {
						name: 'admin',
						areaflg: '青岛'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取潮汐预报数据')
						// STATION 101wmt为金沙滩 102xmd为第一海水浴场
						let resarr = JSON.parse(res.data.d)
						let arrJST = []
						let arrYY = []
						for (let i = 0; i < 6; i++) {
							if (resarr[i].STATION === '101wmt') {
								arrJST.push(resarr[i])
							} else if (resarr[i].STATION === '102xmd') {
								arrYY.push(resarr[i])
							}
						}
						that.optionJST = that.setChartOption(arrJST)
						that.optionYY = that.setChartOption(arrYY)
					}
				})
			},
			// 由三日数据生成chart option
			setChartOption(arr) {
				// 按日期排序
				function SortByDate(x, y) {
					let datex = new Date(x.PREDICTIONDATE)
					let datey = new Date(y.PREDICTIONDATE)
					return datex - datey
				}
				arr.sort(SortByDate)
				// 提取潮汐数值
				let tidedata = []
				for (let i = 0; i < arr.length; i++) {
					let inittime = new Date(arr[i].PREDICTIONDATE)
					let datestring = inittime.getFullYear() + '-' + (inittime.getMonth()+1) + '-' + inittime.getDate()
					// 每小时数值
					tidedata.push([inittime.setHours(inittime.getHours()), arr[i].H0])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H1])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H2])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H3])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H4])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H5])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H6])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H7])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H8])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H9])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H10])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H11])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H12])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H13])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H14])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H15])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H16])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H17])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H18])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H19])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H20])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H21])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H22])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H23])
					// 高低潮数值
					let dateFH = new Date(datestring + ' ' + arr[i].FSTHIGHWIDETIME)
					tidedata.push([dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT])
					let dateFL = new Date(datestring + ' ' + arr[i].FSTLOWWIDETIME)
					tidedata.push([dateFL.setHours(dateFL.getHours()) ,arr[i].FSTLOWWIDEHEIGHT])
					let dateSH = new Date(datestring + ' ' + arr[i].SCDHIGHWIDETIME)
					tidedata.push([dateSH.setHours(dateSH.getHours()) ,arr[i].SCDHIGHWIDEHEIGHT])
					let dateSL = new Date(datestring + ' ' + arr[i].SCDLOWWIDETIME)
					tidedata.push([dateSL.setHours(dateSL.getHours()) ,arr[i].SCDLOWWIDEHEIGHT])
				}

				function SortByFirst (x, y) {
					return x[0] - y[0]
				}
				tidedata.sort(SortByFirst)

				return {
					xAxis: {
						type: 'time'
					},
					yAxis: {
						show: false
					},
					series: [{
						name: '潮汐',
						type: 'line',
						smooth: true,
						data: tidedata
					}]
				}
			}
		},
		onLoad() {
			this.loadWeather()
			this.loadWarning()
			this.loadAstronomicalTide()
		}
	}
</script>

<style>
	@import "../../common/uni.css";
	.content {
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.title {
		font-size: 36px;
		color: #8f8f94;
	}

	.uni-list-cell {
		justify-content: flex-start;
	}

	.uni-list-cell-db,
	.list-left {
		padding: 0 24px;
	}

	.uni-list-cell-db,
	.list-left {
		padding: 0 24px;
	}

	.index {
		padding-bottom: 1px;
	}

	.uni-card {
		box-shadow: none;
	}

	.uni-list:after {
		height: 0;
	}

	.uni-list:before {
		height: 0;
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

	.excellent {
		color: #52eb11;
	}

	.very {
		color: #267405;
	}

	.bad {
		color: #ff0000;
	}

	.sev {
		color: #be0606;
	}

	.chart {
		width: 500%;
		height: 400px;
	}
</style>
