<template>
	<view class="wraps">	
		<view class="weather_time">{{weatherTime}}</view>
		<view class="img_box">
			<image :src="weatherImage" mode="widthFix" @tap="previewImage"></image>
		</view>
		<view class="page_number">
			<text>第 {{imgindex+1}}/{{imgArray.length}} 张</text>
		</view>
		<view class="btn_box1">
			<view class="prev" @tap="prev"><image src="../../static/Images/btn_prev.png" mode="widthFix"></image></view>
			<view class="play_stop">
				<image v-if="isSelected==false" src="../../static/Images/btn_play.png" mode="widthFix" @tap="play"></image>
				<image v-else src="../../static/Images/btn_stop.png" mode="widthFix" @tap="stop"></image>
			</view>
			<view class="next" @tap="next"><image src="../../static/Images/btn_next.png" mode="widthFix"></image></view>
		</view>
		<view class="btn_box">
			<view :class="{'playOn': isSelected}" @tap="play">播放</view>
			<view :class="{'playOn': !isSelected}" @tap="stop">暂停</view>
			<view @tap="prev">上一张</view>
			<view @tap="next">下一张</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'weatherImage',
		data() {
			return {
				weatherImage: '',
				weatherTime: '',
				imgArray: [],
				timeArray: [],
				imgindex: 0,
				setInter: undefined,
				isSelected: false
			}
		},
		methods: {
			
			loadingImg() { //数据请求
				let that = this
				uni.request({
					url: "http://123.234.129.238:8001/MyWebService.asmx/GetWeatherMap_20170807",
					data: {
						name: 'admin',
						flg: '韩国',
						areaflg: '青岛'
					},
					method: 'POST',
					success: function (res) {
						let back_data = res.data.d
						for (let i = 0; i < back_data.length; i++) {
							let index = back_data[i].indexOf(",") //获得返回字符串“，”的位置
							that.imgArray[i] = back_data[i].substring(0, index)

							let index_1 = back_data[i].indexOf("$")
							that.timeArray[i] = back_data[i].substring(index + 1, index_1)

						}
						that.imgArray.reverse()
						that.timeArray.reverse()
						console.log(that.imgArray, that.timeArray)
						that.weatherImage = that.imgArray[0]
						that.weatherTime = that.timeArray[0]
						// 						that.imgArray = res.data.d
						// 						var index = that.imgArray[0].indexOf(",") //获得返回字符串“，”的位置
						// 						that.weatherImage = that.imgArray[0].substring(0,index)
					}
				})
			},
			previewImage() { //图片预览
				uni.previewImage({
					current: this.weatherImage,
					urls: this.imgArray,
				})
			},
			showImage() { //下一张图片
				if (this.imgArray.length > 0) {
					if (this.imgindex < this.imgArray.length - 1) {
						this.imgindex++
					} else {
						this.imgindex = 0
					}
					this.weatherImage = this.imgArray[this.imgindex]
					this.weatherTime = this.timeArray[this.imgindex]
				}
			},
			play() { //播放
				let that = this
				this.isSelected = true
				if (this.setInter === undefined) {
					this.setInter = setInterval(
						function () {
							that.showImage();
						}, 1000) //循环间隔 单位ms
				}
			},

			stop() { //暂停
				this.isSelected = false
				clearInterval(this.setInter)
				this.setInter = undefined
			},
			prev() { //上一张
				if (this.imgArray.length > 0) {
					if (this.imgindex == 0) {
						this.imgindex = this.imgArray.length - 1
					} else {
						this.imgindex--
					}
					this.weatherImage = this.imgArray[this.imgindex]
					this.weatherTime = this.timeArray[this.imgindex]
				}
			},
			next() { //下一张
				if (this.imgArray.length > 0) {
					if (this.imgindex < this.imgArray.length - 1) {
						this.imgindex++
					} else {
						this.imgindex = 0
					}
					this.weatherImage = this.imgArray[this.imgindex]
					this.weatherTime = this.timeArray[this.imgindex]
				}
			}
		},
		onLoad() {
			this.loadingImg()
			clearInterval(this.setInter)
		}
	}
</script>

<style>
	

	.img_box {
		width: 100%;
	}

	.img_box image {
		width: 100%;
	}

	.weather_time {
		width: 100%;
		height: 80rpx;
		background: #fff;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #333;
	}

	.page_number {
		text-align: center;
		font-size: 28rpx;
		margin: 20rpx 0;
	}

	.btn_box {
		position: fixed;
		width: 100%;
		bottom: 100rpx;
		height: 60rpx;
		display: flex;
		justify-content: space-around;
	}
	
	.btn_box1 {
		position: fixed;
		width: 70%;
		left: 15%;
		bottom: 160rpx;
		height: 200rpx;
		align-items: center;
		display: flex;
		justify-content: space-around;
	}
	.btn_box1 image{
		width: 100%;
		height: 100%;
	}
	.prev,.next{
		width: 110rpx;
		height: 110rpx;
	}
	.play_stop{
		width: 140rpx;
		height: 140rpx;
	}
	.btn_box view {
		width: 20%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #333;
		background: linear-gradient(#d4d4d4, #c4c4c6);
		border-radius: 12rpx;
		font-size: 28rpx;
	}

	.playOn {
		background: linear-gradient(#c4c4c6, #d4d4d4) !important;
	}
</style>
