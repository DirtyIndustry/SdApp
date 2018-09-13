<template>
    <view class="uni-flex uni-row title-section">
        <!-- 标题 -->
        <view class="title text-large text-bold text-blue">
            <image v-if="icon !== ''" class="title-icon" :src="icon" mode="widthFix" />
            &nbsp;{{title}}
        </view>
        <!-- 日期 -->
        <view class="date text-small">{{date}}</view>
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
@import "../common/text.css";
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
</style>
