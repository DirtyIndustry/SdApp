<template>
    <view class="page-body">
		<!-- 上端空白 -->
		<view class="separator-vertical"></view>
        <form @submit="formSubmit">
            <!-- 联系人姓名 -->
            <input name="input_name" class="input input-small" v-model="postername" placeholder=" 联系人姓名" focus/>
            <!-- 分隔条 -->
            <view class="separator-vertical-small"></view>
            <!-- 联系方式 -->
            <input name="input_contact" class="input input-small" v-model="postercontact" placeholder=" 联系方式（推荐使用邮箱）" />
            <!-- 分隔条 -->
            <view class="separator-vertical-small"></view>
            <!-- 留言内容 -->
            <textarea name="input_content" class="input input-big" v-model="postcontent" placeholder=" 请输入留言*"></textarea>
            <!-- 分隔条 -->
            <view class="separator-vertical-small"></view>
            <!-- 提交按钮 -->
            <button class="submit-button" type="primary" formType="submit" :disabled="!postvalid">{{buttonText}}</button>
        </form>
    </view>
</template>

<script>
import appsettings from '../../utils/appsettings.js'
import utils from '../../utils/utils.js'
export default {
data () {
    return {
        lastpostdate: '',
        postcounter: 0,
        postername: '',
        postercontact: '',
        postcontent: '',
        limited: false,
        postvalid: false,
        buttonText: '提交'
    }
},
watch: {
    // 留言正文
    postcontent: {
        handler (newVal, oldVal) {
            if (this.limited === true) {
                this.postvalid = false
            } else {
                if (newVal.trim() === '') {
                    this.postvalid = false
                } else {
                    this.postvalid = true
                }
            }
        }
    },
    // 每日留言限制
    limited: {
        handler (newVal, oldVal) {
            if (newVal) {
                if (newVal === true) {
                    this.buttonText = '已达到每日提交次数上限'
                } else {
                    this.buttonText = '提交'
                }
            }
        }
    }
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
        console.log(this.lastpostdate)
        console.log(this.postcounter)
        console.log(this.postername)
        console.log(this.postercontact)
        console.log(this.postcontent)
        this.lastpostdate = new Date()
        this.postcounter++
        utils.storeToLocal('lastpostdate', this.lastpostdate)
        utils.storeToLocal('postcounter', this.postcounter)
        setLimitation()
    },
    // 检查是否是同一天
    checkDate (today, record) {
        if (today == '' | record === '') {
            return true
        }
        let recorddate = new Date(record)
        if (today.getFullYear() === recorddate.getFullYear() & today.getMonth() === recorddate.getMonth() & today.getDate() === recorddate.getMonth()) {
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
    }
},
onShow () {
    this.getLastPostLocalStorage()
    this.setLimitation()
}
}
</script>

<style>
.page-body {
	background-color: #eeeeee;
	width: 100%;
	height: 100%;
	/* display: flex;
	flex-direction: column; */
}

.separator-vertical{
	height: 40px;
}

.separator-vertical-small {
	height: 10px;
}

.separator-horizontal {
	width: 40px;
}

.input {
    border: 1px solid #999;
    border-radius: 15px;
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: row;
    width: 90%;
    left: 5%;
}

.input-small {
	height: 80px;
}

.input-big {
	height: 380px;
}

.submit-button {
    width: 90%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #0092d4; */
}
</style>
