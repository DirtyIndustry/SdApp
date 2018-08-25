<template>
	<view>
        <web-view src="../../static/Map.html"></web-view>
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
		}
	}
</script>

<style>
</style>
