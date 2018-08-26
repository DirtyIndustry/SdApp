<template>
    <view>
        <button @tap="tapped">Click</button>
    </view>
</template>

<script>
import utils from '../../utils/utils.js'
export default {
    methods: {
        tapped () {
            utils.switchCity('自动', this.printthis)
        },
        printthis (arg) {
            console.log('im printing this: ' + arg)
        }
    }
}
</script>

<style>

</style>
