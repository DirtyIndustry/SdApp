var state = {
    // 实时天气
    weatherdata: {
        temperature: '25', // 气温
        aircondition: '35', // 空气质量
        airconDesc: '优',
        airconIcon: '../../static/Images/right_leaf_sev.png', // 空气质量绿叶图标
        weather: '晴',
        weatherIcon: '../../static/Images/right_weather_fine.png', // 天气图表
        pm25: '8', // PM2.5
        pm25Style: 'good'
    },
    // 潮汐预报
    tidedata: {

    },
    // 近海预报
    inshoredata: {},
    // 浴场预报
    bathsdata: {},
    // 精细化预报
    refineddata: {},
    // 五日天气
    fivedaydata: {
        fivedayWeather: [   // 五日天气详情
            {
                week: '',
                date: '',
                weather: '',
                weatherIcon: '',
                windDir: '',
                windLvl: ''
            },
            {
                week: '',
                date: '',
                weather: '',
                weatherIcon: '',
                windDir: '',
                windLvl: ''
            },
            {
                week: '',
                date: '',
                weather: '',
                weatherIcon: '',
                windDir: '',
                windLvl: ''
            },
            {
                week: '',
                date: '',
                weather: '',
                weatherIcon: '',
                windDir: '',
                windLvl: ''
            },
            {
                week: '',
                date: '',
                weather: '',
                weatherIcon: '',
                windDir: '',
                windLvl: ''
            }
        ],
        optionFiveday: {}   // 五日高低温图表option
    }
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
    setWeatherData (context, weatherdata) {
        context.commit('setweather', weatherdata)
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
    },
    setFivedayData (context, fivedaydata) {
        context.commit('setfiveday', fivedaydata)
    }
}

export default {
    state,
    mutations,
    actions
}
