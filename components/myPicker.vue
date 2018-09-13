<template>
    <view>
        <!-- 背景蒙板 -->
        <view class="layer masklayer" v-show="panelshow" :style="{opacity: maskopacity}"  ></view>
        
        <view class="layer buttonlayer" v-show="panelshow" :style="{top: paneltop, opacity: panelopacity}" @tap="closeDialog" catchtouchmove="stopscroll">
            <!-- 选项按钮组 -->
            <view class="choose_box">
                <view class="chooseItem" v-for="(item, index) in items" :key="index" @tap="itemTap(index, item)">{{item}}</view>
            </view>
            <!-- 取消按钮 -->
            <view class="cancel" @tap="cancelTap">取消</view>
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
                maskopacity: 0,
                paneltop: '100%',
                panelopacity: 0
            }
        },
        watch: {
            show: {
                handler (newVal, oldVal) {
                    if (newVal === true) {
                        this.panelshow = true
                        setTimeout(function () {
                            this.paneltop = '0'
                            this.panelopacity = 100
                            this.maskopacity = 100
                        }.bind(this), 0)
                    } else {
                        this.panelopacity = 0
                        this.maskopacity = 0
                        setTimeout(function () {
                            this.paneltop = '100%'
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
                // this.show = false
                setTimeout(function(){
                    this.$emit('itemSelected', index, item)
                }.bind(this), 300)
            },
            // 取消点击
            cancelTap () {
                // this.show = false
            }
        }
    }
</script>

<style scoped>
    .layer {
        position: fixed;
        left: 0;
        width: 100%;
        height: 100%;
        transition: all .3s ease-out;
    }

    .masklayer {
        top: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .buttonlayer {
        z-index: 11;
    }

    .choose_box {
        width: 95%;
        border-radius: 24rpx;
        background: #fff;
        position: absolute;
        /* max-height: 720rpx;
        overflow-y: scroll; */
        left: 2.5%;
        bottom: 140rpx;
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
        bottom: 20rpx;
        left: 2.5%;
    }
</style>