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
                    <image class="title-icon" src="../../static/Images/left_fishery.png" mode="widthFix" />
                    &nbsp;渔场预报
                </view>
                <!-- 日期 -->
                <view class="date small-text">{{forecastDate}}</view>
            </view>
            <!-- 标题下方空白 -->
            <view class="separator"></view>
            <!-- 表格部分 -->
            <view class="uni-flex uni-column">
                <!-- 表头 -->
                <view class="uni-flex uni-row fishery-header">
                    <view class="fishery-column-left fishery-cell">渔场名称</view>
                    <view class="fishery-column-left fishery-cell">时效(h)</view>
                    <view class="fishery-column-right fishery-column-middle fishery-cell">波高(m)</view>
                    <view class="fishery-column-right fishery-cell">浪向</view>
                </view>
                <!-- 表正文 -->
                <view class="uni-flex uni-row fishery-row" v-for="(item, index) in fisheryData" :key="index">
                    <!-- 第一列 渔场名 -->
                    <view class="fishery-column-left fishery-cell" :class="{'small-text': item.FORECASTAREA.length > 4}">{{item.FORECASTAREA}}</view>
                    <!-- 第二列 时效 -->
                    <view class="fishery-column-left">
                        <view class="fishery-cell">24</view>
                        <view class="fishery-cell">48</view>
                        <view class="fishery-cell">72</view>
                    </view>
                    <!-- 第三列 浪高 -->
                    <view class="fishery-column-right fishery-column-middle">
                        <view class="fishery-cell">{{item.WAVELVL}}</view>
                        <view class="fishery-cell">{{item.WAVELVL48H}}</view>
                        <view class="fishery-cell">{{item.WAVELVL72H}}</view>
                    </view>
                    <!-- 第四列 浪向 -->
                    <view class="fishery-column-right">
                        <view class="fishery-cell">{{item.WAVEDIR}}</view>
                        <view class="fishery-cell">{{item.WAVEDIR48H}}</view>
                        <view class="fishery-cell">{{item.WAVEDIR72H}}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 页脚空白 -->
        <view class="separator"></view>
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
                    if (resarr.length === 0) {
                        console.log('[服务器]: 返回 渔场数据 返回值为空')
                        return false
                    }
                    that.fisheryData.length = 0
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
        }, // end-loadFisheryData()
        // 生成标题栏日期字符串
        setForecastDate () {
            let now = new Date()
            let today = (now.getMonth() + 1) + '月' + now.getDate() + '日10时'
            now.setDate(now.getDate() + 3)
            let threedaysafter = (now.getMonth() + 1) + '月' + now.getDate() + '日10时'
            this.forecastDate = today + '~' + threedaysafter
        }
    },
    onLoad () {
        this.setForecastDate()
        this.loadFisheryData()
    },
    onPullDownRefresh() {
        console.log('pull down refresh.')
        this.setForecastDate()
        this.loadFisheryData()
        // 关闭提示
        uni.stopPullDownRefresh()
    }
}
</script>

<style>
    .page-body {
        /* border: 1px solid #f00; */
		padding: 0 30px;
		flex-grow: 1;
		overflow-x: hidden;
	}

	.page-section {
		height: 1480px;
		background-color: rgba(255, 255, 255, 0.8);
	}

    .uni-flex {
        display: flex;
        flex-direction: row;
    }

    .uni-row {
        flex-direction: row;
    }

    .uni-column {
        flex-direction: column;
    }

    /* 标题部分容器 */
    .title-section {
        border-bottom: 1px solid #000;
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
        font-size: 37px;
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

    /* 表格表头 */
    .fishery-header {
        border-top: 1px solid #999999;
        flex: 1;
        height: 60px;
    }

    /* 表格行 */
    .fishery-row {
        flex: 3;
        height: 180px;
    }

    /* 表格中填字的单元格 */
    .fishery-cell {
        border-bottom: 1px solid #999999;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    /* 表格左边较窄的列 */
    .fishery-column-left {
        border-right: 1px solid #999999;
        flex: 2;
        display: flex;
        flex-direction: column;
    }

    /* 表格右边较宽的列 */
    .fishery-column-right {
        /* border: 1px solid #f00; */
        flex: 3;
        display: flex;
        flex-direction: column;
    }

    /* 表格第三列 */
    .fishery-column-middle {
        border-right: 1px solid #999999;
    }

    /* 较小字体 */
    .small-text {
        font-size: 26px;
    }
</style>

