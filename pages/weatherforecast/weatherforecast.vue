<template>
	<!-- <view style="background-image: url(../../static/Images/back_images.jpg); background-repeat: no-repeat; background-size: contain; background-attachment: scroll;"> -->
	<view>
		<myPicker ref="citypicker" :items="cityArray" @itemSelected="mypickerSelect"></myPicker>
		<view class="page-body">
			<image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"
			/>
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
			<!-- 天气预报模块 -->
			<view class="page-section">
				<realtimeWeather :weatherData="weatherData" />
			</view>
			<!-- 五日天气预报 -->
			<view class="page-section">
				<view class="fiveday-body section-body">
					<view class="uni-flex uni-row">
						<!-- 依据fivedayWeather生成列 -->
						<view class="fiveday-column uni-flex uni-column" :class="{'fiveday-column-left': index < 4}" v-for="(item, index) in fivedayData.fivedayWeather"
							:key="index">
							<!-- 自上而下分别为 周，日期，天气，天气图标，折线空格，风向，风力 -->
							<view class="flex-cell-single">{{item.week}}</view>
							<view class="flex-cell-single">{{item.date}}</view>
							<view class="flex-cell-single">{{item.weather}}</view>
							<view class="flex-cell-single">
								<image :src="item.weatherIcon" mode="widthFix" style="width: 50upx; height: 50upx" />
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
			<view class="separator" />
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import realtimeWeather from '../../components/realtimeWeather.vue'
	import myPicker from '../../components/myPicker.vue'
	import * as echarts from '../../components/echarts/echarts.common.min.js'
	import mpvueEcharts from '../../components/mpvue-echarts/src/echarts.vue'

	let chartFiveday

	export default {
		components: {
			realtimeWeather,
			myPicker,
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
						// 判断月份和城市
						if (new Date().getMonth() > 5 & new Date().getMonth() < 9 & cityname === '青岛') {
							that.bathsData.showBaths = true
						} else {
							that.bathsData.showBaths = false
						}
						// 写入Vuex
						that.bathsData.data = res.bathsDatas

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
			// 初始化高低温图表
			handleInitFiveday(canvas, width, height) {
				chartFiveday = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(chartFiveday)
				chartFiveday.setOption(this.fivedayData.optionFiveday, true)
				return chartFiveday
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
			},
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
		},
		onReady() {
			console.log('weatherforecast page ready.')
		},
		mounted() {
			console.log('weatherforecast vue mounted.')
		},
		onPullDownRefresh() {
			console.log('[界面]: 天气预报 下拉刷新')
			this.requestData(this.cityName)
		},
		onNavigationBarButtonTap() {
			this.$refs.citypicker.switchDialog()
		}
	}
</script>

<style scoped>
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

	/* 潮汐预报曲线图的容器 必须设置宽度和高度 */
	.chart-tide {
		width: 290%;
		height: 250upx;
		border: 1upx solid #000;
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
		height: 600upx;
	}

	/* 5日天气预报非最右边的列 添加右边框 */
	.fiveday-column-left {
		border-right: 1upx solid #000000;
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
		height: 235upx;
		top: 240upx;
		position: absolute;
	}
</style>