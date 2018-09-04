<template>
	<view>
		<!-- 图片上方标题 -->
		<view class="pic_title">{{pictureTitle}}</view>
		<!-- 图片 -->
		<view class="img_box">
			<image :src="showingImg" mode="widthFix" @tap="previewImage" />
		</view>
		<!-- 图片下方计数器 -->
		<view class="page_number">
			<text>第 {{imgindex + (imgArray.length === 0 ? 0 : 1)}}/{{imgArray.length}} 张</text>
		</view>
		<!-- 播放控制按钮 -->
		<view class="btn_panel">
			<view class="btn_box">
				<view class="prev" @tap="prev">
					<image src="../../static/Images/btn_prev.png" mode="widthFix" />
				</view>
				<view class="play_stop">
					<image v-if="isPlaying" src="../../static/Images/btn_stop.png" mode="widthFix" @tap="stop" />
					<image v-else src="../../static/Images/btn_play.png" mode="widthFix" @tap="play" />
				</view>
				<view class="next" @tap="next">
					<image src="../../static/Images/btn_next.png" mode="widthFix" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'picPlayer',
		props: {
			// 图片列表
			imgArray: {
				type: Array,
				default() {
					return []
				}
			},
			// 图片标题列表
			titleArray: {
				type: Array,
				default() {
					return []
				}
			},
			// 起始状态展示第几张图片
			startIndex: {
				type: Number,
				default: 0
			},
			// 自动播放
			autoStart: {
				type: Boolean,
				default: false
			},
			// 播放间隔
			interval: {
				type: Number,
				default: 2000
			}
		},
		data() {
			return {
				showingImg: '',
				pictureTitle: '',
				imgindex: 0,
				timer: undefined,
				isPlaying: false
			}
		},
		watch: {
			// 传入的图片数组
			imgArray: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.initImg()
					}
				}
			},
			titleArray: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.initTitle()
					}
				}
			}
		},
		methods: {
			// 图片预览
			previewImage() {
				uni.previewImage({
					current: this.showingImg,
					urls: this.imgArray
				})
			},
			// 播放
			play() {
				let that = this
				this.isPlaying = true
				if (this.timer === undefined) {
					this.timer = setInterval(function () {
						that.next()
					}, this.interval)
				}
			},
			// 停止
			stop() {
				this.isPlaying = false
				clearInterval(this.timer)
				this.timer = undefined
			},
			// 上一张
			prev() {
				if (this.imgArray.length > 0) {
					if (this.imgindex === 0) {
						this.imgindex = this.imgArray.length - 1
					} else {
						this.imgindex--
					}
					this.showingImg = this.imgArray[this.imgindex]
					this.pictureTitle = this.titleArray[this.imgindex]
				}
			},
			next() {
				if (this.imgArray.length > 0) {
					if (this.imgindex < this.imgArray.length - 1) {
						this.imgindex++
					} else {
						this.imgindex = 0
					}
					this.showingImg = this.imgArray[this.imgindex]
					this.pictureTitle = this.titleArray[this.imgindex]
				}
			},
			initImg() {
				// 如果图片数组不为空 则显示图片
				if (this.imgArray.length > 0) {
					if (this.imgindex > this.imgArray.length - 1) {
						this.imgindex = 0
					}
					this.showingImg = this.imgArray[this.imgindex]
				}

			},
			initTitle() {
				// 如果标题数组不为空 则显示标题
				if (this.titleArray.length > 0) {
					if (this.imgindex < this.titleArray.length - 1) {
						this.pictureTitle = this.titleArray[this.imgindex]
					} else {
						this.pictureTitle = ""
					}
				}
			}
		}, // end-methods
		onReady() {
			this.imgindex = this.startIndex
			if (this.autoStart === true) {
				this.play()
			}
			this.initImg()
			this.initTitle()
		}
	}
</script>

<style>
	.pic_title {
		width: 100%;
		height: 80px;
		background: #fff;
		font-size: 28px;
		color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.page_number {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		margin: 20px 0;
	}

	.img_box,
	.img_box image {
		width: 100%;
	}

	.btn_panel {
		bottom: 160px;
		width: 100%;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn_box {
		/* border: 1px solid #000; */
		width: 70%;
		left: 15%;
		bottom: 160px;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.btn_box image {
		width: 100%;
	}

	.prev,
	.next {
		/* border: 1px solid #f00; */
		width: 110px;
		height: 110px;
	}

	.play_stop {
		/* border: 1px solid #0f0; */
		width: 140px;
		height: 140px;
	}
</style>
