<template>
    <view class="page-body">
		<!-- 上端空白 -->
		<view class="separator-vertical"></view>
        <form @submit="formSubmit">
            <!-- 联系人姓名 -->
            <input name="input_name" class="input input-small" v-model="postername" placeholder="联系人姓名" :focus="inputnameFocus" @confirm="inputnameConfirm"/>
            <!-- 分隔条 -->
            <view class="separator-vertical-small"></view>
            <!-- 联系方式 -->
            <input name="input_contact" class="input input-small" v-model="postercontact" placeholder="联系人电子邮箱地址" :focus="inputcontactFocus" @confirm="inputcontactConfirm"/>
            <!-- 分隔条 -->
            <view class="separator-vertical-small"></view>
            <!-- 留言内容 -->
            <textarea name="input_content" class="input input-big" v-model="postcontent" placeholder="请输入留言*" :focus="inputcontentFocus"></textarea>
            <!-- 分隔条 -->
            <view class="separator-vertical"></view>
            <!-- 提交按钮 -->
            <button class="submit-button" type="primary" formType="submit" :disabled="!formValid">{{buttonText}}</button>
            <!-- 分隔条 -->
            <view class="separator-vertical"></view>
            <!-- 二维码 -->
            <view class="qrcode-container">
                <image class="qrcode-img" src="../../static/Images/qrcode.jpg" mode="widthFix" />
            </view>
        </form>
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import utils from '../../utils/utils.js'
export default {
data () {
    return {
        lastpostdate: '',       // 最后提交日期
        postcounter: 0,         // 提交计数
        postername: '',         // 联系人姓名
        postercontact: '',      // 联系人联系方式
        postcontent: '',        // 留言内容
        buttonText: '发送',     // 发送按钮字样
        inputnameFocus: true,       // 联系人姓名获得焦点
        inputcontactFocus: false,   // 联系方式获得焦点
        inputcontentFocus: false,   // 留言正文获得焦点
    }
},
watch: {
    // 每日留言限制
    limited: {
        handler (newVal, oldVal) {
            if (newVal === true) {
                this.buttonText = '已达到每日发送次数上限'
            } else {
                this.buttonText = '发送'
            }
        }
    },
    // 留言计数
    postcounter: {
        handler (newVal, oldVal) {
            this.setLimitation()
        }
    }
},
computed: {
    nameValid () { return this.postername.trim() !== '' },
    contactValid () { return this.validateEmail(this.postercontact) },
    contentValid () { return this.postcontent.trim() !== '' },
    limited () {
        if (this.checkDate(new Date(), this.lastpostdate) === true) {   // 同一天
            if (this.postcounter > 2) { // 同日计数大于2
                return true
            } else {    // 同日计数不大于2
                return false
            }
        } else {    // 不是同一天
            this.postcounter = 0
            return false
        }
    },
    formValid () { return !this.limited & this.nameValid & this.contactValid & this.contentValid }
},
methods: {
    // 获取本地缓存最后留言日期和留言计数
    getLastPostLocalStorage () {
        let that = this
        // 最后提交日期
        uni.getStorage({
            key: 'lastpostdate',
            success: function (res) {
                console.log('[缓存]: 获取 最后提交留言日期')
                that.lastpostdate = res.data
            }
        })
        // 提交次数计数
        uni.getStorage({
            key: 'postcounter',
            success: function (res) {
                console.log('[缓存]: 获取 提交留言计数')
                that.postcounter = res.data
            }
        })
    },
    // 提交表单
    formSubmit (e) {
        if (this.postcontent.trim() === '') {
            console.log('[界面]: 提交内容为空')
            return
        }
        // 显示loading toast
        uni.showLoading({
            title: '发送中',
            mask: true
        })
        let that = this
        uni.request({
            url: appsettings.hosturl + 'GetBolMessage_0104',
            data: {
                name: 'admin',
                areaflg: '山东',
                MESSAGE_NAME: that.postername,
                iphonenumber: that.postercontact,
                messagelanage: that.postcontent
            },
            method: 'POST',
            success: function (res) {
                console.log('[服务器]: 提交用户留言成功')
                // 关闭loading toast
                uni.hideLoading()
                // 更新最后提交时间和提交计数器
                that.lastpostdate = new Date()
                that.postcounter++
                // 写入本地缓存
                utils.storeToLocal('lastpostdate', that.lastpostdate)
                utils.storeToLocal('postcounter', that.postcounter)
                // 弹出提示窗口
                uni.showModal({
					title: '成功',
					content: '用户留言发送成功',
                    showCancel: false,
                    success: function (e) {
                        if (e.confirm) {
                            console.log('[界面]: 用户点击了确定')
                            // 点击确定关闭页面
                            uni.navigateBack()
                        }
                    }
				})
            }, // end-success-request
            fail: function (res) {
                console.log('[服务器]: 提交用户留言失败')
                // 关闭loading toast
                uni.hideLoading()
                // 弹出提示窗口
                uni.showModal({
					title: '失败',
					content: '用户留言发送失败',
					showCancel: false
				})
            } // end-fail-request
        })
    },
    // 检查是否是同一天
    checkDate (today, record) {
        if (today === 0 | record === '') {
            return true
        }
        let recorddate = new Date(record)
        if (today.getFullYear() === recorddate.getFullYear() & today.getMonth() === recorddate.getMonth() & today.getDate() === recorddate.getDate()) {
            return true
        } else {
            return false
        }
    },
    // 设置是否达到发送次数上线
    setLimitation () {
        if (this.checkDate(new Date(), this.lastpostdate) === true) {   // 同一天
            if (this.postcounter > 2) { // 同日计数大于2
                this.limited = true
            } else {    // 同日计数不大于2
                this.limited = false
            }
        } else {    // 不是同一天
            this.limited = false
            this.postcounter = 0
        }
    },
    // 验证邮箱有效性
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    // 姓名输入栏点击确定
    inputnameConfirm () {
        this.inputnameFocus = false
        this.inputcontactFocus = true
    },
    // 联系方式输入栏点击确定
    inputcontactConfirm () {
        this.inputcontactFocus = false
        this.inputcontentFocus = true
    }
},
onShow () {
    this.getLastPostLocalStorage()
}
}
</script>

<style scoped>
.page-body {
	background-color: #eeeeee;
	width: 100%;
	height: 100%;
	/* display: flex;
	flex-direction: column; */
}

.separator-vertical{
	height: 40upx;
}

.separator-vertical-small {
	height: 10upx;
}

.separator-horizontal {
	width: 40upx;
}

.input {
    border: 1upx solid #999;
    border-radius: 10upx;
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: row;
    width: 90%;
    left: 5%;
}

.input-small {
	height: 80upx;
}

.input-big {
	height: 380upx;
}

.submit-button {
    width: 90%;
    height: 80upx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qrcode-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qrcode-img {
    width: 40%;
}
</style>
