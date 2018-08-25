var state = {
    // 实时天气
    weatherdata: {},
    // 潮汐预报
    tidedata: {},
    // 近海预报
    inshoredata: {},
    // 浴场预报
    bathsdata: {},
    // 精细化预报
    refineddata: {},
    // 五日天气
    fivedaydata: {}
}

const mutations = {
    setweather (state, value) {
        state.weatherdata = value
    },
    settide (state, value) {
        state.tidedata = value
    },
    setinshore (state, value) {
        state.inshoredata = value
    },
    setbaths (state, value) {
        state.bathsdata = value
    },
    setrefined (state, value) {
        state.refineddata = value
    },
    setfiveday (state, value) {
        state.fivedaydata = value
    }
}

const actions = {
    setWeatherData (context, weatherdata, fivedaydata) {
        context.commit('setweather', weatherdata)
        context.commit('setfiveday', fivedaydata)
    },
    setTideData (context, tidedata) {
        context.commit('settide', tidedata)
    },
    setInshoreData (context, inshoredata) {
        context.commit('setinshore', inshoredata)
    },
    setBathsData (context, bathsdata) {
        context.commit('setbaths', bathsdata)
    },
    setRefinedData (context, refineddata) {
        context.commit('setrefined', refineddata)
    }
}

export default {
    state,
    mutations,
    actions
}
