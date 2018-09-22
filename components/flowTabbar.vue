<template>
<view class="tabbar-container speed-up">
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
        <view class="tabbar tabbar-right" :style="{width: rightTabWidth, right: rightTabbarRight}">
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
        <!-- 蓝色指示器 -->
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
            sideButtonWidth: 0, // 两侧按钮的宽度
            midButtonWidth: 0,  // 中间按钮的宽度
            rightTabbarRight: '1upx',    // 右按钮组的右边距
            leftTabWidth: '6%',         // 左tabbar宽度
            rightTabWidth: '64%',       // 右tabbar宽度
            leftMarkerWidth: '8%',      // 左指示器宽度
            rightMarkerWidth: '74%',    // 右指示器宽度
            selectedIndex: 0    // 当前所选的tabindex
        }
    },
    computed: {
        // 系统信息
        systemInfo: {
            get() {return this.$store.state.Infos.systeminfo}
        }
    },
    watch: {
        // 所选tab改变
        selectedIndex: {
            handler (newVal, oldVal) {
                this.switchedToTab(newVal)
            }
        }
    },
    methods: {
        // 设置按钮宽度
        setButtonWidth () {
            this.sideButtonWidth = Math.round(this.systemInfo.windowWidth * 35 / 100)
            this.midButtonWidth = Math.round(this.systemInfo.windowWidth * 30 / 100)
        },
        // 设置右按钮组右边距
        setRightTabbarRight () {
            // console.log(this.systemInfo.windowWidth)
            // console.log(this.systemInfo.screenWidth)
            // console.log(this.systemInfo.system)
            // console.log(this.systemInfo.platform)
            if (this.systemInfo.platform === 'android') {
                if (this.sideButtonWidth + this.sideButtonWidth + this.midButtonWidth < this.systemInfo.windowWidth) {
                    this.rightTabbarRight = '2px'
                } else {
                    this.rightTabbarRight = '1px'
                }
            } else {
                this.rightTabbarRight = '0'
            }
        },
        // 将tab选择状态发送出去
        switchedToTab (index) {
            this.$emit('tabchange', index)
        },
        // 左按钮点击
        leftButtonTap(){
            this.leftTabWidth = '6%'
            this.rightTabWidth = '64%'
            this.leftMarkerWidth = '8%'
            this.rightMarkerWidth = '74%'
            this.selectedIndex = 0
        },
        // 中按钮点击
        midButtonTap () {
            this.leftTabWidth = '36%'
            this.rightTabWidth = '36%'
            this.leftMarkerWidth = '41%'
            this.rightMarkerWidth = '41%'
            this.selectedIndex = 1
        },
        // 右按钮点击
        rightButtonTap () {
            this.leftTabWidth = '64%'
            this.rightTabWidth = '6%'
            this.leftMarkerWidth = '73%'
            this.rightMarkerWidth = '9%'
            this.selectedIndex = 2
        }
    },
    onLoad () {
        this.setButtonWidth()
        this.setRightTabbarRight()
    },
    onShow () {
        this.switchedToTab(this.selectedIndex)
    }
}
</script>

<style scoped>
@import "../common/generic.css";
/* 控件最外城容器 */
.tabbar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}


/* 按钮组 */
.tabbar {
    background-color: #fff;
    top: 0;
    height: 120upx;
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    transition: width .5s ease-out;
}

/* 左按钮组 */
.tabbar-left {
    width: 6%;
    flex-direction: row;
    left: 0;
    z-index: 5;
}
/* 右按钮组 */
.tabbar-right {
    width: 64%;
    flex-direction: row-reverse;
    right: 0;
    z-index: 5;
}
/* 背景按钮组 */
.tabbar-background {
    width: 100%;
    flex-direction: row;
    left: 0;
    z-index: 4;
    box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.4);
}

/* 按钮组中的按钮 */
.tabbar-button {
    height: 120upx;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
}

/* 左边的按钮 */
.tabbar-button-left {
    left: 0;
}
/* 右边的按钮 */
.tabbar-button-right {
    right: 0;
}

/* 按钮内层容器 */
.button-inner {
    width: 100%;
    height: 80upx;
    display: flex;
    align-items: center;
    justify-content: center;
}
/* 中间按钮内层容器 */
.border-inner-middle {
    border-left: 1upx solid #999999;
    border-right: 1upx solid #999999;
}
/* 背景按钮组 按钮内层容器 */
.button-inner-background {
    color: #0092d4;
}

/* 下方蓝色指示器 */
.marker {
    position: absolute;
    top: 120upx;
    height: 5upx;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    transition: width .5s ease-out;
}
/* 背景指示器 */
.marker-background {
    background-color: #0092d4;
    width: 100%;
    z-index: 6;
}
/* 左指示器 */
.marker-left {
    background-color: #fff;
    width: 8%;
    left: 0;
    z-index: 7;
}
/* 右指示器 */
.marker-right {
    background-color: #fff;
    width: 74%;
    right: 0;
    z-index: 7;
}
</style>
