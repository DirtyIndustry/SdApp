<template>
    <view>
        <button @tap="tapped">Click</button>
        <view>\ue526\ue527\ue528\ue529\ue52a\ue52b\ue52c\ue52d\ue52e\ue52f\ue530\ue531\ue532\ue533\ue534\ue535\ue536\ue537\ue538\ue539\ue53a\ue53b\ue53c\ue53d\ue53e\ue53f\ue540\ue541\ue542\ue543\ue544\ue545\ue546\ue547\ue548\ue549\ue54a\ue54b\ue54c\ue54d\ue54e\ue54f\ue550\ue551\ue552\ue553\ue554\ue555\ue556\ue557\ue558\ue559\ue55a\ue55b\ue55c\ue55d\ue55e\ue55f\ue560\ue561\ue562\ue563\ue564�\ue565\ue566\ue567\ue568\ue569\ue56a\ue56b\ue56c\ue56d\ue56e\ue56f\ue570\ue571\ue572\ue573\ue574\ue575\ue576\ue577\ue578\ue579\ue57a\ue57b\ue57c\ue57d\ue57e\ue57f\ue580\ue581\ue582\ue583\ue584\ue585</view>
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
