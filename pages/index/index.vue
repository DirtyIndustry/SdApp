<template>
	<!-- <view style="background-image: url(../../static/Images/back_images.jpg); background-repeat: no-repeat; background-size: contain; background-attachment: scroll;"> -->
	<view>
		<myPicker ref="citypicker" :items="cityArray" @itemSelected="mypickerSelect"></myPicker>
		<view class="page-body">
			<image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;" />
			<!-- 地区选择模块 -->
			<weixinCityPicker :cityName="cityName" :cityIndex="cityIndex" :cityArray="cityArray" @change="bindPickerChange" />
			<!-- 天气预报模块 -->
			<view class="page-section">
				<realtimeWeather :weatherData="weatherData" />
			</view>
			<view class="separator" />
			<!-- 警报模块 -->
			<view class="page-section">
				<warningSection :typhoon="warningData.typhoonWarning" :wave="warningData.waveWarning" @typhoonTap="typhoonWarningTap"
				 @waveTap="waveWarningTap" />
			</view>
			<view class="separator" />
			<!-- 潮汐预报模块 -->
			<view class="page-section">
				<tableTitle title="潮汐预报" icon="../../static/Images/top_left_img_new.png" />
				<view class="section-body">
					<!-- 第一个图表 -->
					<tideChart :option="tideData.optionTideOne" :title="tideData.chartTideOneTitle" canvasId="tideOne" />
					<!-- 第二个图表 只在青岛地区显示 -->
					<view :class="{hide: !tideData.chartTideTwoShow}">
						<tideChart :option="tideData.optionTideTwo" :title="tideData.chartTideTwoTitle" canvasId="tideTwo" />
					</view>
				</view>
			</view>
			<view class="separator" />
			<!-- 近海预报 -->
			<view class="page-section">
				<tableTitle :title="inshoreData.location" :date="inshoreData.timeupper" icon="../../static/Images/top_left_img_newS.png" />
				<view class="section-body">
					<inshoreTableNew :inshoreData="inshoreData" />
				</view>
			</view>
			<!-- 浴场预报 -->
			<view class="page-section" v-if="bathsData.showBaths">
				<view class="separator" />
				<tableTitle title="浴场预报" :date="bathsData.time" icon="../../static/Images/top_left_img_newS.png" />
				<view class="section-body">
					<bathsTable :bathsData="bathsData.data" />
				</view>
			</view>
			<!-- 精细化预报 -->
			<view class="page-section" v-show="refinedData.show">
				<view class="separator" />
				<view class="section-body">
					<refinedChartAlt :option="refinedData.optionOne" :data="refinedData.dataOne" canvasId="refinedOne" />
					<!-- 两个图表之间的空白 -->
					<view class="separator" v-if="refinedData.showTwo" />
					<view v-show="refinedData.showTwo">
						<refinedChartAlt :option="refinedData.optionTwo" :data="refinedData.dataTwo" canvasId="refinedTwo" />
					</view>
				</view>
			</view>
			<view class="separator" />
			<!-- 五日天气预报 -->
			<view class="page-section">
				<tableTitle title="天气预报" />
				<view class="section-body">
					<fivedayForcast :option="fivedayData.optionFiveday" :fivedayWeather="fivedayData.fivedayWeather" canvasId="fiveday" />
				</view>
			</view>
			<view class="separator" />
		</view>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	import myPicker from '../../components/myPicker.vue'
	import weixinCityPicker from '../../components/weixinCityPicker.vue'
	import tableTitle from '../../components/tableTitle.vue'
	import realtimeWeather from '../../components/realtimeWeather.vue'
	import warningSection from '../../components/warningSection.vue'
	import tideChart from '../../components/tideChart.vue'
	import inshoreTableNew from '../../components/inshoreTableNew.vue'
	import bathsTable from '../../components/bathsTable.vue'
	import refinedChartAlt from '../../components/refinedChartAlt.vue'
	import fivedayForcast from '../../components/fivedayForcast.vue'

	export default {
		components: {
			myPicker,
			weixinCityPicker,
			tableTitle,
			realtimeWeather,
			warningSection,
			tideChart,
			inshoreTableNew,
			bathsTable,
			refinedChartAlt,
			fivedayForcast
		},
		data() {
			return {
				// 完成的request计数
				completedRequestCount: 0,

				// 警报数据
				warningData: {
					typhoonWarning: '',
					waveWarning: '',
					waveUrl: ''
				}
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
				get() { return this.$store.state.Datas.weihaidata },
				set(value) { this.$store.dispatch('setWeihaiData', value) }
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
			// 请求服务器数据
			requestData(city) {
				// 任务计数器归零
				this.completedRequestCount = 0
				this.setPageLayout(city)
				this.loadAlarmData()
				this.loadShandongData(city)
			},
			// 请求服务器警报数据
			loadAlarmData () {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetAlarm ',
					data: {name: 'admin', areaflg: '山东'},
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 警报数据')
						// 判断返回数据有效性
						if (!res.data.d | res.data.d === '无权访问该接口' | res.data.d === '无该地区数据') { // 返回的值为空
							console.log('[服务器]: 返回 警报数据 返回值为空')
							return false
						}
						let resdata = JSON.parse(res.data.d)
						if (resdata.Typhoon.NUMBER !== '') {
							console.log('[服务器]: 有台风警报')
							let nowdate = new Date()
							that.warningData.typhoonWarning = nowdate.getFullYear() + '年' + (nowdate.getMonth() + 1) + '月' + nowdate.getDate() + '日, ' +
								resdata.Typhoon.NUMBER +
								'号台风"' +
								resdata.Typhoon.CHN_NAME +
								'(' +
								resdata.Typhoon.ENG_NAME +
								')"正在接近……'
						}
						if (resdata.Ocean.length > 0) {
							console.log('[服务器]: 有海洋警报')
							let name = resdata.Ocean[resdata.Ocean.length - 1].name
							let date = resdata.Ocean[resdata.Ocean.length - 1].datetime
							let url = resdata.Ocean[resdata.Ocean.length - 1].Url
							that.warningData.waveWarning = name + ',' + date + '……'
							that.warningData.waveUrl = url
						}
					}, // end-success
					fail: function () {
						console.log('[服务器]: 请求 警报数据 失败')
					},
					complete: function () {
						that.completedRequestCount++
					}
				})
			},
			// 请求山东预报数据 包括天气 潮汐 近海 浴场 精细化 五日 威海专项
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
						// 处理数据
						utils.getShandongData(res)
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
			// 台风警报点击
			typhoonWarningTap() {
				console.log('[界面]: 点击台风警报')
				uni.navigateTo({
					url: '../typhoonmap/typhoonmap'
				})
			},
			// 海浪警报点击
			waveWarningTap() {
				console.log('[界面]: 点击海浪警报')
				let that = this
				uni.navigateTo({
					url: '../warningdetail/warningdetail?data=' + that.warningData.waveUrl
				})
			}
		}, // end-methods
		watch: {
			// 完成的request
			completedRequestCount: {
				handler(newVal, oldVal) {
					// 服务器请求任务的总数
					if (newVal === 2) {
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				}
			}
		},
		onLoad() {
			console.log('index page onload.')
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.completedRequestCount = 1
			this.loadAlarmData()
		},
		onReady() {
			console.log('index page ready.')
		},
		mounted() {
			console.log('index vue mounted.')
		},
		onPullDownRefresh() {
			console.log('[界面]: 首页 下拉刷新')
			this.requestData(this.cityName)
		},
		onNavigationBarButtonTap() {
			this.$refs.citypicker.switchDialog()
		}
	}
</script>

<style scoped>
	@import "../../common/generic.css";
</style>