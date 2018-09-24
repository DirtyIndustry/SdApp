<template>
    <view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="weixinCityBanner">
            <!-- 布局右侧宽度固定，左侧自适应 -->
            <view class="bannerColumnLeft text-large text-bold text-blue">
                &nbsp;&nbsp;{{cityName}}市
            </view>
            <view class="bannerColumnRight">
                <!-- 切换城市按钮 -->
                <picker class="city-picker" @change="bindPickerChange" :value="cityIndex" :range="cityArray">
                    <view class="picker-cell">切换城市</view>
                </picker>
            </view>
        </view>
        <!-- 占位空白模块 -->
        <view style="height: 100upx;" />
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view class="page-section header text-large text-bold text-blue">{{cityName}}市</view>
        <view style="height: 20upx;" />
        <!-- #endif -->
    </view>
</template>

<script>
export default {
name: 'weixinCityPicker',
props: {
    cityName: {
        type: String,
        default () {
            return ''
        }
    },
    cityIndex: {
        type: Number,
        default () {
            return 0
        }
    },
    cityArray: {
        type: Array,
        default () {
            return []
        }
    }
},
methods: {
    bindPickerChange (e) {
        this.$emit('change', e)
    }
}
}
</script>

<style scoped>
@import "../common/generic.css";
/* 微信小程序地区条幅容器 */
.weixinCityBanner {
    position: fixed;
    left: 0;
    width: 100%;
	height: 80upx;
    background-color: #fff;
    display: flex;
    opacity: 0.9;
    z-index: 9;
}
/* 左侧显示地名区域 */
.bannerColumnLeft {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
}
/* 右侧picker按钮区域 */
.bannerColumnRight {
    width: 150upx;
	height: 100%;
}
/* picker按钮 */
.city-picker {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
/* picker按钮单元格 */
.picker-cell {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
/* 页面顶端城市名称容器 */
.header {
    height: 80upx;
    display: flex;
    align-items: center;
}
</style>
