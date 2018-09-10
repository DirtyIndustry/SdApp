<template>
	<view class="page-body">
		<!-- 上端空白 -->
		<view class="separator-vertical"></view>
		<!-- 推送按钮 -->
		<view class="stripbutton">
			<view class="separator-horizontal"></view>
			<view class="text">推送</view>
		</view>
		<!-- 推送下方说明文字 -->
		<view class="detail">
			<view class="separator-horizontal"></view>
			<view class="text-small">请在手机设置 > 通知 > 通知管理中找到山东海洋预报，可关闭通知。关闭后不再接收到推送的消息。</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 清理缓存 -->
		<view class="stripbutton" @tap="cachebuttonTap">
			<view class="separator-horizontal"></view>
			<view class="text">清理缓存</view>
			<view class="right-column text">
				{{cachesize}}
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 联系我们 -->
		<view class="stripbutton" @tap="contactusTap">
			<view class="separator-horizontal"></view>
			<view class="text">联系我们</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 关于 -->
		<view class="stripbutton" @tap="aboutTap">
			<view class="separator-horizontal"></view>
			<view class="text">关于</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
		<!-- 小分隔条 -->
		<view class="separator-vertical-small"></view>
		<!-- 检查更新 -->
		<view class="stripbutton" @tap="checkupdateTap">
			<view class="separator-horizontal"></view>
			<view class="text">检查更新</view>
			<view class="right-column">
				<view class="fa fa-angle-right font-icon"></view>
			</view>
			<view class="separator-horizontal"></view>
		</view>
    </view>
</template>

<script>
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
			},
			// 检查更新
			checkupdateTap () {
				console.log('check update clicked.')
			}
		},
		onLoad () {
			this.getCacheSize()
		}
	}
</script>

<style>
@import "../../common/FontAwesome.css";

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
	/* justify-content: center; */
	color: gray;
	font-size: 32px;
	font-family: '微软雅黑';
}

.text-small {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: gray;
	font-size: 24px;
	font-family: '微软雅黑';
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
	color: gray;
}
</style>
