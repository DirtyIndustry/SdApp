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
				<view class="chartcontainer">
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
			</view>
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
				optionJST: {
					tooltip: {},
					legend: {
						data:['销量']
					},
					xAxis: {
						data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				},
				optionYY: {},
				optionExp: {
					grid: {
						top: '4%',
						left: '0%',
						right: '2%',
						bottom: '20%',
						containLabel: true
					},
					xAxis: {
						type: 'time',
						axisLabel: {
							show: true,
							inside: true,
							rotate: 90,
							formatter: function (value, index) {
								let date = new Date(value)
								let texts = [(date.getMonth() + 1), date.getDate()];
								if (index === 0) {
									texts.unshift(date.getFullYear())
								}
								return '\n' + texts.join('-')
							}
						}
					},
					yAxis: {
						show: false,
						boundaryGap: ['20%', '20%']
					},
					series: [{
							name: '潮汐',
							type: 'line',
							smooth: true,
							silent: true,
							animation: false,
							symbolSize: 0,
							lineStyle: {
								color: '#1c8d3b',
								width: 1
							},
							data: [
								[1534780800000, 356],
								[1534784400000, 372],
								[1534785120000, 373],
								[1534788000000, 365],
								[1534791600000, 340],
								[1534795200000, 303],
								[1534798800000, 263],
								[1534802400000, 228],
								[1534806000000, 212],
								[1534806660000, 211],
								[1534809600000, 220],
								[1534813200000, 249],
								[1534816800000, 291],
								[1534820400000, 330],
								[1534824000000, 359],
								[1534827600000, 370],
								[1534827600000, 370],
								[1534831200000, 358],
								[1534834800000, 324],
								[1534838400000, 278],
								[1534842000000, 228],
								[1534845600000, 182],
								[1534849200000, 148],
								[1534852320000, 138],
								[1534852800000, 138],
								[1534856400000, 157],
								[1534860000000, 201],
								[1534863600000, 259],
								[1534867200000, 318],
								[1534870800000, 364],
								[1534874400000, 386],
								[1534875240000, 387],
								[1534878000000, 379],
								[1534881600000, 352],
								[1534885200000, 314],
								[1534888800000, 272],
								[1534892400000, 232],
								[1534896000000, 210],
								[1534897320000, 209],
								[1534899600000, 214],
								[1534903200000, 242],
								[1534906800000, 285],
								[1534910400000, 329],
								[1534914000000, 364],
								[1534917540000, 377],
								[1534917600000, 377],
								[1534921200000, 362],
								[1534924800000, 322],
								[1534928400000, 273],
								[1534932000000, 222],
								[1534935600000, 172],
								[1534939200000, 135],
								[1534942320000, 123],
								[1534942800000, 123],
								[1534946400000, 144],
								[1534950000000, 195],
								[1534953600000, 262],
								[1534957200000, 331],
								[1534960800000, 383],
								[1534964400000, 403],
								[1534964580000, 403],
								[1534968000000, 390],
								[1534971600000, 356],
								[1534975200000, 314],
								[1534978800000, 266],
								[1534982400000, 222],
								[1534986000000, 198],
								[1534987140000, 196],
								[1534989600000, 203],
								[1534993200000, 238],
								[1534996800000, 288],
								[1535000400000, 340],
								[1535004000000, 379],
								[1535006820000, 390],
								[1535007600000, 389],
								[1535011200000, 364],
								[1535014800000, 315],
								[1535018400000, 261],
								[1535022000000, 208],
								[1535025600000, 155],
								[1535029200000, 116],
								[1535031720000, 107],
								[1535032800000, 109],
								[1535036400000, 140]
							],
							markLine: {
								symbolSize: 0.1,
								silent: true,
								animation: false,
								label: {
									show: true,
									position: 'start',
									formatter: function (param) {
										return param.data.coord[1] + 'cm'
									},
								},
								lineStyle: {
									type: 'dot'
								},
								data: [
									[{
										coord: [1534785120000, 373]
									}, {
										coord: [1534785120000, 0]
									}],
									[{
										coord: [1534806660000, 211]
									}, {
										coord: [1534806660000, 0]
									}],
									[{
										coord: [1534827600000, 370]
									}, {
										coord: [1534827600000, 0]
									}],
									[{
										coord: [1534852320000, 138]
									}, {
										coord: [1534852320000, 0]
									}],
									[{
										coord: [1534875240000, 387]
									}, {
										coord: [1534875240000, 0]
									}],
									[{
										coord: [1534897320000, 209]
									}, {
										coord: [1534897320000, 0]
									}],
									[{
										coord: [1534917540000, 377]
									}, {
										coord: [1534917540000, 0]
									}],
									[{
										coord: [1534942320000, 123]
									}, {
										coord: [1534942320000, 0]
									}],
									[{
										coord: [1534964580000, 403]
									}, {
										coord: [1534964580000, 0]
									}],
									[{
										coord: [1534987140000, 196]
									}, {
										coord: [1534987140000, 0]
									}],
									[{
										coord: [1535006820000, 390]
									}, {
										coord: [1535006820000, 0]
									}],
									[{
										coord: [1535031720000, 107]
									}, {
										coord: [1535031720000, 0]
									}],
								]
							}
						},
						{
							name: '标线时间',
							type: 'line',
							markLine: {
								symbolSize: 0.1,
								opacity: 0,
								silent: true,
								animation: false,
								label: {
									show: true,
									position: 'end',
									formatter: function (param) {
										let date = new Date(param.data.coord[
											0
										])
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
								},
								lineStyle: {
									type: 'dot'
								},
								data: [
									[{
										coord: [1534785120000, 373]
									}, {
										coord: [1534785120000, 0]
									}],
									[{
										coord: [1534806660000, 211]
									}, {
										coord: [1534806660000, 0]
									}],
									[{
										coord: [1534827600000, 370]
									}, {
										coord: [1534827600000, 0]
									}],
									[{
										coord: [1534852320000, 138]
									}, {
										coord: [1534852320000, 0]
									}],
									[{
										coord: [1534875240000, 387]
									}, {
										coord: [1534875240000, 0]
									}],
									[{
										coord: [1534897320000, 209]
									}, {
										coord: [1534897320000, 0]
									}],
									[{
										coord: [1534917540000, 377]
									}, {
										coord: [1534917540000, 0]
									}],
									[{
										coord: [1534942320000, 123]
									}, {
										coord: [1534942320000, 0]
									}],
									[{
										coord: [1534964580000, 403]
									}, {
										coord: [1534964580000, 0]
									}],
									[{
										coord: [1534987140000, 196]
									}, {
										coord: [1534987140000, 0]
									}],
									[{
										coord: [1535006820000, 390]
									}, {
										coord: [1535006820000, 0]
									}],
									[{
										coord: [1535031720000, 107]
									}, {
										coord: [1535031720000, 0]
									}],
								]
							}
						},
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
								data: [{
										yAxis: 403
									},
									{
										yAxis: 107
									}
								]
							}
						}
					]
				},
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
					trdballLeft: false, // 第三个球是否位于左端
				},
				// 一浴日期球控制参数
				ballYY: {
					fstballActive: true,
					sndballActive: false,
					sndballMove: false,
					sndballLeft: false,
					trdballActive: false,
					trdballMove: false,
					trdballLeft: false,
				},
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
// 						setTimeout(function(){
// 							console.log('set data to option')
						if (chartJST !== undefined) {
							that.optionJST = that.setChartOption(arrJST)
						} else {
							console.log('delay option.')
							setTimeout(function(){that.optionJST=that.setChartOption(arrJST)}.bind(that), 500)
						}
							that.optionYY = that.setChartOption(arrYY)
						// }.bind(that), 5000)
					}, // end-success-request
				}) // end-request
			},
			deepEquals (x, y, layer) {
				if (layer > 6) {
					return
				}
				let head = ''
				for (let i = 0; i < layer; i++) {
					head += '  '
				}
				for (let attr in x) {
					if (x.hasOwnProperty(attr) & y.hasOwnProperty(attr)) {
						console.log(head + attr + ' : ' + x[attr])
						if (typeof x[attr] != 'string') {
							this.deepEquals(x[attr], y[attr], layer+1)
						}
					}
				}
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
				let max = 0 // 三天最高潮位数值
				let min = 0 // 三天最低潮位数值
				for (let i = 0; i < arr.length; i++) {
					// 一次循环为一天的数据
					// 初始日期时间
					let inittime = new Date(arr[i].PREDICTIONDATE)
					// 高低潮需要的日期字符串，必须在这里取值，后面的运算会改变inittime值
					let datestring = inittime.getFullYear() + '/' + (inittime.getMonth() + 1) + '/' + inittime.getDate()
					// 每小时数值 加入曲线数值表
					// 格式为[ [时间1, 数值1], [时间2, 数值2], ... ]
					tidedata.push([inittime.setHours(inittime.getHours()), Number(arr[i].H0)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H1)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H2)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H3)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H4)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H5)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H6)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H7)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H8)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H9)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H10)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H11)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H12)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H13)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H14)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H15)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H16)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H17)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H18)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H19)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H20)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H21)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H22)])
					tidedata.push([inittime.setHours(inittime.getHours() + 1), Number(arr[i].H23)])
					// 高低潮数值 加入曲线数值表和垂直标线数值表
					// 第一次高潮
					if (arr[i].FSTHIGHWIDETIME !== '-') {
						// 第一次高潮的日期时间
						let dateFH = new Date(datestring + ' ' + arr[i].FSTHIGHWIDETIME + ':00')
						// 第一次高潮曲线数据
						tidedata.push([dateFH.setHours(dateFH.getHours()), Number(arr[i].FSTHIGHWIDEHEIGHT)])
						// 第一次高潮垂直标线数据
						// 垂直标线数据格式为: [ [{coord: [横坐标1, 纵坐标起始值1]},{coord: [横坐标1, 纵坐标结束值1]}], [{coord: [横坐标2, 纵坐标起始值2]},{coord: [横坐标2, 纵坐标结束值2]}], ... ]
						let fh = [{
							coord: [dateFH.setHours(dateFH.getHours()), Number(arr[i].FSTHIGHWIDEHEIGHT)]
						}, {
							coord: [dateFH.setHours(dateFH.getHours()), 0]
						}]
						markdata.push(fh)
					}
					// 第一次低潮
					if (arr[i].FSTLOWWIDETIME !== '-') {
						// 第一次低潮的日期时间
						let dateFL = new Date(datestring + ' ' + arr[i].FSTLOWWIDETIME + ':00')
						// 第一次低潮的曲线数据
						tidedata.push([dateFL.setHours(dateFL.getHours()), Number(arr[i].FSTLOWWIDEHEIGHT)])
						// 第一次低潮的垂直标线数据
						let fl = [{
							coord: [dateFL.setHours(dateFL.getHours()), Number(arr[i].FSTLOWWIDEHEIGHT)]
						}, {
							coord: [dateFL.setHours(dateFL.getHours()), 0]
						}]
						markdata.push(fl)
					}
					// 第二次高潮
					if (arr[i].SCDHIGHWIDETIME !== '-') {
						// 第二次高潮的日期时间
						let dateSH = new Date(datestring + ' ' + arr[i].SCDHIGHWIDETIME + ':00')
						// 第二次高潮的曲线数据
						tidedata.push([dateSH.setHours(dateSH.getHours()), Number(arr[i].SCDHIGHWIDEHEIGHT)])
						// 第二次高潮的垂直标线数据
						let sh = [{
							coord: [dateSH.setHours(dateSH.getHours()), Number(arr[i].SCDHIGHWIDEHEIGHT)]
						}, {
							coord: [dateSH.setHours(dateSH.getHours()), 0]
						}]
						markdata.push(sh)
					}
					// 第二次低潮
					if (arr[i].SCDLOWWIDETIME !== '-') {
						// 第二次低潮的日期时间
						let dateSL = new Date(datestring + ' ' + arr[i].SCDLOWWIDETIME + ':00')
						// 第二次低潮的曲线数据
						tidedata.push([dateSL.setHours(dateSL.getHours()), Number(arr[i].SCDLOWWIDEHEIGHT)])
						// 第二次低潮的垂直标线数据
						let sl = [{
							coord: [dateSL.setHours(dateSL.getHours()), Number(arr[i].SCDLOWWIDEHEIGHT)]
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
				
				function clone (obj) {
					if (null == obj || "object" != typeof obj) return obj
					let copy = obj.constructor();
					for (let attr in obj) {
						if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
					}
					return copy
				}
				
				// 数据准备完毕，生成并返回echarts用option
				let option = {
					grid: {
						top: '4%',
						left: '0%',
						right: '2%',
						bottom: '20%',
						containLabel: true
					},
					xAxis: {
						type: 'time',
						axisLabel: { 
							show: true,
							inside: true,
							rotate: 90,
							formatter: function (value, index) {
								let date = new Date(value)
								let texts = [(date.getMonth() + 1), date.getDate()];
								if (index === 0) {
									texts.unshift(date.getFullYear())
								}
								return '\n' + texts.join('-')
							}
						}
					},
					yAxis: {
						show: false,
						boundaryGap: ['20%', '20%']
					},
					series: [
						{
							name: '潮汐',
							type: 'line',
							smooth: true,
							silent: true,
							animation: false,
							symbolSize: 0, 
							lineStyle: {
								color: '#1c8d3b', 
								width: 1 
							},
							data: tidedata,
							markLine: {
								symbolSize: 0.1, 
								silent: true,
								animation: false,
								label: {
									show: true,
									position: 'start',
									formatter: function (param) {
										return param.data.coord[1] + 'cm'
									},
								},
								lineStyle: {
									type: 'dot'
								},
								data: markdata
							}
						},
						{
							name: '标线时间',
							type: 'line',
							markLine: {
								symbolSize: 0.1,
								opacity: 0, 
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
								}, 
								lineStyle: {
									type: 'dot'
								},
								data: markdata
							} 
						},
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
								data: [{yAxis: max}, {yAxis: min}]
							}
						}
					]
				} // end-option
				return option
			},
			// 初始化金沙滩图表
			handleInitJST(canvas, width, height) {
				chartJST = echarts.init(canvas, null, {
						width: width,
						height: height
					}),
					canvas.setChart(chartJST)
				chartJST.setOption(this.optionJST) // TODO: exp
				return chartJST
			},
			// 初始化一浴图表
			handleInitYY(canvas, width, height) {
				chartYY = echarts.init(canvas, null, {
						width: width,
						height: height
					}),
					canvas.setChart(chartYY)
				chartYY.setOption(this.optionExp) //TODO: exp
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
				} else if (scrollLeft < this.systemInfo.windowWidth) { // 第二个球停在最左边 第三个球还没开始动
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
		}, // end-methods
		watch: {
			optionJST: {
				handler(newVal, oldVal) {
					if (chartJST) {
						if (newVal) {
							chartJST.setOption(newVal)
						} else {
							chartJST.setOption(oldVal)
						}
					} else {
						this.handleInitJST()
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
</style>
