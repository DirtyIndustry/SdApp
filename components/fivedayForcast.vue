<template>
<view class="fiveday-body">
    <view class="uni-flex uni-row">
        <!-- 依据fivedayWeather生成列 -->
        <view class="fiveday-column uni-flex uni-column" :class="{'fiveday-column-left': index<4}" v-for="(item, index) in fivedayWeather" :key="index">
            <!-- 自上而下分别为 周，日期，天气，天气图标，折线空格，风向，风力 -->
            <view class="flex-cell-single text">{{item.week}}</view>
            <view class="flex-cell-single text">{{item.date}}</view>
            <view class="flex-cell-single text">{{item.weather}}</view>
            <view class="flex-cell-single">
                <image :src="item.weatherIcon" mode="widthFix" style="width: 50px; height: 50px" />
            </view>
            <view class="flex-cell-quad"> </view>
            <view class="flex-cell-single text" :class="{'text-small': item.windDir.length > 4}">{{item.windDir}}</view>
            <view class="flex-cell-single text">{{item.windLvl}}</view>
        </view>
    </view>
    <view class="chart-fiveday">
        <myChart :option="option" :canvasId="canvasId" />
    </view>
</view>
</template>

<script>
import myChart from './myChart.vue'
export default {
    name: 'fivedayForcast',
    props: {
        // 五日天气预报数据
        fivedayWeather: {
            type: Array,
            default: [{}, {}, {}, {}, {}]
        },
        // 画布id 在页面中必须唯一
        canvasId: {
            type: String,
            required: true
        },
        // 图表数据
        option: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    components: {
        myChart
    },
}
</script>

<style scoped>
    @import "../common/generic.css";

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

    /* 5日天气预报的容器 */
    .fiveday-body {
        position: relative;
    }

	/* 5日天气预报的列 */
	.fiveday-column {
		flex: 1;
		height: 600px;
	}

	/* 5日天气预报非最右边的列 添加右边框 */
	.fiveday-column-left {
		border-right: 1px solid #000000;
	}

	/* 5日天气预报中每列中的单元格 */
	.flex-cell-single {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 5日天气预报中占四行高度的单元格 */
	.flex-cell-quad {
		flex: 4;
	}

	/* 五日天气预报气温图表 */
	.chart-fiveday {
		width: 100%;
		height: 235px;
		/* margin-top: -360px; */
		top: 240px;
		position: absolute;
	}

</style>
