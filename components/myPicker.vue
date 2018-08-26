<template>
<view class="masklayer" v-show="show" @tap="closeDialog" catchtouchmove="stopscroll">
    
</view>    
</template>

<script>
export default {
    name: 'myPicker',
    props: {
        
    },
    data () {
        return {
            show: false
        }
    },
    methods: {
        showDialog () {
            console.log('picker show')
            this.show = true
        },
        closeDialog () {
            this.show = false
        },
        switchDialog () {
            this.show = !this.show
        },
        stopscroll () {
            // 阻止背后页面滚动
        }
    }
}
</script>

<style>
.masklayer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: block;
    background-color: rgba(0, 0, 0, 0.7)
}

.inner-canvas {
    width: 100%;
    height: 100%;
}
</style>
