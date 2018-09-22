var state = {
    // 当前城市名称
    cityname: '青岛',
    // 实时天气
    weatherdata: {
        temperature: '25', // 气温
        aircondition: '35', // 空气质量
        airconDesc: '优',
        weather: '晴',
        weatherIcon: '../../static/Images/right_weather_fine.png', // 天气图表
        pm25: '8', // PM2.5
        pm25Style: 'good'
    },
    // 潮汐预报
    tidedata: {
        chartTideOneTitle: '',	// 两个图表的地区
        chartTideTwoTitle: '',
        chartTideTwoShow: true,	// 第二个图表是否显示
        optionTideOne: {},		// 两个图表的option
        optionTideTwo: {}
    },
    // 近海预报
    inshoredata: {
        location: '',
        timeupper: '',
        timelower: '',
        data: [
            {
                loc: '海域',
                wave: '浪高(m)',
                temp: '表层水温(℃)'
            },
            {
                loc: '',
                wave: '',
                temp: ''
            },
            {
                loc: '',
                wave: '',
                temp: ''
            },
            {
                loc: '',
                wave: '',
                temp: ''
            },
            {
                loc: '',
                wave: '',
                temp: ''
            }
        ],
        showextra: true,
        extradate48h: '',
        extrawave48h: '',
        extratemp48h: '',
        extradate72h: '',
        extrawave72h: '',
        extratemp72h: ''
    },
    // 浴场预报
    bathsdata: {
        showBaths: true,
        time: '',
        data: [
            {
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            },
            {
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            },
            {
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            },
            {
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            },
            {
                PublishDate: '',
                BathsName: '',
                WaveHeight: '',
                WaterTemp: '',
                Swimming: ''
            }
        ]
    },
    // 精细化预报
    refineddata: {
        optionOne: {},	// 两个图表的option
        optionTwo: {},
        show: true,	// 精细化模块是否显示
        showTwo: true,	// 第二个图表是否显示
        dataOne: [	// 图标周围显示的数据
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
        ],
        dataTwo: [	// 图标周围显示的数据
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
            {
                loc: '',
                time: '',
                wave: '',
                temp: '',
                windLvl: '',
                windDir: ''
            },
        ]
    },
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
    },
    // 威海专项预报
    weihaidata: {
        show: false,
        first: {
            show: false,
            FORECASTDATE: '',
            REPORTAREA: '',
            WAVEHEIGHT: '',
            WATERTEMP: '',
            option: {}
        },
        second: {
            show: false,
            FORECASTDATE: '',
            REPORTAREA: '',
            WAVEHEIGHT: '',
            WATERTEMP: '',
            option: {}
        },
        third: {
            show: false,
            FORECASTDATE: '',
            REPORTAREA: '',
            WAVEHEIGHT: '',
            WATERTEMP: '',
            option: {}
        },
        fourth: {
            show: false,
            FORECASTDATE: '',
            REPORTAREA: '',
            WAVEHEIGHT: '',
            WATERTEMP: '',
            option: {}
        }
    }
}

const mutations = {
    setcityname (state, value) {
        state.cityname = value
    },
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
    },
    setweihai (state, value) {
        state.weihaidata = value
    }
}

const actions = {
    setCityName (context, cityname) {
        context.commit('setcityname', cityname)
    },
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
    },
    setWeihaiData (context, weihaidata) {
        context.commit('setweihai', weihaidata)
    }
}

export default {
    state,
    mutations,
    actions
}
