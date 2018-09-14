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
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view class="header">{{cityName}}地区预报</view>
			<view style="height: 20px;" />
			<!-- #endif -->
			<!-- 天气预报模块 -->
			<view class="page-section">
				<realtimeWeather :weatherData="weatherData" />
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
	import realtimeWeather from '../../components/realtimeWeather.vue'
	import myPicker from '../../components/myPicker.vue'
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'

	let chartFiveday

	export default {
		components: {
			weatherSection,
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
				utils.loadShandongData(city, this.weatherData, this.tideData, this.inshoreData, this.bathsData, this.refinedData, this.fivedayData, this.weihaiData, this.completedRequestCount)
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

				// 10秒后关闭toast
				setTimeout(function () {
					uni.hideLoading()
				}.bind(this), 10000)
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
		},
		onNavigationBarButtonTap() {
			console.log('navibar button tapped.')
			this.$refs.citypicker.switchDialog()
		}
	}
</script>

<style scoped>
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

	.header {
		/* background-color: #fff; */
		left: 0;
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		color: #0092d4;
		font-size: 37px;
		font-weight: bold;
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