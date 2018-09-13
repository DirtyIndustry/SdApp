<template>
	<view>
		<web-view :src="url"></web-view>
    </view>
</template>

<script>
	export default {
		data () {
            return {
                url: ''
            }
        },
        onLoad (e) {
            if (e.data) {
                this.url = e.data
            }
        }
	}
</script>
