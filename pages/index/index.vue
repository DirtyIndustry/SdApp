<template>
	<view>
		<view class="page-body">
			<!-- 地区选择模块 -->
			<view class="page-section">
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
			<!-- 天气预报模块 -->
			<view class="page-section">
				<view class="uni-flex uni-row">
					<!-- 城市气温 -->
					<view class="text" style="width: 200px;height: 220px;display: flex; justify-content: center;align-items: center;">
						{{weatherData.temperature}}℃
					</view>
					<view class="uni-flex uni-column" style="flex: 1;justify-content: space-between;">
						<!-- 城市天气 -->
						<view class="text" style="height: 120px;text-align: left;padding-left: 20px;padding-top: 10px;">
							<image :src="weatherData.weatherIcon" style="width: 50px;height: 50px;" /> {{weatherData.weather}}
						</view>
						<view class="uni-flex uni-row">
							<!-- 城市空气质量 -->
							<view class="text" style="flex: 1;">
								<image :src="weatherData.airconIcon" style="width: 30px;height: 30px;" /> {{weatherData.aircondition}} {{weatherData.airconDesc}}
							</view>
							<!-- 城市pm2.5 -->
							<view class="text" style="flex: 1;">
								<text v-bind:class="weatherData.pm25Style">PM2.5</text>
								{{weatherData.pm25}}
							</view>
						</view>
					</view>
				</view>
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
			<view class="page-section">
				<!-- 金沙滩 -->
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="chart">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitJST" canvasId="canvasJST"></mpvue-echarts>
					</view>
				</scroll-view>
			</view>
			<!-- 第一海水浴场 -->
			<view class="page-section">
				<text>第二个图表</text>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="chart">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitYY" canvasId="canvasYY"></mpvue-echarts>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	//TODO: watch chart option的变化，更新chart
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chartJST, chartYY // 金沙滩和一浴的图表

	export default {
		components: {
			mpvueEcharts
		},
		data() {
			return {
				// 城市列表
				array: ['青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
				// 天气数据
				weatherData: {
					temperature: '25',	// 气温
					aircondition: '35',	// 空气质量
					airconDesc: '优',
					airconIcon: '../../static/Images/right_leaf_sev.png', // 空气质量绿叶图标
					weather: '晴',
					weatherIcon: '../../static/Images/right_weather_fine.png', // 天气图表
					pm25: '8',					// PM2.5
					pm25Style: 'good'
				},
				// 警报数据
				warningData: {
					typhoonWarning: '',
					waveWarning: ''
				},
				// 金沙滩和一浴图表数据
				optionJST: {},
				optionYY: {},
				echarts
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
					} // end-success-request
				}) // end-request
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
				} // end-switch (weather)
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
				} // end-switch (airconDesc)
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
						// TODO： 接口返回值改为json格式
						// 字符串用#,分割
						let typhoonlist = res.data.d.toString().split('#,')
						// 获取列表中最后一个（最新）台风的详细信息
						// 数组[台风编号，台风中文名，台风英文名]
						let lasttyphoon = typhoonlist[typhoonlist.length - 1].split(',')
						// 请求last typhoon详情数据
						uni.request({
							url: 'http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonPath',
							data: {
								areaflg: '青岛',
								typhoonNumber: lasttyphoon[0] // 台风编号
							},
							method: 'POST',
							success: function (res2) {
								console.log('成功获取台风详情')
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
							} // end-success-request
						}) // end-request 请求服务器台风详情
					} // end-success-request
				}) // end-request 请求服务器台风列表
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
					} // end-success-request
				}) // end-request 请求海浪预警
			},
			// 读取服务器潮汐预报
			loadAstronomicalTide() {
				let that = this
				uni.request({
					url: 'http://123.234.129.238:8001/MyWebService.asmx/GetAstronomicalTide_QD',
					data: {
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取潮汐预报数据')
						// STATION 101wmt为金沙滩 102xmd为第一海水浴场
						let resarr = JSON.parse(res.data.d)
						let arrJST = []	// 金沙滩三日数据数组
						let arrYY = []	//一浴三日数据数组
						// 遍历接口返回值，依据STATION将数据放入以上两个数组中
						for (let i = 0; i < 6; i++) {
							if (resarr[i].STATION === '101wmt') {
								arrJST.push(resarr[i])
							} else if (resarr[i].STATION === '102xmd') {
								arrYY.push(resarr[i])
							}
						} // end-for
						// 由数组生成echarts所需的option
						that.optionJST = that.setChartOption(arrJST)
						that.optionYY = that.setChartOption(arrYY)
					} // end-success-request
				}) // end-request
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
				let tidedata = [] // 曲线用的数值集
				let markdata = [] // 最高最低潮竖直标线用的数值集
				let max = 0			// 三天最高潮位数值
				let min = 0			// 三天最低潮位数值
				for (let i = 0; i < arr.length; i++) {
					// 一次循环为一天的数据
					// 初始日期时间
					let inittime = new Date(arr[i].PREDICTIONDATE)
					// 高低潮需要的日期字符串，必须在这里取值，后面的运算会改变inittime值
					let datestring = inittime.getFullYear() + '-' + (inittime.getMonth() + 1) + '-' + inittime.getDate()
					// 每小时数值 加入曲线数值表
					// 格式为[ [时间1, 数值1], [时间2, 数值2], ... ]
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
					// 高低潮数值 加入曲线数值表和垂直标线数值表
					// 第一次高潮
					if (arr[i].FSTHIGHWIDETIME !== '-') {
						// 第一次高潮的日期时间
						let dateFH = new Date(datestring + ' ' + arr[i].FSTHIGHWIDETIME)
						// 第一次高潮曲线数据
						tidedata.push([dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT])
						// 第一次高潮垂直标线数据
						// 垂直标线数据格式为: [ [{coord: [横坐标1, 纵坐标起始值1]},{coord: [横坐标1, 纵坐标结束值1]}], [{coord: [横坐标2, 纵坐标起始值2]},{coord: [横坐标2, 纵坐标结束值2]}], ... ]
						let fh = [{
							coord: [dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT]
						}, {
							coord: [dateFH.setHours(dateFH.getHours()), 0]
						}]
						markdata.push(fh)
					}
					// 第一次低潮
					if (arr[i].FSTLOWWIDETIME !== '-') {
						// 第一次低潮的日期时间
						let dateFL = new Date(datestring + ' ' + arr[i].FSTLOWWIDETIME)
						// 第一次低潮的曲线数据
						tidedata.push([dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT])
						// 第一次低潮的垂直标线数据
						let fl = [{
							coord: [dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT]
						}, {
							coord: [dateFL.setHours(dateFL.getHours()), 0]
						}]
						markdata.push(fl)
					}
					// 第二次高潮
					if (arr[i].SCDHIGHWIDETIME !== '-') {
						// 第二次高潮的日期时间
						let dateSH = new Date(datestring + ' ' + arr[i].SCDHIGHWIDETIME)
						// 第二次高潮的曲线数据
						tidedata.push([dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT])
						// 第二次高潮的垂直标线数据
						let sh = [{
							coord: [dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT]
						}, {
							coord: [dateSH.setHours(dateSH.getHours()), 0]
						}]
						markdata.push(sh)
					}
					// 第二次低潮
					if (arr[i].SCDLOWWIDETIME !== '-') {
						// 第二次低潮的日期时间
						let dateSL = new Date(datestring + ' ' + arr[i].SCDLOWWIDETIME)
						// 第二次低潮的曲线数据
						tidedata.push([dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT])
						// 第二次低潮的垂直标线数据
						let sl = [{
							coord: [dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT]
						}, {
							coord: [dateSL.setHours(dateSL.getHours()), 0]
						}]
						markdata.push(sl)
					}
					// 计算今天的最高潮位 并与已有的max值比较 将最大值存入max用于水平标线
					let firstH = Number(arr[i].FSTHIGHWIDEHEIGHT)
					let secondH = Number(arr[i].SCDHIGHWIDEHEIGHT)
					if (firstH > secondH) { // 如果First比较大
						if (firstH > max) {
							max = firstH
						}
					} else { // 如果Second比较大
						if (secondH > max) {
							max = secondH
						}
					}
					// 计算今天的最低潮位 并于已有的min值比较 将最小值存入min用于水平标线
					let firstL = Number(arr[i].FSTLOWWIDEHEIGHT)
					let secondL = Number(arr[i].SCDLOWWIDEHEIGHT)
					if (firstL < secondL) { // 如果First比较小
						if (firstL < min || min === 0) {
							min = firstL
						}
					} else { // 如果Second比较小
						if (secondL < min || min === 0) {
							min = secondL
						}
					}
				} // end-for
				// 排序曲线数据集
				function SortByFirst(x, y) {
					return x[0] - y[0]
				}
				tidedata.sort(SortByFirst)
				//markdata.sort(SortByFirst)
				// 数据准备完毕，生成并返回echarts用option
				return {
					// 图表距离外围div的padding
					grid: {
						top: '4%',
						left: '0%',
						right: '2%',
						bottom: '20%',
						containLabel: true
					},
					// 横坐标周
					xAxis: {
						type: 'time',
						axisLabel: { // 不显示横坐标刻度数值
							show: false
						}
					},
					yAxis: {
						show: false,
						boundaryGap: ['20%', '20%']
					},
					series: [
						// 第一组series： 曲线数据 + 高低潮垂直标线 + 标线顶部数字label
						{
							name: '潮汐',
							type: 'line',
							smooth: true,
							silent: true,
							animation: false,
							symbolSize: 0, // 曲线上数据点小圆圈的大小
							lineStyle: {
								//type: 'solid',
								color: '#1c8d3b', // 曲线颜色
								width: 1					// 曲线粗细
							},
							data: tidedata,
							markLine: {
								symbolSize: 0.1,	// 垂直标线一端的箭头 和数据label的大小， 不能设为0否则label不显示
								silent: true,
								animation: false,
								label: {
									show: true,
									position: 'start',
									formatter: function (param) {
										return param.data.coord[1] + 'cm'
									},
									/*
									textStyle: {
										color: '#000000',
									}
									*/
								}, // end-label-markLine
								lineStyle: {
									type: 'dot'
								},
								data: markdata
							}
						},
						// 第二组series: 高低潮垂直标线（透明度为0） + 标线底部时间label
						{
							name: '标线日期',
							type: 'line',
							markLine: {
								symbolSize: 0.1,
								opacity: 0, // 透明度为0 不渲染这条标线
								silent: true,
								animation: false,
								label: {
									show: true,
									position: 'end',
									formatter: function (param) {
										let date = new Date(param.data.coord[0])
										let hour = date.getHours()
										if (hour < 10) {
											hour = '0' + hour
										}
										let minute = date.getMinutes()
										if (minute < 10) {
											minute = '0' + minute
										}
										return hour + ':' + minute
									},
									/*
									textStyle: {
										color: '#000000',
									}
									*/
								}, // end-label-markLine
								lineStyle: {
									type: 'dot'
								},
								data: markdata
							} // end-markLine
						},
						// 第三组series： 两条水平标线 表示三天最高和最低的潮位
						{
							name: '最值横线',
							type: 'line',
							markLine: {
								symbolSize: 0,
								silent: true,
								animation: false,
								lineStyle: {
									type: 'dot'
								},
								label: {
									show: false
								},
								data: [
									{yAxis: max},
									{yAxis: min}
								]
							} // end-markLine
						}
					] // end-series
				} // end-return
			},
			// 初始化金沙滩图表
			handleInitJST(canvas, width, height) {
				chartJST = echarts.init(canvas, null, {
						width: width,
						height: height
					}),
					canvas.setChart(chartJST)
				chartJST.setOption(this.optionJST)
				return chartJST
			},
			// 初始化一浴图表
			handleInitYY(canvas, width, height) {
				chartYY = echarts.init(canvas, null, {
						width: width,
						height: height
					}),
					canvas.setChart(chartYY)
				chartYY.setOption(this.optionYY)
				return chartYY
			},
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
		width: 290%;
		height: 250px;
		border: 1px solid #000000;
	}
</style>
