<template>
    <view class="page-body menu-page">
        <view class="uni-flex uni-column menu-table">
            <!-- 第一行 -->
            <view class="uni-flex uni-row menu-row">
                <!-- 第一行左 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="cityforeTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/city_img.png" />
                        <view class="menu-button-text">城市预报</view>
                    </button>
                </view>
                <!-- 第一行右 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" loading="true">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/Warning_img.png" />
                        <view class="menu-button-text">预警报</view>
                    </button>
                </view>
            </view>
            <!-- 第二行 -->
            <view class="uni-flex uni-row menu-row">
                <!-- 第二行左 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" loading="true">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/fishery_img.png" />
                        <view class="menu-button-text">渔场预报</view>
                    </button>
                </view>
                <!-- 第二行右 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="TrendTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/trendPrediction_img.png" />
                        <view class="menu-button-text">趋势预测</view>
                    </button>
                </view>
            </view>
            <!-- 第三行 -->
            <view class="uni-flex uni-row menu-row">
                <!-- 第三行左 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="WeatherTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/WeatherForecast_img.png" />
                        <view class="menu-button-text">天气预报</view>
                    </button>
                </view>
                <!-- 第三行右 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="WeatherimgTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/WeatherMap_img.png" />
                        <view class="menu-button-text">天气图</view>
                    </button>
                </view>
            </view>
            <!-- 第四行 -->
            <view class="uni-flex uni-row menu-row">
                <!-- 第四行左 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="SatelliteimgTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/SatelliteCloudMap_img.png" />
                        <view class="menu-button-text">卫星云图</view>
                    </button>
                </view>
                <!-- 第四行右 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="RadarimgTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/RadarMap_img.png" />
                        <view class="menu-button-text">雷达图</view>
                    </button>
                </view>
            </view>
            <!-- 第五行 -->
            <view class="uni-flex uni-row menu-row">
                <!-- 第五行左 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" @tap="TyphoonpathTap">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/Typhoon_img.png" />
                        <view class="menu-button-text">台风路径</view>
                    </button>
                </view>
                <!-- 第五行右 -->
                <view class="menu-cell menu-column">
                    <button class="menu-button" type="default" loading="true">
                        <image class="menu-button-icon" mode="aspectFit" src="../../static/Images/news_img.png" />
                        <view class="menu-button-text">新闻中心</view>
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        // 城市预报
        cityforeTap (e) {
            console.log('城市预报点击')
            uni.navigateTo({
                url: '../cityforecast/cityforecast'
            })
        },
        // 趋势预测
        TrendTap (e) {
            console.log('趋势预测点击')
            uni.navigateTo({
                url: '../trendprediction/trendprediction'
            })
        },
        // 天气预报
        WeatherTap (e) {
            console.log('天气预报点击')
            uni.navigateTo({
                url: '../weatherforecast/weatherforecast'
            })
        },
        // 天气图
        WeatherimgTap (e) {
            console.log('天气图点击')
            uni.navigateTo({
                url: '../weatherimgpage/weatherimgpage'
            })
        },
        // 卫星云图
        SatelliteimgTap (e) {
            console.log('卫星云图点击')
            uni.navigateTo({
                url: '../satelliteimgpage/satelliteimgpage'
            })
        },
        // 雷达图
        RadarimgTap (e) {
            console.log('雷达图点击')
            uni.navigateTo({
                url: '../radarimgpage/radarimgpage'
            })
        },
        // 台风路径
        TyphoonpathTap (e) {
            console.log('台风路径点击')
            uni.navigateTo({
                url: '../typhoonmap/typhoonmap'
            })
        }
    }
}
</script>

<style>
	@import "../../common/uni.css";

	.page-body {
		height: 100%;
		padding: 0 30px;
		flex-grow: 1;
		overflow-x: hidden;
	}

    .menu-page {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .menu-table {
        height: 85%;
        width: 98%;
        /* border: 1px solid #f00; */
    }

    .menu-row {
        flex: 1;
        /* border: 1px solid #000; */
    }

    .menu-column {
        flex: 1;
        /* border: 1px solid #0f0; */
    }

    .menu-cell {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .menu-button {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #0092d4;
    }

    .menu-button-icon {
        width: 50px;
        height: 50px;
        /* border: 1px solid #f00; */
    }

    .menu-button-text {
        color: #0092d4;
        /* border: 1px solid #000; */
    }
</style>
