<template>
    <view class="uni-flex uni-row title-section">
        <!-- 标题 -->
        <view class="title bold-text">
            <image v-if="icon !== ''" class="title-icon" :src="icon" mode="widthFix" />
            &nbsp;{{title}}
        </view>
        <!-- 日期 -->
        <view class="date small-text">{{date}}</view>
    </view>
</template>

<script>
export default {
    name: 'tableTitle',
    props: {
        // 标题
        title: {
            type: String,
            default () {
                return ''
            }
        },
        // 图标
        icon: {
            type: String,
            default () {
                return ''
            }
        },
        // 日期
        date: {
            type: String,
            default () {
                return ''
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
.uni-row {
    flex-direction: row;
}
/* 标题部分容器 */
.title-section {
    border-bottom: 1px solid #000;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}
/* 标题图标+渔场预报字样 */
.title {
    /* border: 1px solid #f00; */
    flex: 3;
    height: 60px;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    color: #0092d4;
}
/* 标题图标 */
.title-icon {
    width: 60px;
    height: 60px;
}

/* 标题日期 */
.date {
    /* border: 1px solid #000; */
    flex: 5;
    height: 80px;
    line-height: 125px;
    text-align: right;
}
/* 粗体字体 */
.bold-text {
    font-size: 37px;
    font-weight: bold;
}
/* 较小字体 */
.small-text {
    font-size: 26px;
}
</style>
