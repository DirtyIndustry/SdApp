<template>
    <view class="panel" :class="{hide: !show}" :style="{left: left}">
        <!-- 列表为空时显示 -->
        <view class="list-body list-row cell-empty" v-if="list.length === 0">{{placeholder}}</view>
        <!-- 内容列表 -->
        <view class="list-body">
            <!-- 列表行 -->
            <view class="list-row" :class="{'border-top': index !== 0}" v-for="(item, index) in list" :key="index" @tap="itemTap(item.filename)">
                <!-- 图标列 -->
                <view class="cell-icon">
                    <!-- 解除警报图标 -->
                    <view v-if="item.dismiss" class="fa fa-bell-slash-o dismiss"></view>
                    <!-- 警报图标 -->
                    <view v-else class="fa" :class="{'fa-exclamation-triangle rouge': item.level==='红色', 'fa-exclamation-triangle orange': item.level==='橙色', 'fa-exclamation-circle jeune': item.level==='黄色', 'fa-exclamation-circle bleu': item.level==='蓝色'}"></view>
                </view>
                <!-- 文字列 -->
                <view class="content-column">
                    <view class="cell-name">&nbsp;{{item.name}}</view>
                    <view class="cell-date">{{item.date}}&nbsp;&nbsp;</view>
                </view>
            </view>
        </view>
        <!-- 列表底部占位 -->
        <view v-if="list.length !== 0" style="height: 40px;" />
    </view>
</template>

<script>
    export default {
        name: 'slideList',
        props: {
            // 列表内容
            list: {
                type: Array,
                default() {
                    return []
                }
            },
            // 左边距
            left: {
                type: String
            },
            // 是否显示该控件
            show: {
                type: Boolean,
                default() {
                    return true
                }
            },
            // 列表空时的占位文字
            placeholder: {
                type: String,
                default() {
                    return '列表为空'
                }
            }
        },
        methods: {
            // 点击列表中的警报
            itemTap(filename) {
                this.$emit('itemTap', filename)
            }
        }
    }
</script>

<style>
    @import "../common/FontAwesome.css";

    /* 最外层容器 */
    .panel {
        /* border: 1px solid #000; */
        position: absolute;
        width: 90%;
        transition: left .5s ease-in-out;
    }

    /* 移出屏幕时不占屏幕高度 */
    .hide {
        height: 0px;
        overflow: hidden;
    }

    /* 列表容器 */
    .list-body {
        border-radius: 15px;
        background-color: rgba(250, 250, 250, 0.8);
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    }

    /* 列表行 */
    .list-row {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: row;
    }

    /* 列表中的横分隔线 */
    .border-top {
        border-top: 1px solid #999;
    }

    /* 左边显示icon的单元格 */
    .cell-icon {
        height: 100px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 右边显示文字内容的列 */
    .content-column {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /* 显示警报名的单元格 */
    .cell-name {
        flex: 2;
        font-size: 38px;
    }

    /* 显示日期的单元格 */
    .cell-date {
        flex: 1;
        font-size: 23px;
        text-align: right;
    }

    /* 列表为空时 placeholder的单元格 */
    .cell-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 38px;
        color: #0092d4;
    }

    /* 图标颜色 */
    .rouge {
        color: red
    }

    .orange {
        color: orange
    }

    .jeune {
        color: #ffcc55;
    }

    .bleu {
        color: #004499
    }

    .dismiss {
        color: #009955
    }
</style>