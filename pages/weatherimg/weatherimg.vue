<template>
	<view class="wrap" @tap="pageTap">
		<view style="height: 40px;"></view>
		<view class="choose_source" @tap="showModel">
			<picker @change="source_change" v-model="cityIndex" :range="sourceArray">
				<text class="choose-source-header text">数据源:&nbsp;&nbsp;</text>
				<text class="text text-blue">{{data_source}}&nbsp;&nbsp;</text>
				<text class="text text-blue fa fa-angle-down"></text>
			</picker>
		</view>
		<view class="separator"></view>
		<picSwiperAlt :imgArray="imageArray" :titleArray="dateArray" :startIndex="startIndex" :autoStart="autostart" interval="3000"
		 ref="picswiper"></picSwiperAlt>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import picSwiperAlt from '../../components/picSwiperAlt.vue'

	export default {
		components: {
			picSwiperAlt
		},
		data() {
			return {
				cityIndex: 0,
				data_source: '韩国',
				sourceArray: ['韩国', '日本'],
				imageArray: [],
				dateArray: [],
				startIndex: 0,
				autostart: false
			}
		},
		methods: {
			//切换数据源
			source_change(e) {
				this.data_source = this.sourceArray[e.detail.value]
				this.requestImage(this.data_source)
			},
			// 向服务器请求图片
			requestImage(source) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetWeatherMap_0905',
					data: { name: 'admin', areaflg: '青岛', flg: source },
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 天气图')
						if (!res.data.d) {
							console.log('[服务器]: 返回 天气图 返回值为空')
							return false
						}
						let dataarr = JSON.parse(res.data.d)
						// 将返回数据填入数组
						let imgarr = []
						let datearr = []
						for (let i = 0; i < dataarr.length; i++) {
							imgarr.push(dataarr[i].url)
							datearr.push(dataarr[i].title)
						}
						that.imageArray = imgarr
						that.dateArray = datearr
					}
				})
			}, // end-requestImage()
			// 页面点击
			pageTap() {
				this.$refs.picswiper.timerStart()
			}
		},
		onLoad() {
			this.requestImage(this.data_source)
		},
		onPullDownRefresh() {
			console.log('[界面]: 天气图 下拉刷新')
			this.requestImage(this.data_source)
			uni.stopPullDownRefresh()
		},
	}
</script>

<style scoped>
	@import "../../common/FontAwesome.css";
	@import "../../common/generic.css";

	Page {
		width: 100%;
		height: 100%;
	}

	.wrap {
		background: #f0eff5;
		width: 100%;
		height: 100%;
	}

	.choose_source {
		width: 100%;
		height: 80px;
		background-color: #fff;
		line-height: 80px;
	}

	.choose-source-header {
		margin-left: 100px;
	}

</style>