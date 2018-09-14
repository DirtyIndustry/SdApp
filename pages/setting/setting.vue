<template>
	<view class="page-body">
		<!-- 上端空白 -->
		<view class="separator-vertical"></view>
		<!-- 推送按钮 -->
		<view class="stripbutton">
			<view class="separator-horizontal"></view>
			<view class="text text-gray">推送</view>
		</view>
		<!-- 推送下方说明文字 -->
		<view class="detail">
			<view class="separator-horizontal"></view>
			<view class="text-small text-gray">请在手机设置 > 通知 > 通知管理中找到山东海洋预报，可关闭通知。关闭后不再接收到推送的消息。</view>
			<view class="separator-horizontal"></view>
		</view>
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
		<view class="stripbutton" @tap="checkupdateTap">
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
			cachesize: ''
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
						console.log('fail')
					},
					complete: function (res) {
						console.log('complete')
					}
				})
			},
			// 清理缓存
			cachebuttonTap () {
				try {
					uni.clearStorageSync()
				} catch (e) {
					console.log('[缓存]: 清理缓存出错')
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
							// 检查app名称是否相同
							if (resappname === appsettings.appname) {
								if (that.needUpdate(appsettings.appversion, resversion)) {	//	需要升级
									// 弹窗提示
									uni.showModal({
										title: '发现新版本',
										content: appsettings.appversion + ' -> ' + resversion + '\n' + result[i].releasenote,
										confirmText: '立即升级',
										cancelText: '取消',
										success: function (res) {
											if (res.confirm) {
												console.log('用户确认升级')
												plus.runtime.openURL(result[i].url)
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
			// 检查版本
			needUpdate (oldVal, newVal) {
				let oldarr = oldVal.split('.')
				let newarr = newVal.split('.')
				for (let i = 0; i < oldarr.length; i++) {
					if (oldarr[i] < newarr[i]) {
						return true
					}
				}
				return false
			}
		},
		onLoad () {
			this.getCacheSize()
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
	height: 40px;
}

.separator-vertical-small {
	height: 10px;
}

.separator-horizontal {
	width: 40px;
}

.stripbutton{
	border-top: 1px solid #999;
	border-bottom: 1px solid #999;
	height: 80px;
	background-color: #fff;
	display: flex;
	flex-direction: row;
}

.detail {
	height: 80px;
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
	/* border: 1px solid #000; */
	width: 200px;
	display: flex;
	align-items: center;
	flex-direction: row-reverse;
}

.font-icon {
	font-size: 50px;
}
</style>
