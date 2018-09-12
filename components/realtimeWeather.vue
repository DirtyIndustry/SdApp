<template>
    <view class="body">
        <view class="column">
            <view class="cell text-big">{{weatherData.temperature}}℃</view>
        </view>
        <view class="column">
            <view class="row">
                <view class="icon">
                    <view class="cell">
                        <image :src="weatherData.weatherIcon" mode="widthFix" style="width: 75px; height: 70px;" />
                    </view>
                </view>
                <view class="content text">{{weatherData.weather}}</view>
            </view>
            <view class="row">
                <view class="icon">
                    <view class="cell">
                        <view class="fa fa-leaf font-icon" :class="{vert: weatherData.airconDesc === '优', jeune: weatherData.airconDesc === '良', orange: weatherData.airconDesc === '轻度污染', rouge: weatherData.airconDesc === '重度污染'}">
                            <view class="text-mini-icon">AQI</view>
                        </view>
                    </view>
                </view>
                <view class="content text">{{weatherData.aircondition}}&nbsp;{{weatherData.airconDesc}}</view>
            </view>
            <view class="row">
                <view class="icon">
                    <view class="cell text-bold" :class="weatherData.pm25Style">PM2.5</view>
                </view>
                <view class="content text">
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

.body {
    display: flex;
    flex-direction: row;
    height: calc(100vw / 2.5);
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
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
    font-size: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.content {
    flex: 3;
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

.text-big {
    color: #0092d4;
    font-size: 100px;
    font-weight: bold;
}
.text-bold {
    font-weight: bold;
}
.text {
    font-size: 38px;
}
.text-mini-icon {
    /* border: 1px solid #000; */
    height: 55%;
    line-height: 400%;
    font-size: 20px;
}
.text-mini-content {
    height: 55%;
    line-height: 350%;
    font-size: 20px;
}
/* 空气质量优 */
.excellent {
    color: green;
}

/* 空气质量良 */
.very {
    color: goldenrod;
}

/* 空气质量轻度污染 */
.bad {
    color: Chocolate;
}

/* 空气质量重度污染 */
.sev {
    color: red;
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

