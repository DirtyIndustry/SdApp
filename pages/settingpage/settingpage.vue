<template>
	<view>
        <!-- <web-view src="http://123.234.129.238:8001/SdForecast/MapSec/Map.html"></web-view> -->
		<!-- <web-view src="http://123.234.129.238:8001/SdForecast/TyphoonSec/Typhoon.html"></web-view> -->
		<web-view src="http://115.47.125.154:8062/TyphoonSec/Typhoon.html"></web-view>
    </view>
</template>

<script>
	export default {
		data: {
			array: ['青岛','烟台','潍坊','威海','日照','东营','滨州']
		},
		computed: {
			
		}
	}
</script>

<style>

</style>
