<template>
    <view>
        <!-- 图片上方标题 -->
        <view class="pic_title">{{pictureTitle}}</view>
        <!-- 图片 -->
        <swiper class="imgswiper" :current="imgindex" :autoplay="isPlaying" :interval="interval" duration="0" circular="true" @change="swiperchange"
            :style="{height: viewHeight + 'px'}">
            <swiper-item v-for="(item, index) in imgArray" :key="index">
                <image class="img" :src="item" mode="widthFix" @tap="previewImage" @load="imageLoad" />
            </swiper-item>
        </swiper>
        <!-- 图片下方计数器 -->
        <view class="page_number">
            <text>第 {{imgindex + (imgArray.length === 0 ? 0 : 1)}}/{{imgArray.length}} 张</text>
        </view>
        <!-- 播放控制按钮 -->
        <view class="btn_panel">
            <view class="btn_box">
                <view class="prev" @tap="prev">
                    <image src="../../static/Images/btn_prev.png" mode="widthFix" />
                </view>
                <view class="play_stop">
                    <image v-if="isPlaying" src="../../static/Images/btn_stop.png" mode="widthFix" @tap="stop" />
                    <image v-else src="../../static/Images/btn_play.png" mode="widthFix" @tap="play" />
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
                viewHeight: '538px'
            }
        },
        computed: {
            // 系统信息
            systemInfo: {
                get() { return this.$store.state.Infos.systeminfo }
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
            swiperchange(e) {
                console.log(e.detail.current)
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
            initTitle() {
                // 如果标题数组不为空 则显示标题
                if (this.titleArray.length > 0) {
                    if (this.imgindex < this.titleArray.length) {
                        this.pictureTitle = this.titleArray[this.imgindex]
                    } else {
                        this.pictureTitle = ""
                    }
                }
            },
            imageLoad(e) {
                let imgwidth = e.detail.width
                let imgheight = e.detail.height
                let ratio = imgwidth / imgheight
                this.viewHeight = Math.ceil(this.systemInfo.windowWidth / ratio)
                console.log(this.viewHeight)
            }
        }, // end-methods
        onReady() {
            this.imgindex = this.startIndex
            this.isPlaying = this.autoStart
            this.initTitle()
        }
    }
</script>

<style>
    .pic_title {
        width: 100%;
        height: 80px;
        background: #fff;
        font-size: 28px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page_number {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 20px 0;
    }

    .btn_panel {
        bottom: 160px;
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        height: 538px;
    }

    .img {
        width: 100%;
    }
</style>