<template>
<view class="page-body">
    <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"/>
    <flowTabbar leftLabel="风暴潮" middleLabel="海浪警报" rightLabel="海冰警报" @buttontap="switchTab"></flowTabbar>
    <view style="height: 160px;" />
    <view>
        <!-- 左列表 -->
        <view class="panel panel-left" :style="{left: listLeftLeft}">
            <!-- 列表为空时显示 -->
            <view class="warning-row cell-empty" v-if="listLeft.length === 0" >近期没有风暴潮警报</view>
            <!-- 列表行 -->
            <view class="warning-row" :class="{'border-top': index !== 0}" v-for="(item, index) in listLeft" :key="index" @tap="warningTap(item.filename)">
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
            <view v-if="listLeft.length !== 0" style="height: 40px;" />
        </view>
        <!-- 中列表 -->
        <view class="panel panel-middle" :style="{left: listMiddleLeft}">
            <!-- 列表为空时显示 -->
            <view class="warning-row cell-empty" v-if="listMiddle.length === 0" >近期没有海浪警报</view>
            <!-- 列表行 -->
            <view class="warning-row" :class="{'border-top': index !== 0}" v-for="(item, index) in listMiddle" :key="index" @tap="warningTap(item.filename)">
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
            <view v-if="listMiddle.length !== 0" style="height: 40px;" />
        </view>
        <!-- 右列表 -->
        <view class="panel panel-right" :style="{left: listRightLeft}">
            <!-- 列表为空时显示 -->
            <view class="warning-row cell-empty" v-if="listRight.length === 0" >近期没有海冰警报</view>
            <!-- 列表行 -->
            <view class="warning-row" :class="{'border-top': index !== 0}" v-for="(item, index) in listRight" :key="index" @tap="warningTap(item.filename)">
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
            <view v-if="listRight.length !== 0" style="height: 40px;" />
        </view>
    </view>
</view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import utils from '../../utils/utils.js'
import flowTabbar from '../../components/flowTabbar.vue'
export default {
    components: {
        flowTabbar
    },
    data () {
        return {
            // 完成的请求计数
            completedRequestCount: 0,
            listLeft: [],       // 三个列表的内容数据
            listMiddle: [],
            listRight: [],
            currentIndex: 0,    // 当前显示的tab页
            listLeftLeft: '5%',     // 三个页面的左边距
            listMiddleLeft: '100%',
            listRightLeft: '100%',
        }
    },
    computed: {
        // 系统信息
        systemInfo: {
            get() {return this.$store.state.Infos.systeminfo}
        }
    },
    watch: {
        // 完成的request
        completedRequestCount: {
            handler (newVal, oldVal) {
                if (newVal === 1) {
                    uni.hideLoading()
                    uni.stopPullDownRefresh()
                    this.completedRequestCount = 0
                }
            }
        }
    },
    methods: {
        // 向服务器请求警报数据
        requestWarning () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetEachWarning_0818',
                data: {name: 'admin', areaflg: '青岛'},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 预警报列表')
                    if (!res.data.d | res.data.d === '您无权访问此端口') { // 返回的值为空
                        console.log('[服务器]: 返回 预警报列表 返回值为空')
                        return false
                    }
                    let resarr = JSON.parse(res.data.d)
                    if (resarr.length === 0) {
                        console.log('[服务器]: 返回 预警报列表 返回值为空')
                        return false
                    }
                    // 按时间排序
                    function SortByDate(x, y) {
                        let datex = new Date(x.datetime)
                        let datey = new Date(y.datetime)
                        return datey - datex
                    }
                    resarr.sort(SortByDate)
                    // 清空现有数组
                    that.listLeft.length = 0
                    that.listMiddle.length = 0
                    that.listRight.length = 0
                    for (let i = 0; i < resarr.length; i++) {
                        let warning = {
                            filename: resarr[i].filename,  // 文件名 唯一标识
                            name: resarr[i].name,          // 警报名
                            date: resarr[i].datetime,          // 日期
                            type: that.getType(resarr[i].name),        // 类型 海浪 风暴潮 海冰
                            level: that.getLevel(resarr[i].name),      // 级别 蓝色 黄色
                            dismiss: that.getDismiss(resarr[i].name)   // 是否解除
                        }
                        // 分别填入左中右三个数组中
                        switch (warning.type) {
                            case '风暴潮':
                                that.listLeft.push(warning)
                                break
                            case '海浪':
                                that.listMiddle.push(warning)
                                break
                            case '海冰':
                                that.listRight.push(warning)
                                break
                            default:
                                break
                        } // end-switch
                    } // end-for resarr
                    
                }, // end-success
                fail: function (res) {
                    // 网络请求失败
                    console.log('[服务器]: 请求 预警报列表 失败')
                },
                complete: function (res) {
                    that.completedRequestCount++
                }
            })
        },
        // 点击列表中的警报
        warningTap (filename) {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetDangeWarning_0816',
                data: {name: 'admin', areaflg: '山东', filename: filename},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 预警报地址')
                    if (!res.data.d | res.data.d === '您无权访问此端口' | res.data.d === '') { // 返回的值为空
                        console.log('[服务器]: 返回 预警报地址 返回值为空')
                        return false
                    }
                    uni.navigateTo({
                        url: '../warningdetail/warningdetail?data=' + res.data.d
                    })
                }
            })
        },
        // 切换标签
        switchTab (e) {
            this.currentIndex = e
            switch (e) {
                case 0:
                    this.showLeftTab()
                    break
                case 1:
                    this.showMiddleTab()
                    break
                case 2:
                    this.showRightTab()
                    break
                default:
                    this.showLeftTab()
                    break
            }
        },
        // 显示左tab页
        showLeftTab () {
            this.listLeftLeft = '5%'
            this.listMiddleLeft = '100%'
            this.listRightLeft = '100%'
        },
        // 显示中tab页
        showMiddleTab () {
            this.listLeftLeft = '-100%'
            this.listMiddleLeft = '5%'
            this.listRightLeft = '100%'
        },
        // 显示右tab页
        showRightTab () {
            this.listLeftLeft = '-100%'
            this.listMiddleLeft = '-100%'
            this.listRightLeft = '5%'
        },
        // 根据警报名称判断警报类型
        getType (name) {
            if (name.contains('海浪')) {
                return '海浪'
            }
            if (name.contains('风暴潮')) {
                return '风暴潮'
            }
            if (name.contains('海冰')) {
                return '海冰'
            }
        },
        // 根据警报名称判断警报级别
        getLevel (name) {
            if (name.contains('蓝色')) {
                return '蓝色'
            }
            if (name.contains('黄色')) {
                return '黄色'
            }
            if (name.contains('橙色')) {
                return '橙色'
            }
            if (name.contains('红色')) {
                return '红色'
            }
        },
        // 根据警报名称判断是否解除
        getDismiss (name) {
            if (name.contains('解除')) {
                return true
            } else {
                return false
            }
        }
    },
    onLoad () {
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.switchTab(this.currentIndex)
        this.requestWarning()
        // 10秒后关闭toast
        setTimeout(function () {
            uni.hideLoading()
        }.bind(this), 10000)
    },
    onPullDownRefresh() {
        this.requestWarning()
        // 10秒后关闭提示
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }.bind(this), 10000)
    }
}
</script>

<style>
@import "../../common/FontAwesome.css";

.page-body {
    /* border: 1px solid #f00; */
    /* padding: 0 30px; */
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow-x: hidden;
}

.page-section {
    margin-bottom: 60px;
    background-color: rgba(255, 255, 255, 0.8);
}

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

.list-container {
    border: 1px solid #000;
}

.panel {
    /* border: 1px solid #000; */
    position: absolute;
    width: 90%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    transition: left .5s ease-out;
}

.panel-left {
    left: 5%;
}
.panel-middle {
    left: 100%;
}
.panel-right {
    left: 100%;
}

.warning-row {
    /* border: 1px solid #000; */
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
    /* border-bottom: 1px solid #f00; */
    flex: 2;
    font-size: 38px;
}

.cell-date {
    flex: 1;
    /* border-left: 1px solid #0f0;
    border-right: 1px solid #0f0; */
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
