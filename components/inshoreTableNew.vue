<template>
    <view>
        <view class="table-date text-small">{{tabledate}}</view>
        <!-- 近海预报表格 固定三列 -->
        <view class="table-body">
            <view class="uni-flex uni-column">
                <view class="inshore-row" :class="{'inshore-row-top': index == 0}" v-for="(item, index) in inshoreData.data"
                    :key="index">
                    <view class="inshore-cell inshore-column-head text">{{item.loc}}</view>
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
                    <view class="inshore-row inshore-row-top">
                        <view class="inshore-cell inshore-column-head text">青岛海域</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">浪高(m)</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">表层水温(℃)</view>
                    </view>
                    <view class="inshore-row">
                        <view class="inshore-cell inshore-column-head text">{{daytwo}}</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">{{inshoreData.extrawave48h}}</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">{{inshoreData.extratemp48h}}</view>
                    </view>
                    <view class="inshore-row">
                        <view class="inshore-cell inshore-column-head text">{{daythree}}</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">{{inshoreData.extrawave72h}}</view>
                        <view class="inshore-cell inshore-column inshore-column-right text">{{inshoreData.extratemp72h}}</view>
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
    @import "../common/generic.css";
    
    .table-date {
        position: relative;
        width: 90%;
        left: 5%;
        min-height: 5vw;
        text-align: right;
        display: flex;
        flex-direction: column;
    }

    .table-body {
        position: relative;
        width: 90%;
        left: 5%;
    }
    
    /* 近海预报表格的行 */
    .inshore-row {
        flex: 1;
        height: 70px;
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
        display: flex;
        flex-direction: row;
    }

    /* 近海预报表格的最底行 */
    .inshore-row-top {
        border-top: 1px solid #000;
    }

    /* 最左列 */
    .inshore-column-head {
        flex: 1;
    }

    /* 近海预报表格的列 */
    .inshore-column {
        flex: 1;
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

</style>