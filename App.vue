<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		computed: {
			...mapState(['systemInfo'])
		},
		methods: {
			...mapMutations(['setSystemInfo'])
		},
		onLaunch: function () {
			console.log('App Launch')
			let that = this
			//#ifdef APP-PLUS
			/* 5+环境锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary')
			//#endif
			// 检查网络环境
			uni.getNetworkType({
				success:function(res){
					//console.log(res.networkType)
					if (res.networkType === 'none'){
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
							url:'http://123.234.129.238:8001/MyWebService.asmx/GetAndroidUpgrade',
							data: {
								name: 'admin',
								areaflg: '青岛'
							},
							method: 'POST',
							success: function(res){
								console.log('连接服务器成功!')
							},
							fail: function(res){
								// 无法成功连接服务器 弹出提示
								console.log('服务器维护中!')
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
			// 获取系统信息
			uni.getSystemInfo({
				success: function (res) {
					// 将系统信息存入vuex
					that.setSystemInfo(res)
				}
			})
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

	.container {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		justify-content: space-between;
		font-size: 32px;
		font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
	}

	.page-head {
		padding: 60px 50px 80px;
		text-align: center;
		line-height: initial;
		height: 60px;
	}

	.page-head-title {
		display: inline-block;
		padding: 0 40px;
		font-size: 30px;
		height: 60px;
		line-height: 60px;
		color: #BEBEBE;
		box-sizing: border-box;
		border-bottom: 2px solid #D8D8D8;
	}

	.page-head-desc {
		padding-top: 20px;
		color: #9B9B9B;
		font-size: 32px;
	}

	.page-body {
		width: 100%;
		flex-grow: 1;
		overflow-x: hidden;
	}

	.page-body-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.page-body-wording {
		text-align: center;
		padding: 200px 100px;
	}

	.page-body-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		width: 100%;
		padding: 50px 0 150px 0;
	}

	.page-body-title {
		margin-bottom: 100px;
		font-size: 32px;
	}

	.page-body-text {
		font-size: 30px;
		line-height: 52px;
		color: #ccc;
	}

	.page-body-text-small {
		font-size: 24px;
		color: #000;
		margin-bottom: 100px;
	}

	.page-foot {
		margin: 100px 0 30px 0;
		text-align: center;
		color: #1aad19;
		font-size: 0;
	}

	.icon-foot {
		width: 152px;
		height: 23px;
	}

	.page-section {
		width: 100%;
		margin-bottom: 60px;
	}

	.page-section_center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.page-section:last-child {
		margin-bottom: 0;
	}

	.page-section-gap {
		box-sizing: border-box;
		padding: 0 30px;
	}

	.page-section-spacing {
		box-sizing: border-box;
		padding: 0 80px;
	}

	.page-section-title {
		font-size: 28px;
		color: #999999;
		margin-top: 10px;
		margin-bottom: 10px;
		padding-left: 30px;
		padding-right: 30px;
	}

	.page-section-gap .page-section-title {
		padding-left: 0;
		padding-right: 0;
	}
	/* example */

	.index-hd {
		padding: 90px;
		text-align: center;
	}

	.index-logo {
		width: 140px;
		height: 140px;
	}

	.btn-area {
		margin-top: 60px;
		box-sizing: border-box;
		width: 100%;
		padding: 0 30px;
	}

	.image-plus {
		width: 150px;
		height: 150px;
		border: 2px solid #D9D9D9;
		position: relative;
	}

	.image-plus-nb {
		border: 0;
	}

	.image-plus-text {
		color: #888888;
		font-size: 28px;
	}

	.image-plus-horizontal {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #d9d9d9;
		width: 4px;
		height: 80px;
		transform: translate(-50%, -50%);
	}

	.image-plus-vertical {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #d9d9d9;
		width: 80px;
		height: 4px;
		transform: translate(-50%, -50%);
	}

	.color1 {
		background-color: #1AAD19;
		color: #FFFFFF;
	}

	.color2 {
		background-color: #2782D7;
		color: #FFFFFF;
	}

	.color3 {
		background-color: #F1F1F1;
		color: #353535;
	}
</style>
