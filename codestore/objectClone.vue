<template>
	<view>

	</view>
</template>

<script>
	export default {
		methods:{
			// 在console显示object内部的属性
			deepEquals (x, y, layer) {
				if (layer > 6) {
					return
				}
				let head = ''
				for (let i = 0; i < layer; i++) {
					head += '  '
				}
				for (let attr in x) {
					if (x.hasOwnProperty(attr) & y.hasOwnProperty(attr)) {
						console.log(head + attr + ' : ' + x[attr])
						if (typeof x[attr] != 'string') {
							this.deepEquals(x[attr], y[attr], layer+1)
						}
					}
				}
			},
			// 浅克隆 无递归
			clone (obj) {
				if (null == obj || "object" != typeof obj) return obj
				let copy = obj.constructor();
				for (let attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
				}
				return copy
			},
			delay () {
				setTimeout(function(){
					// ...
				}.bind(this),5000)
			},
		}
	}
</script>

<style>

</style>
