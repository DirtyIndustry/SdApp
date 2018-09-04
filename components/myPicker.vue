<template>
<view class="masklayer" v-show="show" @tap="closeDialog" catchtouchmove="stopscroll">
    <view class="choose_box">
    	<view class="chooseItem" v-for="(item, index) in chooseInfo" :key="index">{{item}}</view>
    </view>
	<view class="cancel">取消</view>
</view>    
</template>

<script>
export default {
    name: 'myPicker',
    props: {
		chooseInfo: {
			type: Array,
			default() {
				return ['日本', '韩国']
			}
		}
    },
    data () {
        return {
            show: false,
			// chooseInfo:['日本','韩国']
        }
    },
    methods: {
        showDialog () {
            console.log('picker show')
            this.show = true
        },
        closeDialog () {
            this.show = false
        },
        switchDialog () {
            this.show = !this.show
        },
        stopscroll () {
            // 阻止背后页面滚动
        }
    }
}
</script>

<style>
.masklayer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: block;
    background-color: rgba(0, 0, 0, 0.3)
}
.choose_box{
	width: 95%;
	border-radius: 24rpx;
	background: #fff;
	position: absolute;
	left: 2.5%;
	bottom: 140rpx;
}
.chooseItem{
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	color: #007eff;
	font-size: 32rpx;
	border-bottom: #d8d8d8 2rpx solid;
}
.chooseItem:last-child{
	border: none;
}
.cancel{
	width: 95%;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	color: #007eff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 24rpx;
	background: #fff;
	position: absolute;
	bottom: 20rpx;
	left: 2.5%;
}
.inner-canvas {
    width: 100%;
    height: 100%;
}
</style>
