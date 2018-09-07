<template>
<view class="tabbar-container">
    <!-- 左边的按钮 -->
    <view class="tabbar tabbar-left" :style="{width: leftTabWidth}">
        <view class="tabbar-button tabbar-button-left" :style="{width: sideButtonWidth + 'px'}" @tap="leftButtonTap">
            <view class="button-inner">{{leftLabel}}</view>
        </view>
        <view class="tabbar-button" :style="{width: midButtonWidth + 'px'}" @tap="midButtonTap">
            <view class="button-inner border-inner-middle">{{middleLabel}}</view>
        </view>
        <view class="tabbar-button tabbar-button-right" :style="{width: sideButtonWidth + 'px'}" @tap="rightButtonTap">
            <view class="button-inner">{{rightLabel}}</view>
        </view>
    </view>
    <!-- 右边的按钮顺 序是反的 右在左 左在右 -->
    <view class="tabbar tabbar-right" :style="{width: rightTabWidth}">
        <view class="tabbar-button tabbar-button-right" :style="{width: sideButtonWidth + 'px'}" @tap="rightButtonTap">
            <view class="button-inner">{{rightLabel}}</view>
        </view>
        <view class="tabbar-button" :style="{width: midButtonWidth + 'px'}" @tap="midButtonTap">
            <view class="button-inner border-inner-middle">{{middleLabel}}</view>
        </view>
        <view class="tabbar-button tabbar-button-left" :style="{width: sideButtonWidth + 'px'}" @tap="leftButtonTap">
            <view class="button-inner">{{leftLabel}}</view>
        </view>
    </view>
    <!-- 底层的按钮 -->
    <view class="tabbar tabbar-background">
        <view class="tabbar-button tabbar-button-left" :style="{width: sideButtonWidth + 'px'}">
            <view class="button-inner button-inner-background">{{leftLabel}}</view>
        </view>
        <view class="tabbar-button" :style="{width: midButtonWidth + 'px'}">
            <view class="button-inner border-inner-middle button-inner-background">{{middleLabel}}</view>
        </view>
        <view class="tabbar-button tabbar-button-right" :style="{width: sideButtonWidth + 'px'}">
            <view class="button-inner button-inner-background">{{rightLabel}}</view>
        </view>
    </view>
    <view class="marker marker-background"></view>
    <view class="marker marker-left" :style="{width: leftMarkerWidth}"></view>
    <view class="marker marker-right" :style="{width: rightMarkerWidth}"></view>
</view>
</template>

<script>
export default {
    name: 'flowTabbar',
    props: {
        // 左边按钮文字
        leftLabel: {
            type: String,
            default () {
                return ''
            }
        },
        // 中间按钮文字
        middleLabel: {
            type: String,
            default () {
                return ''
            }
        },
        // 右边按钮文字
        rightLabel: {
            type: String,
            default () {
                return ''
            }
        }
    },
    data () {
        return {
            sideButtonWidth: 0,
            midButtonWidth: 0,
            leftTabWidth: '5%',
            rightTabWidth: '65%',
            leftMarkerWidth: '8%',
            rightMarkerWidth: '74%',
            show: true
        }
    },
    computed: {
        // 系统信息
        systemInfo: {
            get() {return this.$store.state.Infos.systeminfo}
        }
    },
    methods: {
        // 设置按钮宽度
        setButtonWidth () {
            console.log(this.systemInfo.windowWidth)
            this.sideButtonWidth = this.systemInfo.windowWidth * 35 / 100
            this.midButtonWidth = this.systemInfo.windowWidth * 30 / 100
        },
        // 左按钮点击
        leftButtonTap(){
            this.leftTabWidth = '5%'
            this.rightTabWidth = '65%'
            this.leftMarkerWidth = '8%'
            this.rightMarkerWidth = '74%'
        },
        // 中按钮点击
        midButtonTap () {
            this.leftTabWidth = '35%'
            this.rightTabWidth = '35%'
            this.leftMarkerWidth = '41%'
            this.rightMarkerWidth = '41%'
        },
        // 右按钮点击
        rightButtonTap () {
            this.leftTabWidth = '65%'
            this.rightTabWidth = '5%'
            this.leftMarkerWidth = '73%'
            this.rightMarkerWidth = '9%'
        }
    },
    mounted () {
        this.setButtonWidth()
    }
}
</script>

<style>
.tabbar-container {
    position: relative;
}

.tabbar {
    /* border: 1px solid #000; */
    background-color: #fff;
    top: 0;
    height: 120px;
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    transition: width .5s ease-out;
}

.tabbar-left {
    width: 5%;
    flex-direction: row;
    left: 0;
    z-index: 5;
}
.tabbar-right {
    width: 65%;
    flex-direction: row-reverse;
    right: 1px;
    z-index: 5;
}

.tabbar-background {
    width: 100%;
    flex-direction: row;
    left: 0;
    z-index: 4;
}

.tabbar-button {
    /* border: 1px solid #0f0; */
    height: 120px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
}

.tabbar-button-left {
    /* border: 1px solid #f00; */
    left: 0;
}
.tabbar-button-right {
    /* border: 1px solid #00f; */
    right: 0;
}

.button-inner {
    /* border: 1px solid #f00; */
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.border-inner-middle {
    border-left: 1px solid #999999;
    border-right: 1px solid #999999;
}
.button-inner-background {
    color: #0092d4;
}

.marker {
    position: absolute;
    top: 120px;
    height: 5px;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    transition: width .5s ease-out;
}
.marker-background {
    background-color: #0092d4;
    width: 100%;
    z-index: 6;
}
.marker-left {
    background-color: #fff;
    width: 8%;
    left: 0;
    z-index: 7;
}
.marker-right {
    background-color: #fff;
    width: 74%;
    right: 0;
    z-index: 7;
}
</style>
