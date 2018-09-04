<template>
	<view class="wrap">
		<view style="height: 40rpx;"></view>
		<view class="choose_source" @tap="showModel">
			<!-- <picker @change="source_change" :value="cityIndex" :range="sourceArray">
				<text style="margin-left: 100rpx;">数据源: </text>
				<text class="source"> {{data_source}}</text>
			</picker> -->
			<text style="margin-left: 100rpx;">数据源: </text>
			<text class="source"> {{data_source}}</text>
		</view>
		<weatherImage></weatherImage>
		<myPicker :chooseInfo="mylist" ref="myPicker1"></myPicker>
	</view>
</template>

<script>
	import weatherImage from '../../components/weatherImage.vue'
	import myPicker from '../../components/myPicker.vue'

	export default {
		components:{
			weatherImage,
			myPicker
		},
		data(){
			return{
				cityIndex:0,
				data_source:'韩国',
				// sourceArray: ['韩国', '日本'],
				mylist: ['西瓜','苹果']
			}
		},
		methods:{
// 			source_change(e) { //切换数据源
// 				this.index = e.detail.value
// 				this.data_source = this.sourceArray[this.index]
// 			},
			showModel () { 
				this.$refs.myPicker1.switchDialog() //调用组件里的方法
			}
		},
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
		height: 80rpx;
		background-color: #fff;
		line-height: 80rpx;
		margin-bottom: 40rpx;
		font-size: 28rpx;
		color: #000;
	}

	.source {
		color: #0092D4;
	}
</style>
