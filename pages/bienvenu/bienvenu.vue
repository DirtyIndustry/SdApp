<template>
    <view class="page-body">
        <swiper class="container" indicator-dots="true" :style="{opacity: containeropacity}">
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageFir.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageSec.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageThi.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageFou.png" mode="aspectFill"/>
                <button plain="true" hover-stay-time="500" @tap="startbuttonTap">开启预报</button>
                <div class="skipbutton" @tap="skipbuttonTap">不再显示该页面</div>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import utils from '../../utils/utils.js'
export default {
    data () {
        return {
            containeropacity: 100,
            timerlist: []
        }
    },
    methods: {
        // 开始按钮点击
        startbuttonTap (e) {
            console.log('[界面]: 点击开始按钮')
            this.containeropacity = 0
            let timer = setTimeout(function () {
                clearTimeout(timer)
                this.gotoIndex()
            }.bind(this), 200)
            this.timerlist.push(timer)
            // this.gotoIndex()
        },
        // 跳过按钮点击
        skipbuttonTap (e) {
            console.log('[界面]: 跳过按钮点击')
            this.containeropacity = 0
            utils.storeToLocal('skipbienvenu', true)
            let timer = setTimeout(function () {
                clearTimeout(timer)
                this.gotoIndex()
            }.bind(this), 200)
            this.timerlist.push(timer)
            // this.gotoIndex()
        },
        // 检查是否跳过欢迎页
        checkSkip () {
            let that = this
            uni.getStorage({
                key: 'skipbienvenu',
                success: function (res) {
                    console.log('[缓存]: 获取 跳过欢迎页')
                    if (res.data === true) {
                        // 跳往首页
                        // setTimeout(function () {
                            that.gotoIndex()
                        // }.bind(that), 100)
                    }
                }
            })
        },
        // 前往首页
        gotoIndex () {
            uni.switchTab({
                url: '../index/index'
            })
        }
    },
    onLoad () {
        console.log('bienvenu page load.')
    },
    onShow () {
        console.log('bienvenu page show.')
    },
    onReady () {
        console.log('bienvenu page ready.')
        this.checkSkip()
    },
    onUnload () {
        for (let i = 0; i < this.timerlist.length; i++) {
            clearTimeout(this.timerlist[i])
            this.timerlist[i] = null
        }
    }
}
</script>

<style scoped>
.page-body {
    height: 100%;
    flex-grow: 1;
	overflow-x: hidden;
}
.container {
    height: 100%;
    opacity: 100;
    transition: opacity .2s ease;
}
image {
    width: 100%;
    height: 100%;
    z-index: 1;
}
button {
    position: fixed;
    bottom: 20%;
    left: 30%;
    width: 40%;
    border-color: #fff;
    color: #fff;
    z-index: 2;
}
.skipbutton {
    position: fixed;
    bottom: 10%;
    left: 30%;
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: underline;
}
</style>
