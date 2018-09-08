<template>
<view>
    <flowTabbar leftLabel="风暴潮" middleLabel="海浪警报" rightLabel="海冰警报" @buttontap="switchTab"></flowTabbar>
    <view class="page-body">
        <image src="../../static/Images/back_images.jpg" mode="aspectFill" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: -1;"
		/>
    </view>
</view>
</template>

<script>
import flowTabbar from '../../components/flowTabbar.vue'
export default {
    components: {
        flowTabbar
    },
    data () {
        return {
            
        }
    },
    computed: {
        // 系统信息
        systemInfo: {
            get() {return this.$store.state.Infos.systeminfo}
        }
    },
    methods: {
        // 切换标签
        switchTab (e) {
            console.log(e)
        }
    },
    onLoad () {

    },
    onPullDownRefresh() {
        // 1秒后关闭提示
        setTimeout(function () {
            uni.stopPullDownRefresh()
        }.bind(this), 1000)
    }
}
</script>

<style>
.page-body {
    /* border: 1px solid #f00; */
    padding: 0 30px;
    flex-grow: 1;
    overflow-x: hidden;
}

</style>
