<template>
	<view class="content">
		<text>This is HomePage.\n</text>
		<text>{{array[location]}}</text>
		<text>{{newvalue}}\n</text>
		<text>{{newValueTwo}}</text>
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
