<template>
	<view class="wrap">
		<view style="height: 40px;"></view>
		<view class="choose_source" @tap="showModel">
			<picker @change="source_change" v-model="cityIndex" :range="sourceArray">
				<text style="margin-left: 100px;">数据源:&nbsp;&nbsp;</text>
				<text class="source">{{data_source}}</text>
			</picker>
		</view>
		<view class="separator"></view>
		<!-- <picPlayer :imgArray="imageArray" :titleArray="dateArray" :startIndex="startIndex" autoStart="false" interval="2000"></picPlayer> -->
		<picSwiper :imgArray="imageArray" :titleArray="dateArray" :startIndex="startIndex" :autoStart="autostart" interval="3000"></picSwiper>
	</view>
</template>

<script>
	import appsettings from '../../utils/appsettings.js'
	import picPlayer from '../../components/picPlayer.vue'
	import picSwiper from '../../components/picSwiper.vue'

	export default {
		components:{
			picPlayer,
			picSwiper
		},
		data(){
			return{
				cityIndex:0,
				data_source:'韩国',
				sourceArray: ['韩国', '日本'],
				imageArray: [],
				dateArray: [],
				startIndex: 0,
				autostart: false
			}
		},
		methods:{
			//切换数据源
			source_change(e) {
				this.data_source = this.sourceArray[e.detail.value]
				this.requestImage(this.data_source)
			},
			// 向服务器请求图片
			requestImage (source) {
				let that = this
				uni.request({
					url: appsettings.hosturl + 'GetWeatherMap_20170807',
					data: {name: 'admin', areaflg: '青岛', flg: source},
					method: 'POST',
					success: function (res) {
						console.log('[服务器]: 返回 天气图')
						if (!res.data.d) {
							console.log('[服务器]: 返回 天气图 返回值为空')
							return false
						}
						that.imageArray.length = 0
						that.dateArray.length = 0
						for (let i = 0; i < res.data.d.length; i++) {
							let index = res.data.d[i].indexOf(',')
							that.imageArray.push(res.data.d[i].substring(0, index))

							let index_2 = res.data.d[i].indexOf('$')
							that.dateArray.push(res.data.d[i].substring(index + 1, index_2))
						}
						that.imageArray.reverse()
						that.dateArray.reverse()
					}
				})
			} // end-requestImage()
		},
		onLoad () {
			this.requestImage(this.data_source)
		}
	}
</script>

<style>
	Page{
		width: 100%;
		height: 100%;
	}
	.wrap{
		background: #f0eff5;
		width: 100%;
		height: 100%;
	}
	.choose_source {
		width: 100%;
		height: 80px;
		background-color: #fff;
		line-height: 80px;
		font-size: 28px;
		color: #000;
	}

	.source {
		color: #0092D4;
	}

	.separator {
		height: 40px;
	}
</style>
