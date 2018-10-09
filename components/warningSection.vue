<template>
    <view v-show="hasWarning">
        <!-- 台风警报 -->
        <view class="warning-section" v-if="typhoon !== ''" @tap="$emit('typhoonTap')">
            <view class="warning-header">
                <image class="warning-header-icon" src="../../static/Images/bugle.png" mode="aspectFit"/>
                <view class="warning-header-text-container">
                    <view class="warning-header-text text-xxs">&nbsp;台风&nbsp;</view>
                </view>
            </view>
            <view class="warning-fader warning-fader-left"></view>
            <view class="warning-banner text" >
                {{typhoon}}
            </view>
            <view class="warning-banner warning-banner-follow text" >
                {{typhoon}}
            </view>
            <view class="warning-fader warning-fader-right"></view>
        </view>
        <!-- 分隔栏 -->
        <view style="height: 5upx;"></view>
        <!-- 海浪警报 -->
        <view class="warning-section" v-if="wave !== ''" @tap="$emit('waveTap')">
            <view class="warning-header">
                <image class="warning-header-icon" src="../../static/Images/warning.png" mode="aspectFit"/>
                <view class="warning-header-text-container">
                    <view class="warning-header-text text-xxs">&nbsp;海浪&nbsp;</view>
                </view>
            </view>
            <view class="warning-fader warning-fader-left"></view>
            <view class="warning-banner text" >
                {{wave}}
            </view>
            <view class="warning-banner warning-banner-follow text" >
                {{wave}}
            </view>
            <view class="warning-fader warning-fader-right"></view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'warningSection',
    props: {
        // 台风警报字符串
        typhoon: {
            type: String,
            default () {
                return ''
            }
        },
        // 海浪警报字符串
        wave: {
            type: String,
            default () {
                return ''
            }
        }
    },
    computed: {
        hasWarning () {
            return this.typhoon !== '' | this.wave !== ''
        }
    }
}
</script>

<style scoped>
@import "../common/generic.css";
.warning-section {
    border: 1upx solid #999;
    height: 60upx;
    position: relative;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.8);
}
.warning-header {
    position: absolute;
    top: 0;
    left: 0;
    height: 60upx; 
    width: 120upx;
    background-color: whitesmoke;
    display: flex;
    align-items: center;
    flex-direction: row;
    z-index: 6;
}
.warning-header-icon {
    width: 40upx;
    height: 40upx;
}
.warning-header-text-container {
    flex: 1;
    height: 60upx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.warning-header-text {
    border: 1upx solid #000;
    border-radius: 10upx;
    height: 38upx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.warning-fader {
    position: absolute;
    top: 0;
    width: 80upx;
    height: 60upx;
    z-index: 6;
}
.warning-fader-left {
    left: 120upx;
    background: linear-gradient(left, rgba(245,245,245,1), rgba(255,255,255,0));
}
.warning-fader-right {
    right: 0;
    background: linear-gradient(right, rgba(245,245,245,1), rgba(255,255,255,0));
}
.warning-banner {
    position: absolute;
    top: 0;
    left: 0;
    height: 60upx;
    display: flex;
    align-items: center;
    white-space: nowrap;
    animation-name: around;
    animation-duration: 14s;  /*过渡时间*/
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 5;
}
.warning-banner-follow {
    margin-left: 100%;
    animation-delay: 7s;
}
@keyframes around {
    from {
        margin-left: 100%;
    }
    to {
        margin-left: -180%;
    }
}
</style>
