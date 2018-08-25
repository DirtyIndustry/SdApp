<template>
    <view class="page-body">
        <image class="trend-image" :src="trendurl" mode="widthFix" />
    </view>    
</template>

<script>
import appsettings from '../../utils/appsettings.js'
export default {
    data () {
        return {
            trendurl: ''
        }
    },

    methods: {
        loadTrend () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetTrendPrediction',
                data: {name: 'admin', areaflg: '山东'},
                method: 'POST',
                success: function (res) {
                    console.log('成功获取趋势预测')
                    if (!res.data.d) {
                        console.log('返回值为空')
                        return false
                    }
                    that.trendurl = res.data.d
                }, // end-success-request
                fail: function (res) {
                    // 网络请求失败
                    return false
                }
            }) // end-request
            return true
        }
    },
    onLoad () {
        this.loadTrend()
    }
}
</script>

<style>
    .page-body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-grow: 1;
		overflow-x: hidden;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .trend-image {
        height: 100%;
        width: 100%;
    }
</style>
