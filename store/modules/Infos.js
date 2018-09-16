var state = {
    systeminfo: {},
    cityarray: ['自动', '青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
    cityindex: 0
}

const mutations = {
    setsysteminfo (state, value) {
        state.systeminfo = value
    },
    setcityindex (state, value) {
        state.cityindex = value
    }
}

const actions = {
    setSystemInfo (context, info) {
        context.commit('setsysteminfo', info)
    },
    setCityIndex (context, index) {
        context.commit('setcityindex', index)
    }
}

export default {
    state,
    mutations,
    actions
}
