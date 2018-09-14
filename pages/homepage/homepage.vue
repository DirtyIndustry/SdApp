<template>
	<view class="content">
		<text>This is HomePage.\n</text>
		<button @tap="tabme">Click</button>
		<!-- <text>{{array[location]}}</text>
		<text>{{newvalue}}\n</text>
		<text>{{newValueTwo}}</text> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data: {
			array: ['青岛','烟台','潍坊','威海','日照','东营','滨州']
		},
		computed: {
			...mapState(['location']),
			...mapState(['newvalue']),
			...mapState(['newValueTwo'])
		},
		onLoad () {
			uni.hideLoading()
		},
		methods: {
			tabme () {
				console.log('tab')
				uni.navigateTo({
				url: '../index/index'
			});
			}
		}
	}
</script>

