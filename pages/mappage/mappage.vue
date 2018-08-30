<template>
	<view>
        <!-- <web-view src="http://123.234.129.238:8001/SdForecast/MapSec/Map.html"></web-view> -->
		<!-- <web-view src="http://123.234.129.238:8001/SdForecast/TyphoonSec/Typhoon.html"></web-view> -->
		<web-view src="http://192.168.2.19/MapSec/Map.html"></web-view>
		<!-- <map style="width: 100%; height: 1200px;" :latitude="centerlati" :longitude="centerlongi" :scale="scale" :markers="markers"></map> -->
    </view>
</template>

<script>
	export default {
		data: {
			array: ['青岛','烟台','潍坊','威海','日照','东营','滨州'],
			centerlati: 36.79898,
			centerlongi: 120.292059,
			scale: 8,
			markers: [
				// 青岛标记
				{
                	latitude: 36.061865,
                	longitude: 120.315579,
                	iconPath: '../../static/Images/map_marker.png',
					width: 10,
					height: 15
				},
				// 日照标记
				{
                	latitude: 35.423879,
                	longitude: 119.570555,
                	iconPath: '../../static/Images/Rz_location.png'
				},
				// 烟台标记
				{
                	latitude: 37.583791,
                	longitude: 121.184684,
                	iconPath: '../../static/Images/Yt_location.png'
				},
				// 威海标记
				{
                	latitude: 37.493996,
                	longitude: 122.139768,
                	iconPath: '../../static/Images/Wh_location.png'
				},
				// 潍坊标记
				{
                	latitude: 37.116516,
                	longitude: 119.440566,
                	iconPath: '../../static/Images/Wf_location.png'
				},
				// 东营标记
				{
                	latitude: 37.432009,
                	longitude: 118.92083,
                	iconPath: '../../static/Images/Dy_location.png'
				},
				// 滨州标记
				{
                	latitude: 38.195308,
                	longitude: 118.021037,
                	iconPath: '../../static/Images/Bz_location.png'
				},
			]
		},
		computed: {
			
		}
	}
</script>

<style>

</style>
