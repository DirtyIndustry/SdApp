<template>
    <view class="page-body">
        <!-- <image class="trend-image" :src="trendurl" mode="widthFix" @tap="viewImage" /> -->
        <web-view v-if="url" :src="url"></web-view>
    </view>    
</template>

<script>
import appsettings from '../../utils/appsettings.js'
export default {
    data () {
        return {
            trendurl: '',
            url: 'http://123.234.129.237:8001/TrendPrediction/TrendPrediction.html'
        }
    },

    methods: {
        loadTrend () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetTrendImage',
                data: {name: 'admin', areaflg: '山东'},
                method: 'POST',
                success: function (res) {
                    console.log('成功获取趋势预测')
                    if (!res.data.d) {
                        console.log('返回值为空')
                        return false
                    }
                    that.trendurl = res.data.d
                    that.url = 'http://123.234.129.237:8001/TrendPrediction/TrendPrediction.html?picpath=' 
                        + that.trendurl
                }, // end-success-request
                fail: function (res) {
                    // 网络请求失败
                    return false
                }
            }) // end-request
            return true
        },
        viewImage () {
            let that = this
            uni.previewImage({
                urls: [that.trendurl],
                indicator: 'none'
            })
        }
    },
    onLoad () {
        this.loadTrend()
    }
}
</script>

<style scoped>
    .page-body {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }

    .trend-image {
        height: 100%;
        width: 100%;
    }
</style>
