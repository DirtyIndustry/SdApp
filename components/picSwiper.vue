<template>
    <view >
        <!-- 图片上方标题 -->
        <view class="pic_title" :class="{pic_title_active: titleArray.length > 0}">{{pictureTitle}}</view>
        <!-- 图片 -->
        <swiper class="imgswiper" :current="imgindex" :autoplay="isPlaying" :interval="interval" duration="0" circular="true" @change="swiperchange"
            :style="{height: viewHeight + 'px'}">
            <swiper-item v-for="(item, index) in imgArray" :key="index">
                <image class="img" :src="item" mode="widthFix" @tap="picTap" @load="imageLoad" />
            </swiper-item>
        </swiper>
        <!-- 图片下方计数器 -->
        <view class="page_number">
            <text>第 {{imgindex + (imgArray.length === 0 ? 0 : 1)}}/{{imgArray.length}} 张</text>
        </view>
        <!-- 播放控制按钮 -->
        <view class="btn_panel" :class="{ btn_panel_hide: isButtonHide }">
            <view class="btn_box">
                <view class="prev" @tap="prev">
                    <image src="../../static/Images/btn_prev.png" mode="widthFix" />
                </view>
                <view class="play_stop">
                    <image :src="playButtonImg" mode="widthFix" @tap="play_pause" />
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
                pictureTitle: '',
                imgindex: 0,
                isPlaying: false,
                isButtonHide: false,
                viewHeight: '538px',
                btnTimer: undefined
            }
        },
        computed: {
            // 系统信息
            systemInfo: {
                get() { return this.$store.state.Infos.systeminfo }
            },
            // 播放键图标
            playButtonImg: {
                get () {
                    return this.isPlaying ? '../../static/Images/btn_stop.png' : '../../static/Images/btn_play.png'
                }
            }
        },
        watch: {
            imgArray: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.imgindex = 0
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
                    current: this.imgArray[this.imgindex],
                    urls: this.imgArray
                })
            },
            // 滑动图片
            swiperchange(e) {
                // console.log(e.detail.current)
                this.imgindex = e.detail.current
                this.initTitle()
            },
            // 播放
            play() {
                this.isPlaying = true
            },
            // 停止
            stop() {
                this.isPlaying = false
            },
            // 播放-暂停
            play_pause () {
                if (this.isPlaying === true) {
                    this.isPlaying = false
                } else {
                    this.isPlaying = true
                }
            },
            // 上一张
            prev() {
                if (this.imgArray.length > 0) {
                    if (this.imgindex === 0) {
                        this.imgindex = this.imgArray.length - 1
                    } else {
                        this.imgindex--
                    }
                    this.initTitle()
                }
            },
            // 下一张
            next() {
                if (this.imgArray.length > 0) {
                    if (this.imgindex < this.imgArray.length - 1) {
                        this.imgindex++
                    } else {
                        this.imgindex = 0
                    }
                    this.initTitle()
                }
            },
            // 初始化图片标题
            initTitle() {
                // 如果标题数组不为空 则显示标题
                if (this.titleArray.length > 0) {
                    if (this.imgindex < this.titleArray.length) {
                        this.pictureTitle = this.titleArray[this.imgindex]
                    } else {
                        this.pictureTitle = ''
                    }
                }
            },
            // 加载图片时设置框体高度
            imageLoad(e) {
                let imgwidth = e.detail.width
                let imgheight = e.detail.height
                let ratio = imgwidth / imgheight
                this.viewHeight = Math.ceil(this.systemInfo.windowWidth / ratio)
                // console.log(this.viewHeight)
            },
            // 启动按钮显隐计时器
            timerStart () {
                let that = this
                this.isButtonHide = false
                if (this.btnTimer !== undefined) {
                    clearInterval(this.btnTimer)
                    this.btnTimer = undefined
                }
                this.btnTimer = setTimeout(function(){
                    that.isButtonHide = true
                    that.btnTimer = undefined
                }, 6000)
            },
            // 图片点击
            picTap () {
                if (this.isButtonHide === true) {
                    this.timerStart()
                } else {
                    this.previewImage()
                }
                
            }
        }, // end-methods
        onReady() {
            this.imgindex = this.startIndex
            this.isPlaying = this.autoStart
            this.initTitle()
            this.timerStart()
        }
    }
</script>

<style>
    .pic_title {
        width: 100%;
        height: 80px;
        font-size: 28px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pic_title_active {
        background: #fff;
    }

    .page_number {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 20px 0;
    }

    .btn_panel {
        position: absolute;
        bottom: 80px;
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 100;
    }

    .btn_panel_hide {
        transition: opacity 2s ease, bottom 0s ease 2s;
        opacity: 0;
        bottom: -200px;
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

    .imgswiper {
        width: 100%;
        transition: height .2s ease-in;
    }

    .img {
        width: 100%;
    }
</style>