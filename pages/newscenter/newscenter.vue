<template>
    <view class="page-body">
        <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"/>
        <view style="height: 60px;"></view>
        <view>
            <slideList :list="newslist" left="5%" show="true" placeholder="近期没有新闻" @itemTap="newsTap"></slideList>
        </view>
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import slideList from '../../components/slideList.vue'
export default {
    components: {
        slideList
    },
    data () {
        return {
            // 请求计数器
            completedRequestCount: 0,
            // 新闻列表
            newslist: []
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
        // 向服务器请求新闻数据
        requestNews () {
            let that = this
            uni.request({
                url: appsettings.hosturl + 'GetSelectNews_0909',
                data: {name: 'admin', areaflg: '青岛'},
                method: 'POST',
                success: function (res) {
                    console.log('[服务器]: 返回 新闻列表')
                    if (!res.data.d | res.data.d === '对不起，您没有权限访问此接口') { // 返回的值为空
                        console.log('[服务器]: 返回 新闻列表 返回值为空')
                        return false
                    }
                    let resarr = JSON.parse(res.data.d)
                    if (resarr.length === 0) {
                        console.log('[服务器]: 返回 新闻列表 返回值为空')
                        return false
                    }
                    // 按时间排序
                    function SortByDate(x, y) {
                        let datex = new Date(x.date)
                        let datey = new Date(y.date)
                        return datey - datex
                    }
                    resarr.sort(SortByDate)
                    // 清空现有数组
                    that.newslist.length = 0
                    for (let i = 0; i < resarr.length; i++) {
                        that.newslist.push(resarr[i])
                    } // end-for resarr
                    
                }, // end-success
                fail: function (res) {
                    // 网络请求失败
                    console.log('[服务器]: 请求 新闻列表 失败')
                },
                complete: function (res) {
                    that.completedRequestCount++
                }
            })
        },
        // 点击新闻
        newsTap (e) {
            console.log('新闻点击了' + e)
        }
    },
    onLoad () {
        uni.showLoading({
            title: '加载中',
            mask: true
        })
        this.requestNews()
        // 10秒后关闭toast
        setTimeout(function () {
            uni.hideLoading()
        }.bind(this), 10000)
    },
    onPullDownRefresh() {
        this.requestNews()
        // 10秒后关闭提示
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }.bind(this), 10000)
    }
}
</script>

<style>
.page-body {
    /* border: 1px solid #f00; */
    /* padding: 0 30px; */
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow-x: hidden;
}
</style>
