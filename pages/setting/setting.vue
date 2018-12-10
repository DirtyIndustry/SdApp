<template>
	<view class="page-body" >
		<!-- 上端空白 -->
		<view class="separator-vertical"></view>
		<!-- 安卓推送按钮 -->
		<view v-if="isAndroid" class="stripbutton">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">推送</view>
		</view>
		<!-- 苹果推送提示音 -->
		<view v-if="!isAndroid" class="stripbutton">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">推送提示音</view>
			<view class="right-column">
				<switch :checked="pushBeep" @change="pushBeepChange" color="#0092d4"></switch>
			</view>
			<view class="separator-horizontal" />
		</view>
		<view v-if="!isAndroid" class="separator-vertical"></view>
		<!-- 苹果推送震动 -->
		<view v-if="!isAndroid" class="stripbutton">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">推送震动</view>
			<view class="right-column">
				<switch :checked="pushVibrate" @change="pushVibrateChange" color="#0092d4"></switch>
			</view>
			<view class="separator-horizontal" />
		</view>
		<!-- 推送下方说明文字 -->
		<view class="detail">
			<view class="separator-horizontal"></view>
			<view class="text-small text-gray">{{pushtext}}</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 欢迎页面 -->
		<view class="stripbutton" @tap="bienvenuTap">
			<view class="separator-horizontal" />
			<view class="text text-gray">欢迎页面</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon text-gray"></view>
			</view>
			<view class="separator-horizontal" />
		</view>
		<view class="separator-vertical-small" />
		<!-- 清理缓存 -->
		<view class="stripbutton" @tap="cachebuttonTap">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">清理缓存</view>
			<view class="right-column text">
				<view v-if="cachesize === ''" class="fa fa-angle-right font-icon text-gray"></view>
				{{cachesize}}
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 联系我们 -->
		<view class="stripbutton" @tap="contactusTap">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">联系我们</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon text-gray"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 关于 -->
		<view class="stripbutton" @tap="aboutTap">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">关于</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon text-gray"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 检查更新 -->
		<view v-if="isAndroid" class="stripbutton" @tap="checkupdateTap">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">检查更新</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon text-gray"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
    </view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import utils from '../../utils/utils.js'
	export default {
		data: {
			isAndroid: true,
			pushtext: '请在手机设置 > 通知和状态栏 > 通知管理中找到山东海洋预报，可关闭通知。关闭后不再接收到推送的消息。',
			cachesize: ''
		},
		computed: {
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
			// 安卓下载地址
			androidupgradeurl: {
				get() { return this.$store.state.Infos.androidupgradeurl },
				set(value) { this.$store.dispatch('setAndroidUpgradeUrl', value) }
			}
		},
		methods: {
			// 获取当前缓存占用空间 单位kb
			getCacheSize () {
				let that = this
				uni.getStorageInfo({
					success: function (res) {
						console.log('[缓存]: 获取缓存占用空间')
						if (res.currentSize < 1024) {
							that.cachesize = res.currentSize + 'Kb'
						} else {
							that.cachesize = (res.currentSize / 1024).toFixed(2) + 'Mb'
						}
					},
					fail: function (res) {
						console.log('[缓存]: 获取缓存占用空间 失败')
					}
				})
			},
			// 设置欢迎页面
			bienvenuTap () {
				uni.showModal({
					title: '设置',
					content: '启动时是否显示欢迎页面？',
					confirmText: '是',
					cancelText: '否',
					success: function (res) {
						if (res.confirm) {
							utils.storeToLocal('skipbienvenu', false)
						} else if (res.cancel) {
							utils.storeToLocal('skipbienvenu', true)
						}
					}
				})
			},
			// 清理缓存
			cachebuttonTap () {
				// try {
				// 	uni.clearStorageSync()
				// } catch (e) {
				// 	console.log('[缓存]: 清理缓存出错')
				// }
				try {
					uni.removeStorageSync('cityindex')
					uni.removeStorageSync('cityname')
					uni.removeStorageSync('weatherdata')
					uni.removeStorageSync('tidedata')
					uni.removeStorageSync('inshoredata')
					uni.removeStorageSync('bathsdata')
					uni.removeStorageSync('refineddata')
					uni.removeStorageSync('fivedaydata')
					uni.removeStorageSync('weihaidata')
					uni.removeStorageSync('showindexguide')
				} catch (e) {
					console.log('[缓存]: 删除键值出错')
					console.log(JSON.stringify(e))
				}
				this.getCacheSize()
				uni.showModal({
					title: '提示',
					content: '清理缓存成功',
					showCancel: false
				})
			},
			// 联系我们
			contactusTap () {
				console.log('contact us clicked.')
				uni.navigateTo({
					url: '../contactus/contactus'
				})
			},
			// 关于
			aboutTap () {
				console.log('about clicked.')
				uni.navigateTo({
					url: '../about/about'
				})
			},
			// 检查更新
			checkupdateTap () {
				console.log('check update clicked.')
				let that = this
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
							that.androidupgradeurl = result[i].url
							// 检查app名称是否相同
							if (resappname === appsettings.appname) {
								if (utils.needUpdate(forceupgradeversion, appsettings.appversion) & forceupgradeversion !== '') { // 强制升级
									uni.showModal({
										title: '当前版本已停用, 请升级',
										showCancel: false,
										confirmText: '立即升级',
										complete: function (res) {
											utils.doUpgrade()
										}
									})
								} else if (utils.needUpdate(appsettings.appversion, resversion)) {	//	需要升级
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
								} else {	// 不需要升级
									uni.showModal({
										content: '当前已是最新版本',
										showCancel: false
									})
								}
							}
						}
					}
				})
			},
			// 设置推送提示音
			pushBeepChange(e) {
				this.pushBeep = e.detail.value
				utils.storeToLocal('pushbeep', this.pushBeep)
			},
			// 设置推送震动
			pushVibrateChange(e) {
				this.pushVibrate = e.detail.value
				utils.storeToLocal('pushvibrate', this.pushVibrate)
			}
		},
		onLoad () {
			this.getCacheSize()
			if (plus.os.name == 'Android') {
				this.isAndroid = true
				this.pushtext = '请在手机设置 > 通知和状态栏 > 通知管理中找到山东海洋预报，可关闭通知。关闭后不再接收到推送的消息。'
			} else {
				this.isAndroid = false
				this.pushtext = '请在手机设置 > 通知中找到山东海洋预报，可关闭后台通知，关闭应用后不再接收到推送的消息。'
			}
		}
	}
</script>

<style scoped>
@import "../../common/FontAwesome.css";
@import "../../common/generic.css";

.page-body {
	background-color: #eeeeee;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.separator-vertical{
	height: 40upx;
}

.separator-vertical-small {
	height: 10upx;
}

.separator-horizontal {
	width: 40upx;
}

.stripbutton{
	/* border-top: 1upx solid #999;
	border-bottom: 1upx solid #999; */
	height: 80upx;
	background-color: #fff;
	display: flex;
	flex-direction: row;
}

.detail {
	height: 80upx;
	display: flex;
	flex-direction: row;
}

.text {
	flex: 1;
	display: flex;
	align-items: center;
}

.text-small {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.right-column {
	width: 200upx;
	display: flex;
	align-items: center;
	flex-direction: row-reverse;
}

.font-icon {
	font-size: 50upx;
}
</style>
