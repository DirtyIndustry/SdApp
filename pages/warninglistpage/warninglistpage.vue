<template>
<view>
    <flowTabbar></flowTabbar>
    <view class="page-body">
        <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"
		/>
    </view>
</view>
</template>

<script>
import flowTabbar from '../../components/flowTabbar.vue'
export default {
    components: {
        flowTabbar
    },
    data () {
        return {
            sideButtonWidth: 0,
            midButtonWidth: 0,
            leftTabWidth: '100%',
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
        leftButtonTap(){
            if (this.leftTabWidth !== '100%') {
                this.leftTabWidth = '100%'
            } else {
                this.leftTabWidth = '35%'
            }
        }
    },
    onLoad () {
        this.setButtonWidth()
    },
    onPullDownRefresh() {
        // 1秒后关闭提示
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }.bind(this), 1000)
    }
}
</script>

<style>
.page-body {
    /* border: 1px solid #f00; */
    padding: 0 30px;
    flex-grow: 1;
    overflow-x: hidden;
}

.tabbar-left {
    /* border: 1px solid #000; */
    background-color: #fff;
    top: 0;
    left: 0;
    width: 35%;
    height: 120px;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    transition: width .4s ease;
}

.tabbar-button-left {
    /* border: 1px solid #f00; */
    left: 0;
    height: 120px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
}

.tabbar-button-middle {
    /* border: 1px solid #0f0; */
    height: 120px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
}

.tabbar-button-right {
    /* border: 1px solid #00f; */
    right: 0;
    height: 120px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
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
    border-left: 1px solid #666;
    border-right: 1px solid #666;
}
</style>
