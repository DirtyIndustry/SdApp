<template>
    <view v-show="showBaths">
        <view>浴场预报</view>
        <view class="uni-flex uni-column">
            <view class="uni-flex uni-row baths-row" :class="{'baths-row-top': index == 0}" v-for="(item, index) in bathsData" :key="index">
                <view class="baths-cell baths-column-dual">{{item.BathsName}}</view>
                <view class="baths-cell baths-column baths-column-right">{{item.WaveHeight}}</view>
                <view class="baths-cell baths-column baths-column-right">{{item.WaterTemp}}</view>
                <view class="baths-cell baths-column baths-column-right">{{item.Swimming}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'bathsTable',
    props: {
        bathsData: {
            type: Array,
            default: [{
                PublishDate: "",
                BathsName: "",
                WaveHeight: "",
                WaterTemp: "",
                Swimming: ""
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

    /* 浴场预报表格的行 */
    .baths-row {
        flex: 1;
        height: 100px;
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
        flex: 1;
    }

    /* 两倍宽的列 */
    .baths-column-dual {
        flex: 2;
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
