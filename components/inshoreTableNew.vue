<template>
    <view>
        <view class="table-date text-small">{{tabledate}}</view>
        <!-- 近海预报表格 固定三列 -->
        <view class="table-body">
            <view class="uni-flex uni-column">
                <view class="uni-flex uni-row inshore-row" :class="{'inshore-row-top': index == 0}" v-for="(item, index) in inshoreData.data"
                    :key="index">
                    <view class="inshore-cell inshore-column text">{{item.loc}}</view>
                    <view class="inshore-cell inshore-column inshore-column-right text">{{item.wave}}</view>
                    <view class="inshore-cell inshore-column inshore-column-right text">{{item.temp}}</view>
                </view>
            </view>
        </view>
        <!-- 占位 -->
        <view class="separator" />
        <!-- 地区为青岛时 显示额外表格 -->
        <view v-if="inshoreData.showextra">
            <!-- 表头部分 -->
            <view class="table-body">
                <view class="uni-flex uni-column">
                    <view class="uni-flex uni-row inshore-row inshore-row-top">
                        <view class="inshore-cell inshore-column text">青岛海域</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">浪高(m)</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">表层水温(℃)</view>
                    </view>
                </view>
                <!-- 四列 第一列为青岛近海 第二列为48h,72h 第三列为海浪48h,72h 第四列为水温48h,72h -->
                <view class="uni-flex uni-row">
                    <view class="uni-flex uni-column inshore-column border-left">
                        <view class="inshore-cell inshore-row-clean text">{{daytwo}}</view>
                        <view class="inshore-cell inshore-row-clean border-vertical text">{{daythree}}</view>
                    </view>
                    <view class="uni-flex uni-column inshore-column">
                        <view class="inshore-cell inshore-row-clean border-horizontal text">{{inshoreData.extra.wave48h}}</view>
                        <view class="inshore-cell inshore-row-clean border-horizontal border-vertical text">{{inshoreData.extra.wave72h}}</view>
                    </view>
                    <view class="uni-flex uni-column inshore-column">
                        <view class="inshore-cell inshore-row-clean text" style="border-right: 1px solid #000;">{{inshoreData.extra.temp48h}}</view>
                        <view class="inshore-cell inshore-row-clean border-vertical text" style="border-right: 1px solid #000;">{{inshoreData.extra.temp72h}}</view>
                    </view>
                </view>
            </view>
            <!-- 占位 -->
            <view class="separator" />
        </view>
    </view>
</template>

<script>
    export default {
        name: 'inshoreTableNew',
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
        },
        data () {
            return {
                dayone: '',
                daytwo: '',
                daythree: '',
            }
        },
        computed:{
            tabledate () {
                if (this.inshoreData.showextra) {
                    return this.dayone + '0时—' + this.daytwo + '0时'
                } else {
                    return ''
                }
            }
        },
        methods: {
            // 根据当前时间获取显示用日期字符串
            getDate () {
                let now = new Date()
                this.dayone = (now.getMonth() + 1) + '月' + now.getDate() + '日'
                now.setDate(now.getDate() + 1)
                this.daytwo = (now.getMonth() + 1) + '月' + now.getDate() + '日'
                now.setDate(now.getDate() + 1)
                this.daythree = (now.getMonth() + 1) + '月' + now.getDate() + '日'
            }
        },
        onLoad () {
            this.getDate()
        }
    }
</script>

<style scoped>
    @import "../common/text.css";
    
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

    .table-date {
        position: relative;
        width: 90%;
        left: 5%;
        min-height: 5vw;
        text-align: right;
    }

    .table-body {
        position: relative;
        width: 90%;
        left: 5%;
    }

    .separator {
        height: 5vw
    }

    /* 近海预报表格的行 */
    .inshore-row {
        flex: 1;
        height: 70px;
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
        height: 70px;
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

    .border-left {
        border-left: 1px solid #000;
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