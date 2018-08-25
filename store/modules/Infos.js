var state = {
    systeminfo: {},
    locarray: ['青岛', '烟台', '潍坊', '威海', '日照', '东营', '滨州'],
    locindex: 0
}

const mutations = {
    setsysteminfo (state, value) {
        state.systeminfo = value
    },
    setlocindex (state, value) {
        state.locindex = value
    }
}

const actions = {
    setSystemInfo (context, info) {
        context.commit('setsysteminfo', info)
    },
    setLocIndex (context, index) {
        context.commit('setlocindex', index)
    }
}

export default {
    state,
    mutations,
    actions
}
