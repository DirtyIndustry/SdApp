<template>
    <view class="page-body">
        <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"
		/>
        <!-- 页眉空白 -->
        <view class="separator"></view>
        <!-- 标题部分 -->
        <view class="page-section">

            <view class="uni-flex uni-row title-section">
                <!-- 标题 -->
                <view class="title">
                    &nbsp;24小时海区预报
                </view>
                <!-- 日期 -->
                <view class="date small-text">{{forecastdate24h}}</view>
            </view>
            <oceanTable :data="oceantable24h"></oceanTable>
            <!-- 表格下方空白 -->
            <view class="separator"></view>
        
            <view class="uni-flex uni-row title-section">
                <!-- 标题 -->
                <view class="title">
                    &nbsp;48小时海区预报
                </view>
                <!-- 日期 -->
                <view class="date small-text">{{forecastdate48h}}</view>
            </view>
            <oceanTable :data="oceantable48h"></oceanTable>
            <!-- 表格下方空白 -->
            <view class="separator"></view>

            <view class="uni-flex uni-row title-section">
                <!-- 标题 -->
                <view class="title">
                    &nbsp;72小时海区预报
                </view>
                <!-- 日期 -->
                <view class="date small-text">{{forecastdate72h}}</view>
            </view>
            <oceanTable :data="oceantable72h"></oceanTable>
            
            <!-- 页脚空白 -->
            <view class="separator"></view>
        </view>
        
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import oceanTable from '../../components/oceanTable.vue'

export default {
    components: {
        oceanTable
    },
    data () {
        return {
            oceantable24h: [],
            oceantable48h: [],
            oceantable72h: [],
            forecastdate24h: '',
            forecastdate48h: '',
            forecastdate72h: ''
        }
    },
    methods: {
        // 向服务器请求海区数据
        loadOceanData () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetSeaAreaforecastWX_0912',
                data: {name: 'admin', areaflg: '北海'},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 海区数据')
                    // console.log(res.data.d)
                    if (!res.data.d) { // 返回的值为空
                        console.log('[服务器]: 返回 海区数据 返回值为空')
                        return false
                    }
                    let resarr = JSON.parse(res.data.d)
                    if (resarr.length === 0) {
                        console.log('[服务器]: 返回 海区数据 返回值为空')
                        return false
                    }
                    that.oceantable24h.length = 0
                    that.oceantable48h.length = 0
                    that.oceantable72h.length = 0
                    for (let i = 0; i < resarr.length; i++) {
                        if (resarr[i].seaname === '黄海南部') {
                            continue
                        }
                        that.oceantable24h.push({
                            seaname: resarr[i].seaname,
                            waveheight: resarr[i].waveheight24h,
                            wavedir: resarr[i].wavedir24h,
                            undercurrent: resarr[i].undercurrent24h
                        })
                        that.oceantable48h.push({
                            seaname: resarr[i].seaname,
                            waveheight: resarr[i].waveheight48h,
                            wavedir: resarr[i].wavedir48h,
                            undercurrent: resarr[i].undercurrent48h
                        })
                        that.oceantable72h.push({
                            seaname: resarr[i].seaname,
                            waveheight: resarr[i].waveheight72h,
                            wavedir: resarr[i].wavedir72h,
                            undercurrent: resarr[i].undercurrent72h
                        })
                    } // end-for
                    that.setForecastDate(resarr[0].publishdate)
                } // end-success
            }) // end-request
        }, // end-loadOceanData()
        // 生成标题栏日期字符串
        setForecastDate (publishdate) {
            let now = new Date(publishdate)
            let one = (now.getMonth() + 1) + '月' + now.getDate() + '日20时'
            now.setDate(now.getDate() + 1)
            let two = (now.getMonth() + 1) + '月' + now.getDate() + '日20时'
            now.setDate(now.getDate() + 1)
            let three = (now.getMonth() + 1) + '月' + now.getDate() + '日20时'
            now.setDate(now.getDate() + 1)
            let four = (now.getMonth() + 1) + '月' + now.getDate() + '日20时'
            this.forecastdate24h = one + '~' + two
            this.forecastdate48h = two + '~' + three
            this.forecastdate72h = three + '~' + four
        }
    },
    onLoad () {
        this.loadOceanData()
    },
    onPullDownRefresh() {
        console.log('pull down refresh.')
        this.loadOceanData()
        // 关闭提示
        uni.stopPullDownRefresh()
    }
}
</script>

<style scoped>
    .page-body {
        /* border: 1px solid #f00; */
		flex-grow: 1;
		overflow-x: hidden;
	}

	.page-section {
        position: relative;
        top: 0;
        left: 5%;
        width: 90%;
		/* height: 1480px; */
	}

    .uni-flex {
        display: flex;
        flex-direction: row;
    }

    .uni-row {
        flex-direction: row;
    }

    /* 标题部分容器 */
    .title-section {
        border-bottom: 1px solid #666;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 标题图标+渔场预报字样 */
    .title {
        /* border: 1px solid #f00; */
        flex: 3;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 33px;
        font-weight: bold;
        color: #0092d4;
    }

    /* 标题图标 */
    .title-icon {
        width: 60px;
        height: 60px;
    }

    /* 标题日期 */
    .date {
        /* border: 1px solid #000; */
        flex: 5;
        height: 80px;
        line-height: 125px;
        text-align: right;
    }

    /* 分隔空白 */
    .separator {
        height: 30px;
    }

    /* 较小字体 */
    .small-text {
        font-size: 26px;
    }
</style>

