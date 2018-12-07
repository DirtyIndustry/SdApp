<script>
	import appsettings from './utils/appsettings.js'
	import utils from './utils/utils.js'
	export default {
		data() {
			return {
				completedRequestCount: 0,
				provider: []
			}
		},
		computed: {
			// 系统信息
			systemInfo: {
				get() {return this.$store.state.Infos.systeminfo},
				set(value) {this.$store.dispatch('setSystemInfo', value)}
			},
			// 城市选择列表
			cityArray() { return this.$store.state.Infos.cityarray },
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
			},
			// 首页引导显示
			showIndexGuide: {
				get () { return this.$store.state.Infos.showindexguide },
				set (value) { this.$store.dispatch('setShowIndexGuide', value) }
			},
			// 警报信息
			warningData: {
				get () { return this.$store.state.Datas.warningdata },
				set (value) { this.$store.dispatch('setWarningData', value) }
			},
			// 推送信息
			pushMessage: {
				get () { return this.$store.state.Datas.pushmessage },
				set (value) { this.$store.dispatch('setPushMessage', value) }
			},
			// 推送提示音
			pushBeep: {
				get () { return this.$store.state.Infos.pushbeep },
				set (value) { this.$store.dispatch('setPushBeep', value) }
			},
			// 推送震动
			pushVibrate: {
				get() { return this.$store.state.Infos.pushvibrate },
				set(value) { this.$store.dispatch('setPushVibrate', value) }
			},
			// 强制升级
			forceUpgrade: {
				get() { return this.$store.state.Infos.forceupgrade },
				set(value) { this.$store.dispatch('setForceUpgrade', value) }
			},
			// 需要升级
			needUpgrade: {
				get() { return this.$store.state.Infos.needupgrade },
				set(value) { this.$store.dispatch('setNeedUpgrade', value) }
			}
		},
		watch: {
			completedRequestCount: {
				handler (newVal, oldVal) {
					if (newVal == 2) {
						uni.hideLoading()
					}
				}
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
							uni.request({
								url: appsettings.hosturl + 'GetDeviceToken',
								data: { name: 'admin', areaflg: '山东', deviceToken: plus.device.uuid, version: appsettings.appversion },
								method: 'POST',
								success: function (res) {
									console.log('[服务器]: 统计应用信息成功')
								}
							})
							// 尝试连接后台服务器
							uni.request({
								url: appsettings.hosturl + 'GetAndroidUpgrade_0911',
								data: {name: 'admin', areaflg: '山东'},
								method: 'POST',
								success: function (res) {
									console.log('[服务器]: 返回 安卓升级数据')
									if (!res.data.d) {
										console.log('[服务器]: 返回 安卓升级数据 返回值为空')
										return false
									}
									let result = JSON.parse(res.data.d)
									if (result.length === 0) {
										console.log('[服务器]: 返回 安卓升级数据 返回值为空')
										return false
									}
									for (let i = 0; i < result.length; i++) {
										let resversion = result[i].version
										let resappname = result[i].appname
										let forceupgradeversion = result[i].forceupgradeversion
										let resurl = result[i].url
										// 检查app名称是否相同
										if (resappname === appsettings.appname) {
											if (utils.needUpdate(forceupgradeversion, appsettings.appversion) == true && forceupgradeversion !== '') { // 强制升级
												that.forceUpgrade = true
												uni.showModal({
													title: '错误',
													content: '当前版本已停用, 请立即升级',
													showCancel: false,
													confirmText: '立即升级',
													success: function (res) {
														utils.doUpgrade()
													}
												})
											} else if (utils.needUpdate(appsettings.appversion, resversion)) {	//	需要升级
												that.needUpgrade = true
												// 弹窗提示
												uni.showModal({
													title: '发现新版本',
													content: appsettings.appversion + ' -> ' + resversion + '\n' + result[i].releasenote,
													confirmText: '立即升级',
													cancelText: '取消',
													success: function (res) {
														if (res.confirm) {
															console.log('用户确认升级')
															utils.doUpgrade()
														} else {
															console.log('用户取消升级')
														}
													}
												})
											}
										}
									}
								}, // end-success
								fail: function (res) {
									// 无法成功连接服务器 弹出提示
									console.log('[服务器]: 维护中!')
									uni.showModal({
										title: '提示',
										content: '服务器维护中!',
										showCancel: false
									})
								} // end-fail
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
						// console.log(res.data)
						that.cityIndex = res.data
					}
				})
				// 所选城市名称
				uni.getStorage({
					key: 'cityname',
					success: function (res) {
						console.log('[缓存]: 获取 城市名称')
						// console.log(res.data)
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
				// 威海专项
				uni.getStorage({
					key: 'weihaidata',
					success: function (res) {
						console.log('[缓存]: 获取 威海专项预报')
						// console.log(res.data)
						that.weihaiData = JSON.parse(res.data)
					}
				})
				// 首页引导显示
				uni.getStorage({
					key: 'showindexguide',
					success: function (res) {
						console.log('[缓存]: 获取 首页引导显示')
						// console.log(res.data)
						that.showIndexGuide = JSON.parse(res.data)
					}
				})
				// 推送提示音
				uni.getStorage({
					key: 'pushbeep',
					success: function (res) {
						console.log('[缓存]: 获取 推送提示音')
						// console.log(typeof(res.data) + ' ' + res.data)
						that.pushBeep = res.data
					}
				})
				// 推送震动
				uni.getStorage({
					key: 'pushvibrate',
					success: function (res) {
						console.log('[缓存]: 获取 推送震动')
						// console.log(res.data)
						that.pushVibrate = res.data
					}
				})
			}, // end-getLocalStorage()
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
						// 处理数据
						utils.getShandongData(res)
					}, // success-request
					fail: function (res) {
						console.log('[服务器]: 请求 山东预报数据 失败')
					},
					complete: function () {
						that.completedRequestCount++
					}
				})
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
							// that.warningData.typhoonWarning = resdata.Typhoon.NUMBER +
							// 	'号台风"' +
							// 	resdata.Typhoon.CHN_NAME +
							// 	'"正在接近...'
							that.warningData.typhoonWarning = resdata.Typhoon.message
						}
						if (resdata.Ocean.length > 0) {
							console.log('[服务器]: 有海洋警报')
							let name = resdata.Ocean[resdata.Ocean.length - 1].name
							let date = new Date(resdata.Ocean[resdata.Ocean.length - 1].datetime)
							let url = resdata.Ocean[resdata.Ocean.length - 1].Url
							let filename = resdata.Ocean[resdata.Ocean.length - 1].filename
							// that.warningData.waveWarning = (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':00发布' + name + '。'
							that.warningData.waveWarning = resdata.Ocean[resdata.Ocean.length - 1].message
							that.warningData.waveUrl = url
							that.warningData.filename = filename
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
			// 开启推送
			openPush() {
				let that = this
				uni.getProvider({
					service: 'push',
					success: function (res) {
						// console.log(res.provider)
						that.provider = res.provider
						uni.subscribePush({
							provider: res.provider[0],
							success: function (res2) {
								console.log('[设备]: 已开启' + res.provider[0] + 'push接收')
								console.log('[设备]: ClientId: ' + res2.clientid)
								that.listenTranMsg()
							}
						})
					}
				})
			},
			listenTranMsg() {
				let that = this
				uni.onPush({
					provider: this.provider[0],
					success: (e) => {
						console.log('[设备]: 开始监听透传数据')
					},
					callback: (e) => {
						console.log('[设备]: 接收到透传数据')
						that.loadAlarmData()
						if (plus.os.name == 'Android') {
							// console.log(e.data)
							let pushdata = JSON.parse(e.data)
							if (pushdata !== undefined) {
								that.pushMessage = pushdata
							}
						} else {
							// console.log(JSON.stringify(e.data))
							if (e.data !== undefined) {
								if (that.pushBeep === true) {
									plus.device.beep()
								}
								if (that.pushVibrate === true) {
									uni.vibrateLong()
								}
								uni.showModal({
									title: '海洋警报',
									content: '有一条新的海洋警报',
									confirmText: '立即查看',
									cancelText: '知道了',
									success: function (res) {
										// console.log(JSON.stringify(e.data))
										that.pushMessage = e.data
									}
								})
							}
						}
					}
				})
				if (plus.os.name !== 'Android') {
					plus.push.addEventListener('click', function(msg) {
						console.log('[设备]: 点击推送消息')
						// console.log(JSON.stringify(msg))
						that.pushMessage = msg.payload
					})
				}
			}
		}, // end-methods
		onLaunch: function () {
			console.log('App Launch')
			this.completedRequestCount = 0
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
			this.switchCityByIndex(this.cityIndex)
			this.loadAlarmData()
			this.openPush()
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
		font-size: 30upx;
		line-height: 1.6;
	}

	form {
		width: 100%;
	}

	/* page */
</style>