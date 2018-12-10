var state = {
    systeminfo: {},
    cityarray: ['自动', '青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
    cityindex: 0,
    showindexguide: true,
    pushbeep: true,
    pushvibrate: true,
    forceupgrade: false,
    needupgrade: false,
    androidupgradeurl: ''
}

const mutations = {
    setsysteminfo (state, value) {
        state.systeminfo = value
    },
    setcityindex (state, value) {
        state.cityindex = value
    },
    setshowindexguide (state, value) {
        state.showindexguide = value
    },
    setpushbeep (state, value) {
        state.pushbeep = value
    },
    setpushvibrate (state, value) {
        state.pushvibrate = value
    },
    setforceupgrade (state, value) {
        state.forceupgrade = value
    },
    setneedupgrade (state, value) {
        state.needupgrade = value
    },
    setandroidupgradeurl(state, value) {
        state.androidupgradeurl = value
    }
}

const actions = {
    setSystemInfo (context, info) {
        context.commit('setsysteminfo', info)
    },
    setCityIndex (context, index) {
        context.commit('setcityindex', index)
    },
    setShowIndexGuide (context, show) {
        context.commit('setshowindexguide', show)
    },
    setPushBeep (context, value) {
        context.commit('setpushbeep', value)
    },
    setPushVibrate (context, value) {
        context.commit('setpushvibrate', value)
    },
    setForceUpgrade (context, value) {
        context.commit('setforceupgrade', value)
    },
    setNeedUpgrade (context, value) {
        context.commit('setneedupgrade', value)
    },
    setAndroidUpgradeUrl(context, value) {
        context.commit('setandroidupgradeurl', value)
    }
}

export default {
    state,
    mutations,
    actions
}
