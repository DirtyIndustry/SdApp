<template>
    <view>
        <view>渔场预报</view>
        <view>{{forecastDate}}</view>
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'

export default {
    data () {
        return {
            fisheryData: [],
            forecastDate: ''
        }
    },
    methods: {
        // 向服务器请求渔场数据
        loadFisheryData () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetFisheriesForecast_0831',
                data: {name: 'admin', areaflg: '山东'},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 渔场数据')
                    // console.log(res.data.d)
                    if (!res.data.d) { // 返回的值为空
                        console.log('[服务器]: 返回 渔场数据 返回值为空')
                        return false
                    }
                    let resarr = JSON.parse(res.data.d)
                    for(let i = 0; i < resarr.length; i++) {
                        switch (resarr[i].FORECASTAREA) {
                            case '渤海湾渔场':
                            case '莱州湾渔场':
                            case '烟威渔场':
                            case '威东渔场':
                            case '青海渔场':
                            case '石岛渔场':
                            case '石东渔场':
                                that.fisheryData.push(resarr[i])
                                break
                            default:
                                break
                        }
                    }
                } // end-success
            }) // end-request
        } // end-loadFisheryData()
    },
    onLoad () {
        this.loadFisheryData()
    }
}
</script>

<style>

</style>

