import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()

// string.startsWith()
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (prefix) {
		return this.slice(0, prefix.length) === prefix
	}
}
// string.endsWith()
if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1
	}
}
// string.contains()
if (typeof String.prototype.contains != 'function') {
	String.prototype.contains = function (str) {
		if (str == null || str == "" || this.length == 0 || str.length > this.length) {
			return false
		}
		if (this.indexOf(str) >= 0) {
			return true
		} else {
			return false
		}
		return true
	}
}