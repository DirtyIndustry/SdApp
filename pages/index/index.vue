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
							<image :src="weatherData.weatherIcon" mode="widthFix" style="width: 50px;" /> {{weatherData.weather}}
						</view>
						<view class="uni-flex uni-row">
							<!-- 城市空气质量 -->
							<view class="text" style="flex: 1;">
								<image :src="weatherData.airconIcon" mode="widthFix" style="width: 30px;" /> {{weatherData.aircondition}} {{weatherData.airconDesc}}
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
			<!-- 金沙滩 -->
			<view class="page-section">
				<text>金沙滩</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollJST">
					<view class="chart">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitJST" canvasId="canvasJST" ref="echartsJST"></mpvue-echarts>
					</view>
					<!-- 滑动的日期球，Move属性决定球是否显示 -->
					<view class="balltrack">
						<view class="dateball slideball-Snd" v-show="ballJST.sndballMove">{{sndballText}}</view>
						<view class="dateball slideball-Trd" v-show="ballJST.trdballMove">{{trdballText}}</view>
					</view>
				</scroll-view>
				<!-- 固定在两端的日期球
				Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
				特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
				<view class="balltrack-fix">
					<view class="dateball fixball-Fst" :class="{'dateball-active': ballJST.fstballActive}">{{fstballText}}</view>
					<view class="dateball fixball-Snd" :class="{'dateball-active': ballJST.sndballActive, 'fixball-Snd-left': ballJST.sndballLeft}"
					 v-show="!ballJST.sndballMove">{{sndballText}}</view>
					<view class="dateball fixball-Trd" :class="{'dateball-active': ballJST.trdballActive, 'fixball-Trd-lone': ballJST.sndballMove, 'fixball-Trd-left': ballJST.trdballLeft}"
					 v-show="!ballJST.trdballMove">{{trdballText}}</view>
				</view>
			</view>
			<!-- 第一海水浴场 -->
			<view class="page-section">
				<text>第一海水浴场</text>
				<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scrollYY">
					<view class="chart">
						<mpvue-echarts :echarts="echarts" :onInit="handleInitYY" canvasId="canvasYY"></mpvue-echarts>
					</view>
					<!-- 滑动的日期球，Move属性决定球是否显示 -->
					<view class="balltrack">
						<view class="dateball slideball-Snd" v-show="ballYY.sndballMove">{{sndballText}}</view>
						<view class="dateball slideball-Trd" v-show="ballYY.trdballMove">{{trdballText}}</view>
					</view>
				</scroll-view>
				<!-- 固定在两端的日期球
					Active属性决定球的颜色，Move属性决定球是否显示，Left属性决定球是否在左边
					特别的： 第二个球Move时，第三个球需要用lone属性调整位置 -->
				<view class="balltrack-fix">
					<view class="dateball fixball-Fst" :class="{'dateball-active': ballYY.fstballActive}">{{fstballText}}</view>
					<view class="dateball fixball-Snd" :class="{'dateball-active': ballYY.sndballActive, 'fixball-Snd-left': ballYY.sndballLeft}"
					 v-show="!ballYY.sndballMove">{{sndballText}}</view>
					<view class="dateball fixball-Trd" :class="{'dateball-active': ballYY.trdballActive, 'fixball-Trd-lone': ballYY.sndballMove, 'fixball-Trd-left': ballYY.trdballLeft}"
					 v-show="!ballYY.trdballMove">{{trdballText}}</view>
				</view>
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section">
				<view class="uni-flex uni-row">
					<!-- 依据fivedayWeather生成列 -->
					<view class="fiveday-column fiveday-column-left uni-flex uni-column" v-for="(item, index) in fivedayWeather" :key="index">
						<view class="flex-cell-single">{{item.week}}</view>
						<view class="flex-cell-single">{{item.date}}</view>
						<view class="flex-cell-single">{{item.weather}}</view>
						<view class="flex-cell-single">
							<image :src="item.weatherIcon" mode="widthFix" class="image-icon" />
						</view>
						<view class="flex-cell-quad"> </view>
						<view class="flex-cell-single">{{item.windDir}}</view>
						<view class="flex-cell-single">{{item.windLvl}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
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
				// 金沙滩和一浴图表数据
				optionJST: {},
				optionYY: {},
				// 日期球的日期文字
				fstballText: '1st',
				sndballText: '2nd',
				trdballText: '3rd',
				// 金沙滩日期球控制参数
				ballJST: {
					fstballActive: true, // 第一个球是否激活（显示为蓝色）
					sndballActive: false, // 第二个球是否激活（显示为蓝色）
					sndballMove: false, // 第二个球是否滑动
					sndballLeft: false, // 第二个球是否位于左端
					trdballActive: false, // 第三个球是否激活（显示为蓝色）
					trdballMove: false, // 第三个球是否滑动
					trdballLeft: false // 第三个球是否位于左端
				},
				// 一浴日期球控制参数
				ballYY: {
					fstballActive: true,
					sndballActive: false,
					sndballMove: false,
					sndballLeft: false,
					trdballActive: false,
					trdballMove: false,
					trdballLeft: false
				},
				fivedayWeather: [],
				fivedayHighTemp: [],
				fivedayLowTemp: [],
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
				this.index = e.target.value
				this.setLocation(e.target.value)
				this.loadWeather()
			},
			// 读取服务器天气数据
			loadWeather() {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetCityWeather',
					data: {
						weather: that.array[that.location],
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
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
						// 天气图标
						that.weatherData.weatherIcon = utils.setWeatherIcon(
							that.weatherData.weather
						)
						// 空气质量图标及pm2.5字体颜色
						that.weatherData.airconIcon = utils.setAirconIcon(that.weatherData.airconDesc)
						that.weatherData.pm25Style = utils.setAirconClass(that.weatherData.airconDesc)
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
					} // end-success-request
				}) // end-request
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
					url: appsettings.hosturl + 'GetEachWarning_ceshi',
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
					url: appsettings.hosturl + 'GetAstronomicalTide_QD',
					data: {
						name: 'admin',
						areaflg: '山东'
					},
					method: 'POST',
					success: function (res) {
						console.log('成功获取潮汐预报数据')
						// STATION 101wmt为金沙滩 102xmd为第一海水浴场
						let resarr = JSON.parse(res.data.d)
						let arrJST = [] // 金沙滩三日数据数组
						let arrYY = [] //一浴三日数据数组
						// 遍历接口返回值，依据STATION将数据放入以上两个数组中
						for (let i = 0; i < 6; i++) {
							if (resarr[i].STATION === '101wmt') {
								arrJST.push(resarr[i])
							} else if (resarr[i].STATION === '102xmd') {
								arrYY.push(resarr[i])
							}
						} // end-for
						// 由数组生成echarts所需的option
						that.optionJST = utils.setChartOption(arrJST)
						that.optionYY = utils.setChartOption(arrYY)
					} // end-success-request
				}) // end-request
			},
			// 初始化金沙滩图表
			handleInitJST(canvas, width, height) {
				(chartJST = echarts.init(canvas, null, {
					width: width,
					height: height
				})),
					canvas.setChart(chartJST)
				chartJST.setOption(this.optionJST)
				return chartJST
			},
			// 初始化一浴图表
			handleInitYY(canvas, width, height) {
				(chartYY = echarts.init(canvas, null, {
					width: width,
					height: height
				})),
					canvas.setChart(chartYY)
				chartYY.setOption(this.optionYY)
				return chartYY
			},
			// 金沙滩图表滚动事件
			scrollJST(e) {
				this.setDateballStatus(e.detail.scrollLeft, this.ballJST)
			},
			// 一浴图表滚动事件
			scrollYY(e) {
				this.setDateballStatus(e.detail.scrollLeft, this.ballYY)
			},
			// 设置日期球的状态 scrollLeft为滚动距最左边的距离，ballObj为包含一系列bool值的object
			setDateballStatus(scrollLeft, ballObj) {
				//开始滚动 scrollLeft为0
				if (scrollLeft < 50) {
					// 刚开始滚动 还不足以让第二个球开始动
					ballObj.fstballActive = true
					ballObj.sndballActive = false
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = false
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth - 45) {
					// 第二个球开始动
					ballObj.fstballActive = true
					ballObj.sndballActive = false
					ballObj.trdballActive = false
					ballObj.sndballMove = true
					ballObj.sndballLeft = false
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth) {
					// 第二个球停在最左边 第三个球还没开始动
					ballObj.fstballActive = false
					ballObj.sndballActive = true
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = false
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth + 9) {
					// 第三个球开始动
					ballObj.fstballActive = false
					ballObj.sndballActive = true
					ballObj.trdballActive = false
					ballObj.sndballMove = false
					ballObj.sndballLeft = true
					ballObj.trdballMove = true
					ballObj.trdballLeft = false
				} else if (scrollLeft < this.systemInfo.windowWidth + 270) {
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
			// 设置曲线图下方日期球的日期
			setDateballText() {
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
			// 金沙滩option
			optionJST: {
				handler(newVal, oldVal) {
					if (chartJST !== undefined) {
						if (newVal) {
							chartJST.setOption(newVal)
						}
					}
				}
			},
			// 一浴option
			optionYY: {
				handler(newVal, oldVal) {
					if (chartYY !== undefined) {
						if (newVal) {
							chartYY.setOption(newVal)
						}
					}
				}
			}
		},
		onLoad() {
			this.loadWeather()
			this.loadWarning()
			this.setDateballText()
		},
		onReady() {
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

	.image-icon {
		width: 50px;
	}
</style>