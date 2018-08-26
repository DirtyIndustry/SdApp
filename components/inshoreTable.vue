<template>
    <view>
        <view>{{inshoreData.location}}</view>
        <!-- 近海预报表格 固定三列 -->
        <view class="uni-flex uni-column">
            <view class="uni-flex uni-row inshore-row" :class="{'inshore-row-top': index == 0}" v-for="(item, index) in inshoreData.data"
                :key="index">
                <view class="inshore-cell inshore-column">{{item.loc}}</view>
                <view class="inshore-cell inshore-column inshore-column-right">{{item.wave}}</view>
                <view class="inshore-cell inshore-column inshore-column-right">{{item.temp}}</view>
            </view>
        </view>
        <!-- 占位 -->
        <view style="height: 60px;" />
        <!-- 地区为青岛时 显示额外表格 -->
        <view v-if="inshoreData.showextra">
            <view>青岛海域</view>
            <!-- 表头部分 -->
            <view class="uni-flex uni-column">
                <view class="uni-flex uni-row inshore-row inshore-row-top">
                    <view class="inshore-cell inshore-column">海域</view>
                    <view class="inshore-cell inshore-column inshore-column-right">浪高(m)</view>
                    <view class="inshore-cell inshore-column inshore-column-right">表层水温(℃)</view>
                </view>
            </view>
            <!-- 四列 第一列为青岛近海 第二列为48h,72h 第三列为海浪48h,72h 第四列为水温48h,72h -->
            <view class="uni-flex uni-row">
                <view class="uni-flex uni-column inshore-column">
                    <view class="inshore-row-clean border-horizontal" style="text-align: center; line-height: 150px;">青岛</view>
                    <view class="inshore-row-clean border-horizontal" style="border-bottom: 1px solid #000; text-align: center;">近海</view>
                </view>
                <view class="uni-flex uni-column inshore-column">
                    <view class="inshore-cell inshore-row-clean">48h</view>
                    <view class="inshore-cell inshore-row-clean border-vertical">72h</view>
                </view>
                <view class="uni-flex uni-column inshore-column-dual">
                    <view class="inshore-cell inshore-row-clean border-horizontal">{{inshoreData.extra.wave48h}}</view>
                    <view class="inshore-cell inshore-row-clean border-horizontal border-vertical">{{inshoreData.extra.wave72h}}</view>
                </view>
                <view class="uni-flex uni-column inshore-column-dual">
                    <view class="inshore-cell inshore-row-clean" style="border-right: 1px solid #000;">{{inshoreData.extra.temp48h}}</view>
                    <view class="inshore-cell inshore-row-clean border-vertical" style="border-right: 1px solid #000;">{{inshoreData.extra.temp72h}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'inshoreTable',
        props: {
            inshoreData: {
                type: Object,
                default: {
                    location: '',
                    time: '',
                    data: [],
                    extra: {}
                }
            }
        }
    };
</script>

<style scoped>
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

    /* 近海预报表格的行 */
    .inshore-row {
        flex: 1;
        height: 100px;
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }

    /* 近海预报表格的最底行 */
    .inshore-row-top {
        border-top: 1px solid #000;
    }

    /* 近海预报表格的行 不带边框 */
    .inshore-row-clean {
        flex: 1;
        height: 100px;
    }

    /* 近海预报表格的列 */
    .inshore-column {
        flex: 1;
    }

    /* 两倍宽的列 */
    .inshore-column-dual {
        flex: 2;
    }

    /* 近海预报表格的非首列 */
    .inshore-column-right {
        border-left: 1px solid #000;
    }

    /* 近海预报单元格 */
    .inshore-cell {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 左右边框 */
    .border-horizontal {
        border-left: 1px solid #000;
        border-right: 1px solid #000;
    }

    /* 上下边框 */
    .border-vertical {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
    }
</style>
