<template>
    <view>
        <!-- 背景蒙板 -->
        <view class="masklayer" v-show="panelshow" :style="{opacity: maskopacity}" @tap="closeDialog" catchtouchmove="stopscroll"></view>
        
        <view>
            <!-- 选项按钮组 -->
            <view class="choose_box" :style="{bottom: listbottom, opacity: listopacity}">
                <view class="chooseItem" v-for="(item, index) in items" :key="index" @tap="itemTap(index, item)">{{item}}</view>
            </view>
            <!-- 取消按钮 -->
            <view class="cancel" :style="{bottom: cancelbottom, opacity: cancelopacity}" @tap="cancelTap">取消</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'myPicker',
        props: {
            items: {
                type: Array,
                default() {
                    return ['选项1', '选项2', '选项3', '选项4']
                }
            }
        },
        data() {
            return {
                show: false,
                panelshow: false,
                // listbottom: '140px',
                // cancelbottom: '20px'
                listbottom: '-1024rpx',
                cancelbottom: '-1024rpx',
                maskopacity: 0,
                listopacity: 0,
                cancelopacity: 0
            }
        },
        watch: {
            show: {
                handler (newVal, oldVal) {
                    if (newVal === true) {
                        this.panelshow = true
                        setTimeout(function () {
                            this.listbottom = '140rpx'
                            this.cancelbottom = '20rpx'
                            this.maskopacity = 100
                            this.listopacity = 100
                            this.cancelopacity = 100
                        }.bind(this), 0)
                    } else {
                        this.listopacity = 0
                        this.cancelopacity = 0
                        this.maskopacity = 0
                        setTimeout(function () {
                            this.listbottom = '-1024rpx'
                            this.cancelbottom = '-1024rpx'
                            this.panelshow = false
                        }.bind(this), 300)
                    }
                }
            }
        },
        methods: {
            showDialog() {
                console.log('picker show')
                this.show = true
            },
            closeDialog() {
                console.log('picker hide')
                this.show = false
            },
            switchDialog() {
                this.show = !this.show
            },
            stopscroll() {
                // 阻止背后页面滚动
            },
            // 选项点击
            itemTap(index, item) {
                this.show = false
                setTimeout(function(){
                    this.$emit('itemSelected', index, item)
                }.bind(this), 300)
            },
            // 取消点击
            cancelTap () {
                this.show = false
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
        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity .3s ease-out;
    }

    .choose_box {
        width: 95%;
        border-radius: 24rpx;
        background: #fff;
        position: absolute;
        /* max-height: 720rpx;
        overflow-y: scroll; */
        left: 2.5%;
        /* bottom: 140px; */
        transition: all .3s ease-out;
        z-index: 11;
    }

    .chooseItem {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        color: #007eff;
        font-size: 32rpx;
        border-bottom: #d8d8d8 2rpx solid;
    }

    .chooseItem:last-child {
        border: none;
    }

    .cancel {
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
        /* bottom: 20px; */
        left: 2.5%;
        transition: all .3s ease-out;
        z-index: 11;
    }

    .inner-canvas {
        width: 100%;
        height: 100%;
    }
</style>