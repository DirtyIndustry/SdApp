<script>
	import utils from './utils/utils.js'
	export default {
		computed: {
			// 系统信息
			systemInfo: {
				get() {return this.$store.state.Infos.systeminfo},
				set(value) {this.$store.dispatch('setSystemInfo', value)}
			},
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
			}
		},
		methods: {
			// 检查网络环境
			checkNetwork () {
				let that = this
				uni.getNetworkType({
					success: function (res) {
						//console.log(res.networkType)
						if (res.networkType === 'none') {
							// 手机无网络，弹出提示框
							uni.showModal({
								title: '提示',
								content: '网络异常,请检查网络设置!',
								showCancel: false
							})
							console.log('网络异常,请检查网络设置')
						} else {
							// 尝试连接后台服务器
							uni.request({
								url: 'http://123.234.129.238:8001/MyWebService.asmx/GetAndroidUpgrade',
								data: {
									name: 'admin',
									areaflg: '青岛'
								},
								method: 'POST',
								success: function (res) {
									console.log('[服务器]: 连接成功!')
								},
								fail: function (res) {
									// 无法成功连接服务器 弹出提示
									console.log('[服务器]: 维护中!')
									uni.showModal({
										title: '提示',
										content: '服务器维护中!',
										showCancel: false
									})
								}
							}) // end-request
						} // end-if-else (res.network === 'none')
					} // end-success-getNetworkType
				}) // end-uni.getNetworkType
			},
			// 获取系统信息
			getSystemInfo () {
				let that = this
				uni.getSystemInfo({
					success: function (res) {
						// 将系统信息存入vuex
						that.systemInfo = res
					}
				})
			},
			// 获取本地存储的数据
			getLocalStorage () {
				let that = this
				// 城市菜单index
				uni.getStorage({
					key: 'cityindex',
					success: function (res) {
						console.log('[缓存]: 获取 城市菜单index')
						console.log(res.data)
						that.cityIndex = res.data
					}
				})
				// 所宣城市名称
				uni.getStorage({
					key: 'cityname',
					success: function (res) {
						console.log('[缓存]: 获取 城市名称')
						console.log(res.data)
						that.cityName = res.data
					}
				})
				// 实时天气
				uni.getStorage({
					key: 'weatherdata',
					success: function (res) {
						console.log('[缓存]: 获取 实时天气')
						// console.log(res.data)
						that.weatherData = JSON.parse(res.data)
					}
				})
				// 潮汐预报
				uni.getStorage({
					key: 'tidedata',
					success: function (res) {
						console.log('[缓存]: 获取 潮汐预报')
						// console.log(res.data)
						that.tideData = JSON.parse(res.data)
					}
				})
				// 近海预报
				uni.getStorage({
					key: 'inshoredata',
					success: function (res) {
						console.log('[缓存]: 获取 近海预报')
						// console.log(res.data)
						that.inshoreData = JSON.parse(res.data)
					}
				})
				// 浴场预报
				uni.getStorage({
					key: 'bathsdata',
					success: function (res) {
						console.log('[缓存]: 获取 浴场预报')
						// console.log(res.data)
						that.bathsData = JSON.parse(res.data)
					}
				})
				// 精细化预报
				uni.getStorage({
					key: 'refineddata',
					success: function (res) {
						console.log('[缓存]: 获取 精细化预报')
						// console.log(res.data)
						that.refinedData = JSON.parse(res.data)
					}
				})
				// 五日天气
				uni.getStorage({
					key: 'fivedaydata',
					success: function (res) {
						console.log('[缓存]: 获取 五日天气')
						// console.log(res.data)
						that.fivedayData = JSON.parse(res.data)
					}
				})
			} // end-getLocalStorage()
		},
		onLaunch: function () {
			console.log('App Launch')
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			
			//#ifdef APP-PLUS
			/* 5+环境锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary')
			//#endif
			
			this.checkNetwork()
			this.getSystemInfo()
			this.getLocalStorage()
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 这是页面的公用css */

	page {
		background-color: #F8F8F8;
		height: 100%;
		font-size: 32px;
		line-height: 1.6;
	}

	checkbox,
	radio {
		margin-right: 10px;
	}

	button {
		margin-top: 20px;
		margin-bottom: 20px;
	}

	form {
		width: 100%;
	}

	/* page */
</style>