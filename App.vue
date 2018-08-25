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
			uni.showLoading({
				title: '加载中',
				mask: true
			})
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
</style>
