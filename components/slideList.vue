<template>
    <view>
        <view class="panel" :class="{hide: !show}" :style="{left: left}">
            <!-- 列表为空时显示 -->
            <view class="list-row cell-empty" v-if="list.length === 0" >{{placeholder}}</view>
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
                    <view class="cell-name">{{item.name}}</view>
                    <view class="cell-date">{{item.date}}</view>
                </view>
            </view>
            <!-- 列表底部占位 -->
            <view v-if="list.length !== 0" style="height: 40px;" />
        </view>
    </view>
</template>

<script>
export default {
    name: 'slideList',
    props: {
        // 列表内容
        list: {
            type: Array,
            default () {
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
            default () {
                return true
            }
        },
        // 列表空时的占位文字
        placeholder: {
            type: String,
            default () {
                return '列表为空'
            }
        }
    },
    methods: {
        // 点击列表中的警报
        itemTap (filename) {
            this.$emit('itemTap', filename)
        }
    }
}
</script>

<style>
@import "../common/FontAwesome.css";

.panel {
    /* border: 1px solid #000; */
    position: absolute;
    width: 90%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    transition: left .5s ease-in-out;
}

.hide {
    height: 0px;
    overflow: hidden;
}

.list-row {
    background-color: rgba(250, 250, 250, 0.8);
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
}
.border-top {
    border-top: 1px solid #000;
}

.cell-icon {
    height: 100px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-column {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.cell-name {
    flex: 2;
    font-size: 38px;
}

.cell-date {
    flex: 1;
    font-size: 23px;
    text-align: right;
}

.cell-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    color: #0092d4;
}

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
