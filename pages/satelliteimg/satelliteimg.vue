<template>
    <view class="wrap" @tap="pageTap">
        <view style="height: 40px;"></view>
        <view class="choose_source" @tap="showModel">
            <picker @change="source_change" v-model="cityIndex" :range="sourceArray">
                <text class="choose-source-header text">数据源:&nbsp;&nbsp;</text>
                <text class="text text-blue">{{data_source}}&nbsp;&nbsp;</text>
                <text class="text text-blue fa fa-angle-down"></text>
            </picker>
        </view>
        <view class="separator"></view>
        <picSwiper :imgArray="imageArray" :startIndex="startIndex" :autoStart="autostart" interval="3000"
            ref="picswiper"></picSwiper>
    </view>
</template>

<script>
    import appsettings from '../../utils/appsettings.js'
    import picSwiper from '../../components/picSwiper.vue'

    export default {
        components: {
            picSwiper
        },
        data() {
            return {
                cityIndex: 0,
                data_source: '中国气象网',
                sourceArray: ['中国气象网'],
                imageArray: [],
                dateArray: [],
                startIndex: 0,
                autostart: false
            }
        },
        methods: {
            //切换数据源
            source_change(e) {
                // this.data_source = this.sourceArray[e.detail.value]
                switch (e.detail.value) {
                    case 0:
                        that.data_source = '中国'
                        break
                    default:break
                }
                this.requestImage(this.data_source)
            },
            // 向服务器请求图片
            requestImage(source) {
                let that = this
                uni.request({
                    url: appsettings.hosturl + 'GetSatelliteCloud_ZG_0905',
                    data: { name: 'admin', areaflg: '山东', flg: source },
                    method: 'POST',
                    success: function (res) {
                        console.log('[服务器]: 返回 卫星云图')
                        if (!res.data.d) {
                            console.log('[服务器]: 返回 卫星云图 返回值为空')
                            return false
                        }
                        let dataarr = JSON.parse(res.data.d)
                        // 清空现在的数组
                        that.imageArray.length = 0
                        that.dateArray.length = 0
                        // 将返回数据填入数组
                        for (let i = 0; i < dataarr.length; i++) {
                            that.imageArray.push(dataarr[i].url)
                            that.dateArray.push(dataarr[i].title)
                        }
                    }
                })
            }, // end-requestImage()
            // 页面点击
            pageTap() {
                this.$refs.picswiper.timerStart()
            }
        },
        onLoad() {
            this.requestImage(this.data_source)
        }
    }
</script>

<style>
    @import "../../common/FontAwesome.css";
    @import "../../common/text.css";

    Page {
        width: 100%;
        height: 100%;
    }

    .wrap {
        background: #f0eff5;
        width: 100%;
        height: 100%;
    }

    .choose_source {
        width: 100%;
        height: 80px;
        background-color: #fff;
        line-height: 80px;
    }

    .choose-source-header {
        margin-left: 100px;
    }

    .separator {
        height: 40px;
    }
</style>