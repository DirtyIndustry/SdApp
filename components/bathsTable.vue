<template>
    <view v-show="showBaths">
        <view class="separator" />
        <view class="uni-flex uni-column table-body">
            <view class="uni-flex uni-row baths-row" :class="{'baths-row-top': index == 0}" v-for="(item, index) in bathsData" :key="index">
                <view class="baths-cell baths-column-dual text">{{item.BathsName}}</view>
                <view class="baths-cell baths-column baths-column-right text">{{item.WaveHeight}}</view>
                <view class="baths-cell baths-column baths-column-right text">{{item.WaterTemp}}</view>
                <view class="baths-cell baths-column baths-column-right text">{{item.Swimming}}</view>
            </view>
        </view>
        <view class="separator" />
    </view>
</template>

<script>
export default {
    name: 'bathsTable',
    props: {
        bathsData: {
            type: Array,
            default: [{
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            }]
        },
        showBaths: {
            type: Boolean,
            default: true
        }
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

    .table-body {
        position: relative;
        width: 90%;
        left: 5%;
    }
    .separator {
        height: 5vw;
    }

    /* 浴场预报表格的行 */
    .baths-row {
        flex: 1;
        height: 70px;
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }

    /* 浴场预报表格的最底行 */
    .baths-row-top {
        border-top: 1px solid #000;
    }

    /* 浴场预报表格的列 */
    .baths-column {
        flex: 4;
    }

    /* 两倍宽的列 */
    .baths-column-dual {
        flex: 7;
    }

    /* 浴场预报表格的非首列 */
    .baths-column-right {
        border-left: 1px solid #000;
    }

    /* 浴场预报单元格 */
    .baths-cell {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
