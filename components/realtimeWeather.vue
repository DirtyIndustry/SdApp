<template>
    <view class="body">
        <view class="column column-left">
            <view class="row-left">
                <view class="cell text-huge">{{weatherData.temperature}}</view>
                <view class="temp-marker">℃</view>
            </view>
        </view>
        <view class="column column-right">
            <view class="row">
                <view class="icon">
                    <view class="cell">
                        <image :src="weatherData.weatherIcon" mode="widthFix" style="width: 75upx; height: 70upx;" />
                    </view>
                </view>
                <view class="content" :class="{'text-large': weatherData.airconDesc.length < 5, text: weatherData.airconDesc.length > 4}">{{weatherData.weather}}</view>
            </view>
            <view class="row">
                <view class="icon">
                    <view class="cell">
                        <view class="fa fa-leaf font-icon" :class="{vert: weatherData.airconDesc === '优', jeune: weatherData.airconDesc === '良', orange: weatherData.airconDesc === '轻度污染', rouge: weatherData.airconDesc === '重度污染'}">
                            <view class="text-mini-icon">AQI</view>
                        </view>
                    </view>
                </view>
                <view class="content" :class="{'text-large': weatherData.airconDesc.length < 3, text: weatherData.airconDesc.length > 2}">{{weatherData.aircondition}}&nbsp;{{weatherData.airconDesc}}</view>
            </view>
            <view class="row">
                <view class="icon">
                    <view class="cell text-bold" :class="{vert: weatherData.pm25Desc === '优', jeune: weatherData.pm25Desc === '良', orange: weatherData.pm25Desc === '轻度污染', rouge: weatherData.pm25Desc === '重度污染'}">PM2.5</view>
                </view>
                <view class="content text-large">
                    {{weatherData.pm25}}
                    <view class="text-mini-content">&nbsp;&nbsp;μg/m³</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'realtimeWeather',
    props: {
        weatherData: {
            type: Object,
            default: {
                temperature: '25', // 气温
                aircondition: '35', // 空气质量
                airconDesc: '优',
                airconIcon: '../../static/Images/right_leaf_sev.png', // 空气质量绿叶图标
                weather: '晴',
                weatherIcon: '../../static/Images/right_weather_fine.png', // 天气图表
                pm25: '8', // PM2.5
                pm25Style: 'good'
            }
        }
    }
}
</script>

<style scoped>
@import "../common/FontAwesome.css";
@import "../common/generic.css";

.body {
    display: flex;
    flex-direction: row;
    height: 350rpx;
}

.column {
    display: flex;
    flex-direction: column;
}
.column-left {
    flex: 4;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.column-right {
    flex: 3;
}

.row-left {
    height: 38%;
    display: flex;
    flex-direction: row;
}
.row {
    flex: 1;
    display: flex;
    flex-direction: row;
}
.icon {
    flex: 2;
}
.font-icon {
    height: 100%;
    font-size: 50upx;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.content {
    flex: 3;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
}

.cell {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.temp-marker{
    color: #0092d4;
    font-size: 50upx;
    font-weight: bold;
}
.text-huge {
    color: #0092d4;
    font-size: 120upx;
    font-weight: bold;
}
.text-mini-icon {
    height: 55%;
    line-height: 400%;
    font-size: 20upx;
}
.text-mini-content {
    height: 55%;
    line-height: 350%;
    font-size: 20upx;
}

.vert {
    color: green;
}
.jeune {
    color: goldenrod;
}
.orange {
    color: Chocolate;
}
.rouge {
    color: red;
}
</style>

