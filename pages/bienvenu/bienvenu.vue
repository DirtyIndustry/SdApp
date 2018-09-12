<template>
    <view class="page-body">
        <swiper class="container" indicator-dots="true">
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageFir.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageSec.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageThi.png" mode="aspectFill"/>
            </swiper-item>
            <swiper-item>
                <image src="../../static/Images/bienvenu/WelpageFou.png" mode="aspectFill"/>
                <button plain="true" >开启预报</button>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    onLoad () {
        console.log('bienvenu page load.')
    },
    onShow () {
        console.log('bienvenu page show.')
    }
}
</script>

<style scoped>
.page-body {
    height: 100%;
    flex-grow: 1;
	overflow-x: hidden;
}
.container {
    height: 100%;
}
image {
    width: 100%;
    height: 100%;
    z-index: 1;
}
button {
    position: fixed;
    bottom: 20%;
    left: 30%;
    width: 40%;
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, 0);
    color: #fff;
    z-index: 2;
}
</style>
