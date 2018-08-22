<template>
    <view class="uni-flex uni-row">
        <!-- 城市气温 -->
        <view class="text grid-left">
            {{weatherData.temperature}}℃
        </view>
        <view class="uni-flex uni-column uni-flex-item grid-right">
            <!-- 城市天气 -->
            <view class="text weather-box">
                <image :src="weatherData.weatherIcon" mode="widthFix" style="width: 50px; height: 50px;" /> {{weatherData.weather}}
            </view>
            <view class="uni-flex uni-row">
                <!-- 城市空气质量 -->
                <view class="text uni-flex-item">
                    <image :src="weatherData.airconIcon" mode="widthFix" style="width: 30px; height: 50px;" /> {{weatherData.aircondition}}
                    {{weatherData.airconDesc}}
                </view>
                <!-- 城市pm2.5 -->
                <view class="text uni-flex-item">
                    <text v-bind:class="weatherData.pm25Style">PM2.5</text>
                    {{weatherData.pm25}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'weatherSection',
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
    .uni-flex {
        display: flex;
        flex-direction: row;
    }

    .uni-flex-item {
        flex: 1;
    }

    .uni-row {
        flex-direction: row;
    }

    .uni-column {
        flex-direction: column;
    }

    .text {
        margin: 10px;
        padding: 0 20px;
        background-color: #ebebeb;
        height: 70px;
        line-height: 70px;
        text-align: center;
        color: #cfcfcf;
        font-size: 26px;
    }

    /* 左边部分 显示气温的grid */
    .grid-left {
        width: 200px;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* 右边部分 显示详细信息的grid */
    .grid-right {
        justify-content: space-between;
    }

    /* 显示天气详情的单元格 */
    .weather-box {
        height: 120px;
        text-align: left;
        padding-left: 20px;
        padding-top: 10px;
    }

    /* 空气质量优 */
    .excellent {
        color: #52eb11;
    }

    /* 空气质量良 */
    .very {
        color: #267405;
    }

    /* 空气质量轻度污染 */
    .bad {
        color: #ff0000;
    }

    /* 空气质量重度污染 */
    .sev {
        color: #be0606;
    }
</style>