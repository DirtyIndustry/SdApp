<template>
    <view>
        <view v-show="data.show">
            <!-- 地区名 -->
            <view>{{data.REPORTAREA}}</view>
            <!-- 图表部分 -->
            <view class="chart-weihai">
                <myChart :option="data.option" :canvasId="canvasId" ></myChart>
            </view>
            <!-- 数值面板 -->
            <view class="weihai-infopanel">
                <view class="weihai-infocolumn-side" />
                <view class="weihai-infocolumn">
                    <view>水温:{{data.WATERTEMP}}℃</view>
                </view>
                <view class="weihai-infocolumn">
                    <view>浪高:{{data.WAVEHEIGHT}}米</view>
                </view>
                <view class="weihai-infocolumn-side" />
            </view>
        </view>
    </view>
</template>

<script>
import utils from '../../utils/utils.js'
import myChart from './myChart.vue'

export default {
    name: 'weihaiSPChart',
    components: {
        myChart
    },
    props: {
        // 画布id 在页面中必须唯一
        canvasId: {
            type: String,
            required: true
        },
        // 表格数据
        data: {
            show: false,
            REPORTAREA: false,
            WATERTEMP: '',
            WAVEHEIGHT: '',
            option: {}
        }
    }
}
</script>

<style scoped>
	/* 威海专项图表 */
	.chart-weihai {
		width: 100%;
        height: 250upx;
        border: 1upx solid #000000;
	}

	/* 威海专项 图表下信息面板 */
	.weihai-infopanel {
		width: 100%;
		height: 50upx;
		display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
	}

	/* 威海专项 信息面板的列 */
	.weihai-infocolumn {
		flex: 2;
		display: flex;
        align-items: center;
        justify-content: center;
	}

	/* 威海专项 信息面板两侧留白列 */
	.weihai-infocolumn-side {
		flex: 1;
	}
</style>
