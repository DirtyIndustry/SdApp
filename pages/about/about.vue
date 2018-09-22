<template>
    <view class="page-body" catchtouchmove="stopscroll">
        <view class="section-top">
            <view style="height: 100upx;"></view>
            <view class="icon-container">
                <image class="icon-image" src="../../static/Images/icon.png" mode="aspectFit" />
            </view>
            <view class="strip-text text">{{appname}}</view>
            <view class="strip-text text">版本：{{appversion}}</view>
        </view>
        <view class="section-bottom">
            <view class="column-bottom column-bottom-left">
                <view class="bottom-content bottom-content-left">
                    <view class="bottom-text-small text-small">山东省海洋与渔业厅</view>
                    <view class="bottom-text-small text-small">山东海洋预报台</view>
                </view>
            </view>
            <view class="column-bottom column-bottom-right">
                <view class="bottom-content bottom-content-right text">版权所有</view>
            </view>
        </view>
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
export default {
    computed: {
        appname () { return appsettings.appname },
        appversion () { return appsettings.appversion }
    },
    methods: {
        // 禁止页面滚动
        stopscroll () {
            
        }
    }
}
</script>

<style scoped>
.page-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.section-top {
    width: 100%;
    height: 456upx;
    display: flex;
    flex-direction: column;
}

.section-bottom {
    width: 100%;
    height: 200upx;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row;
}

.icon-container {
    height: 220upx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-image {
    width: 220upx;
    height: 220upx;
}

.strip-text {
    height: 68upx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.text {
    color: #666;
    font-size: 34upx;
}
.text-small {
    color: #666;
    font-size: 30upx;
}

.column-bottom {
    flex: 1;
    display: flex;
    align-items: center;
}

.column-bottom-left {
    flex-direction: row-reverse;
}
.column-bottom-right {
    flex-direction: row;
}

.bottom-content {
    width: 75%;
    height: 100upx;
    display: flex;
}
.bottom-content-left {
    flex-direction: column;
}
.bottom-content-right {
    align-items: center;
    justify-content: center;
}

.bottom-text-small {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
