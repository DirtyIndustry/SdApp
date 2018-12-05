<template>
<view class="page-body">
    <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"/>
    <flowTabbar leftLabel="风暴潮" middleLabel="海浪警报" rightLabel="海冰警报"
        :leftNew="leftNew" :middleNew="middleNew" :rightNew="rightNew" @tabchange="switchTab" ref="flowtabbar"></flowTabbar>
    <view style="height: 160upx;" />
    <view>
        <!-- 左列表 -->
        <slideList :list="listLeft" :left="listLeftLeft" :show="listLeftShow" placeholder="近期没有风暴潮警报" @itemTap="warningTap"></slideList>
        <!-- 中列表 -->
        <slideList :list="listMiddle" :left="listMiddleLeft" :show="listMiddleShow" placeholder="近期没有海浪警报" @itemTap="warningTap"></slideList>
        <!-- 右列表 -->
        <slideList :list="listRight" :left="listRightLeft" :show="listRightShow" placeholder="近期没有海冰警报" @itemTap="warningTap"></slideList>
    </view>
</view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import utils from '../../utils/utils.js'
import flowTabbar from '../../components/flowTabbar.vue'
import slideList from '../../components/slideList.vue'
export default {
    components: {
        flowTabbar,
        slideList
    },
    data () {
        return {
            // 完成的请求计数
            completedRequestCount: 0,
            listLeft: [],       // 三个列表的内容数据
            listMiddle: [],
            listRight: [],
            leftNew: false,     // 三个列表是否有新数据
            middleNew: false,
            rightNew: false,
            currentIndex: 0,    // 当前显示的tab页
            listLeftLeft: '5%',     // 三个tab页的左边距
            listMiddleLeft: '105%',
            listRightLeft: '200%',
            listLeftShow: true,     // tab页是否显示
            listMiddleShow: false,
            listRightShow: false,
            timerlist: []
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
                url: appsettings.hosturl + 'GetOceanAlarmList',
                data: {name: 'admin', areaflg: '山东'},
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
                                if (new Date(warning.date).toDateString() == new Date().toDateString()) {
                                    that.leftNew = true
                                }
                                break
                            case '海浪':
                                if (new Date(warning.date).toDateString() == new Date().toDateString()) {
                                    that.middleNew = true
                                }
                                that.listMiddle.push(warning)
                                break
                            case '海冰':
                                if (new Date(warning.date).toDateString() == new Date().toDateString()) {
                                    that.rightNew = true
                                }
                                that.listRight.push(warning)
                                break
                            default:
                                break
                        } // end-switch
                    } // end-for resarr
                    // 跳转到有内容的标签
                    if (that.listMiddle.length > 0) {
                        let timer = setTimeout(function () {
                            clearTimeout(timer)
                            that.$refs.flowtabbar.midButtonTap()
                            that.showMiddleTab()
                        }.bind(this), 525)
                        // this.timerlist.push(timer)
                    } else if (that.listRight.length > 0) {
                        let timer = setTimeout(function () {
                            clearTimeout(timer)
                            that.$refs.flowtabbar.rightButtonTap()
                            that.showRightTab()
                        }.bind(this), 525)
                    }
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
            console.log('clicked! ' + filename)
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetOceanAlarmUrl',
                data: {name: 'admin', areaflg: '山东', filename: filename},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 预警报地址')
                    if (!res.data.d | res.data.d === '您无权访问此端口' | res.data.d === '') { // 返回的值为空
                        console.log('[服务器]: 返回 预警报地址 返回值为空')
                        return false
                    }
                    // 打开详细警报页面
                    console.log('[界面]: 跳转至 警报详情页面')
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
            // 控制显隐
            this.listLeftShow = true
            this.listMiddleShow = true
            // 控制移动
            this.listLeftLeft = '5%'
            this.listMiddleLeft = '105%'
            this.listRightLeft = '200%'
            // 控制显隐
            if (Number(this.systemInfo.system.split('.')[0]) > 4) {
                let timer = setTimeout(function () {
                    clearTimeout(timer)
                    this.listMiddleShow = false
                    this.listRightShow = false
                }.bind(this), 520)
                this.timerlist.push(timer)
            }
        },
        // 显示中tab页
        showMiddleTab () {
            // 控制显隐
            this.listLeftShow = true
            this.listMiddleShow = true
            this.listRightShow = true
            // 控制移动
            this.listLeftLeft = '-105%'
            this.listMiddleLeft = '5%'
            this.listRightLeft = '105%'
            // 控制显隐
            if (Number(this.systemInfo.system.split('.')[0]) > 4) {
                let timer = setTimeout(function () {
                    clearTimeout(timer)
                    this.listLeftShow = false
                    this.listRightShow = false
                }.bind(this), 520)
                this.timerlist.push(timer)
            }
        },
        // 显示右tab页
        showRightTab () {
            // 控制显隐
            this.listMiddleShow = true
            this.listRightShow = true
            // 控制移动
            this.listLeftLeft = '-200%'
            this.listMiddleLeft = '-105%'
            this.listRightLeft = '5%'
            // 控制显隐
            if (Number(this.systemInfo.system.split('.')[0]) > 4) {
                let timer = setTimeout(function () {
                    clearTimeout(timer)
                    this.listLeftShow = false
                    this.listMiddleShow = false
                }.bind(this), 520)
                this.timerlist.push(timer)
            }
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
        this.requestWarning()
    },
    onUnload () {
        for (let i = 0; i < this.timerlist.length; i++) {
            clearTimeout(this.timerlist[i])
            this.timerlist[i] = null
        }
    },
    onPullDownRefresh() {
        this.requestWarning()
    }
}
</script>

<style scoped>

.page-body {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow-x: hidden;
}

</style>
