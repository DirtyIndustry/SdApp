<template>
    <view class="table-container">
        <view class="separator" />
        <view class="table-body">
            <view class="table-row">
                <view class="table-cell border-top border-left text">海区</view>
                <view class="table-cell border-top text">波高(m)</view>
                <view class="table-cell border-top text">波向</view>
                <view class="table-cell border-top text">涌向</view>
            </view>
            <view class="table-row" v-for="(item, index) in data" :key="index">
                <view class="table-cell border-left text">{{item.seaname}}</view>
                <view class="table-cell text">{{item.waveheight}}</view>
                <view class="table-cell text">{{item.wavedir}}</view>
                <view class="table-cell text">{{item.undercurrent}}</view>
            </view>
        </view>
        <view class="separator" />
    </view>
</template>

<script>
export default {
    name: 'oceanTable',
    props: {
        data: {
            type: Array,
            default () {
                return []
            },
            required: true
        }
    }
}
</script>

<style scoped>
@import "../common/generic.css";

.table-container {
    position: relative;
    top: 0;
    left: 0;
	flex-grow: 1;
}
.table-body {
    /* border: 1px solid #000; */
    position: relative;
    left: 3.5%;
    width: 93%;
    display: flex;
    flex-direction: column;
}
.table-row {
    height: 70px;
    display: flex;
    flex-direction: row;
}
.border-top {
    border-top: 1px solid #666;
}
.border-left {
    border-left: 1px solid #666;
}
.table-cell {
    border-bottom: 1px solid #666;
    border-right: 1px solid #666;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.separator {
    height: 3.5vw;
}
</style>
