import store from '../store'

// 根据天气设置图标
const setWeatherIcon = function (weather) {
    switch (weather) {
        case '晴':
        case '晴转多云':
            return '../../static/Images/right_weather_fine.png'
        case '多云':
        case '多云转晴':
        case '多云转阵雨':
        case '多云转阴':
        case '多云转小雨-中雨':
            return '../../static/Images/right_weather_cloudy.png'
        case '阴':
        case '阴转小雨-中雨':
            return '../../static/Images/right_weather_sky.png'
        case '雾':
        case '雾转多云':
            return '../../static/Images/right_weather_fog.png'
        case '风':
            return '../../static/Images/right_weather_wind.png'
        case '小雨':
        case '中雨':
        case '中雨-大雨':
        case '小到中雨':
        case '小雨转多云':
        case '小雨-中雨转多云':
        case '小雨-中雨转小雨':
        case '大雨':
        case '暴雨':
        case '中到暴雨':
        case '小到暴雨':
            return '../../static/Images/right_weather_rainy.png'
        case '阵雨':
        case '阵雨转多云':
            return '../../static/Images/right_weather_rainysh.png'
        case '大到暴雨':
            return '../../static/Images/right_weather_rainstorm.png'
        case '雷雨':
        case '雷阵雨':
            return '../../static/Images/right_weather_thunder.png'
        case '雪':
            return '../../static/Images/right_weather_snow.png'
        case '雨加雪':
            return '../../static/Images/right_weather_raisnow.png'
    }
}

// 根据空气质量设置pm2.5 class
const setAirconClass = function (airconDesc) {
    switch (airconDesc) {
        case '重度污染':
            return 'sev'
        case '轻度污染':
            return 'bad'
        case '良':
            return 'very'
        case '优':
            return 'excellent'
    }
}

// 根据潮汐预报STATIION生成对应的地名
const getLocName = function (STATION) {
    switch (STATION) {
        case '101wmt':
            return '金沙滩'
        case '102xmd':
            return '第一海水浴场'
        case '111zfd':
            return '芝罘岛'
        case '114wfg':
            return '潍坊港'
        case '109wh':
            return '威海'
        case '104rzh':
            return '日照'
        case '119hhg':
            return '黄河海港'
        case '125bzg':
            return '滨州港'
        case 'DYGLFP':
            return '东营广利渔港'
        case 'WFDJQ':
            return '潍坊度假区'
        case 'DYFP':
            return '胶州东营渔港'
        case 'WHXQ':
            return '威海新区'
        case 'YTQQ':
            return '烟台清泉'
        case 'DJKP':
            return '董家口港'
        case 'RZTHD':
            return '日照桃花岛'
        default:
            return ''
    }
}

// 处理服务器返回数据
const getShandongData = function (res) {
    // 实时天气
    // 天气图标
    res.weatherData.weatherIcon = setWeatherIcon(res.weatherData.weather)
    // 写入Vuex
    store.dispatch('setWeatherData', res.weatherData)

    // 潮汐预报
    let tideData = {}
    if (res.astroDatas.length > 1) {	// 如果是青岛
        tideData.chartTideTwoShow = true
        tideData.chartTideOneTitle = '第一海水浴场'
        tideData.chartTideTwoTitle = '金沙滩'
        for (let i = 0; i < res.astroDatas.length; i++) {
            let tide = buildTidedata(res.astroDatas[i].tidedata)
            let mark = buildMarkdata(res.astroDatas[i].markdata)
            if (res.astroDatas[i].location === '第一海水浴场') {
                tideData.optionTideOne = getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
            } else {
                let optiontwo = getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
                optiontwo.series[0].lineStyle.color = '#0092d4'
                tideData.optionTideTwo = optiontwo
            }
        }
    } else {	// 如果是青岛以外的城市
        tideData.chartTideTwoShow = false
        tideData.chartTideOneTitle = ''
        tideData.chartTideTwoTitle = ''
        for (let i = 0; i < res.astroDatas.length; i++) {
            let tide = buildTidedata(res.astroDatas[i].tidedata)
            let mark = buildMarkdata(res.astroDatas[i].markdata)
            tideData.optionTideOne = getAstroOptionNew(tide, mark, res.astroDatas[i].max, res.astroDatas[i].min)
        }
    } // if-else 是否是青岛
    // 写入Vuex
    store.dispatch('setTideData', tideData)

    // 近海预报
    store.dispatch('setInshoreData', res.inshoreData)

    // 浴场预报
    store.dispatch('setBathsData', res.bathsData)

    // 精细化预报
    let refinedData = {}
    // 判断城市
    if (res.refinedDatas.length === 0) {    // 如果是滨州或者没数据
        refinedData.show = false
    } else {
        refinedData.show = true
    }
    for (let i = 0; i < res.refinedDatas.length; i++) {
        let tide = buildTidedata(res.refinedDatas[i].tideinfo.tidedata)
        let mark = buildMarkdata(res.refinedDatas[i].tideinfo.markdata)
        let option = getAstroOptionNew(tide, mark, res.refinedDatas[i].tideinfo.max, res.refinedDatas[i].tideinfo.min)
        // 曲线颜色蓝色
        option.series[0].lineStyle.color = '#0092d4'
        // label颜色绿色
        option.series[0].label.color = '#1c8d3b'
        // 时间颜色红色
        option.series[0].markLine.label.textStyle.color = 'red'
        // 不显示日期
        option.xAxis.axisLabel.show = false
        // 将地名字母代号转为中文地名
        res.refinedDatas[i].extrainfo[0].loc = getLocName(res.refinedDatas[i].extrainfo[0].loc)
        if (res.refinedDatas.length > 1) {   // 如果是青岛
            refinedData.showTwo = true
            if (res.refinedDatas[i].tideinfo.location === 'DJKP') {
                refinedData.optionOne = option
                refinedData.dataOne = res.refinedDatas[i].extrainfo
            } else {
                refinedData.optionTwo = option
                refinedData.dataTwo = res.refinedDatas[i].extrainfo
            }
        } else {    // 如果是青岛以外的城市
            refinedData.optionOne = option
            refinedData.dataOne = res.refinedDatas[i].extrainfo
        }
    }
    // 写入Vuex
    store.dispatch('setRefinedData', refinedData)

    // 五日天气预报
    let fivedayData = {
        fivedayWeather: res.fivedayData.fivedayWeathers,
        optionFiveday: setFivedayChartOptionNew(res.fivedayData.higharr, res.fivedayData.lowarr, res.fivedayData.max, res.fivedayData.min)
    }
    // 天气图标
    for (let i = 0; i < fivedayData.fivedayWeather.length; i++) {
        fivedayData.fivedayWeather[i].weatherIcon = setWeatherIcon(fivedayData.fivedayWeather[i].weather)
    }
    // 写入Vuex
    store.dispatch('setFivedayData', fivedayData)

    // 威海专项
    let weihaiData = store.state.Datas.weihaidata
    // 判断城市
    if (res.weihaiDatas.length > 0) {	// 如果是威海
        weihaiData.show = true
        for (let i = 0; i < res.weihaiDatas.length; i++) {
            let data = {
                show: res.weihaiDatas[i].show,
                REPORTAREA: res.weihaiDatas[i].REPORTAREA,
                FORECASTDATE: res.weihaiDatas[i].FORECASTDATE,
                WAVEHEIGHT: res.weihaiDatas[i].WAVEHEIGHT,
                WATERTEMP: res.weihaiDatas[i].WATERTEMP,
            }
            let tide = buildTidedata(res.weihaiDatas[i].tideinfo.tidedata)
            let mark = buildMarkdata(res.weihaiDatas[i].tideinfo.markdata)
            data.option = getAstroOptionNew(tide, mark, res.weihaiDatas[i].tideinfo.max, res.weihaiDatas[i].tideinfo.min)
            data.option.grid = {
                top: '8%',
                left: '-3%',
                right: '5%',
                bottom: '20%',
                containLabel: true
            }
            switch (res.weihaiDatas[i].REPORTAREA) {
                case '成山头':
                    weihaiData.first = data
                    break
                case '乳山':
                    weihaiData.second = data
                    break
                case '石岛':
                    weihaiData.third = data
                    break
                case '文登':
                    weihaiData.fourth = data
                    break
                default:
                    break
            }
        } // end-for res.weihaiDatas
    } else {	// 如果是威海以外的城市
        weihaiData.show = false
    }
    // 写入Vuex
    store.dispatch('setWeihaiData', weihaiData)

    // 写入本地缓存
    storeToLocal('weatherdata', JSON.stringify(store.state.Datas.weatherdata))
    storeToLocal('tidedata', JSON.stringify(store.state.Datas.tidedata))
    storeToLocal('inshoredata', JSON.stringify(store.state.Datas.inshoredata))
    storeToLocal('bathsdata', JSON.stringify(store.state.Datas.bathsdata))
    storeToLocal('refineddata', JSON.stringify(store.state.Datas.refineddata))
    storeToLocal('fivedaydata', JSON.stringify(store.state.Datas.fivedayData))
    storeToLocal('weihaidata', JSON.stringify(store.state.Datas.weihaidata))
}

// 根据包含label信息的tidedata生成潮汐预报chart option
const getAstroOptionNew = function (tidedata, markdata, max, min) {
    // 获取现在时间
    let now = new Date()
    let nowtime = new Date()
    let nowdata = 0
    let showmarkpoint = 0
    if (tidedata.length > 13) {
        showmarkpoint = 1
        for (let j = 0; j < tidedata.length; j++) {
            if (tidedata[j].value[0].getHours() === now.getHours()) {
                nowtime = tidedata[j].value[0]
                nowdata = tidedata[j].value[1]
                break
            }
        }
    }

    let option = {
        // 图表距离外围div的padding
        grid: {
            top: '4%',
            left: '-2%',
            right: '1%',
            bottom: '20%',
            containLabel: true
        },
        // 横坐标轴
        xAxis: {
            type: 'time',
            offset: 0,
            interval: 24 * 60 * 60 * 1000,
            axisLabel: {
                // 横坐标刻度数值
                show: true,
                showMaxLabel: false,
                inside: true,
                fontSize: '14',
                align: 'left',
                padding: [0, 0, 30, 0],
                color: 'red',
                formatter: function (value, index) {
                    let date = new Date(value)
                    return date.getDate() + '日'
                }
            }, // end-axisLabel
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            show: false,
            boundaryGap: ['20%', '20%'], // 纵坐标轴的范围，比有效数字上下多出20%
            min: 0,
            // max: max + 110
        },
        series: [
            // 第一组series： 曲线数据 + 高低潮垂直标线 + 标线底部时间label
            {
                name: '潮汐',
                type: 'line',
                smooth: 0.3,
                silent: true,
                animation: false,
                symbolSize: 0.0001, // 曲线上数据点小圆圈的大小 不能设为0否则label不显示
                lineStyle: {
                    color: '#1c8d3b', // 曲线颜色
                    width: 1 // 曲线粗细
                },
                itemStyle: {
                    color: '#1c8d3b'    // 与曲线同色
                },
                label: {
                    color: '#000000'
                },
                data: tidedata,
                markLine: {
                    symbolSize: 0.1,    // 标线一端箭头的大小 不能设为0否则label不显示
                    silent: true,
                    animation: false,
                    label: {
                        show: true,
                        position: 'end',
                        formatter: function (param) {
                            // 返回mm:ss格式的时间
                            let date = new Date(param.data.coord[0])
                            let hour = date.getHours()
                            if (hour < 10) {
                                hour = '0' + hour
                            }
                            let minute = date.getMinutes()
                            if (minute < 10) {
                                minute = '0' + minute
                            }
                            return hour + ':' + minute
                        },
                        textStyle: {
                            color: '#000000',
                        }

                    }, // end-label-markLine
                    lineStyle: {
                        type: 'dot',
                        color: '#999999'
                    },
                    data: markdata
                }, // end-markLine
                /*
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 4,
                    itemStyle: {
                        color: 'red',
                        opacity: showmarkpoint
                    },
                    data: [
                        {coord:[nowtime, nowdata]}
                    ]
                }
                */
            },
            // 第二组series： 两条水平标线 表示三天最高和最低的潮位
            {
                name: '最值横线',
                type: 'line',
                markLine: {
                    symbolSize: 0,
                    silent: true,
                    animation: false,
                    lineStyle: {
                        type: 'dashed',
                        color: '#999999'
                    },
                    label: {
                        show: false
                    },
                    data: [{ yAxis: max }, { yAxis: min }]
                } // end-markLine
            }
        ] // end-series
    } // end-option
    return option
}

// 由高低温数据生成五日预报气温chart option
const setFivedayChartOptionNew = function (higharr, lowarr, high, low) {
    let anim = false // 是否显示动画
    // 生成option
    let option = {
        // chart距离容器边框的距离
        grid: {
            top: '4%',
            left: '0%',
            right: '1%',
            bottom: '0%',
            containLabel: false
        },
        xAxis: {
            show: false,
            data: ['one', 'two', 'three', 'four', 'five']
        },
        yAxis: {
            show: false,
            boundaryGap: ['1%', '1%'],
            max: high + 2,  // 设置纵轴显示范围的上限
            min: low - 1    // 显示范围的下限
        },
        series: [
            // 高温折线
            {
                name: '高温',
                type: 'line',
                animation: anim,
                // 折线上方的温度文字
                label: {
                    show: true,
                    formatter: '{c}℃',  // 文字内容
                    color: '#000000',   // 文字颜色
                },
                symbol: 'circle',   // 折线拐点设置为实心圆
                itemStyle: {
                    color: '#458B00'    // 拐点颜色
                },
                lineStyle: {
                    color: '#EEC900'    // 折线颜色
                },
                data: higharr
            },
            // 低温折线
            {
                name: '低温',
                type: 'line',
                animation: anim,
                // 折线上方的温度文字
                label: {
                    show: true,
                    formatter: '{c}℃',  // 文字内容
                    color: '#000000',   // 文字颜色
                },
                symbol: 'circle',   // 折线拐点设置为实心圆
                itemStyle: {
                    color: '#CD2626'    // 拐点颜色
                },
                lineStyle: {
                    color: '#5CACEE'    // 折线颜色
                },
                data: lowarr
            }
        ] // end-series
    } // end-option
    return option
}

// 将数据存入本地缓存
const storeToLocal = function (key, value) {
    // 判断value是不是object
    // if (typeof value === 'object') {
    //     value = JSON.stringify(value)
    // }
    // console.log ('store '+key+': '+value)
    uni.setStorage({
        key: key,
        data: value,
        success: function () {
            console.log('[缓存]: <- ' + key)
        }
    })
}

// 切换城市（包含自动）所进行的操作
const switchCity = function (city, operate) {
    if (city === '自动') {
        // 获取当前经纬度
        uni.getLocation({
            success: function (res) {
                console.log('[设备]: 获取 地理位置信息')
                let lati = res.latitude // 纬度
                let longi = res.longitude // 经度
                // 申请百度地图位置服务
                uni.request({
                    url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + lati + ',' + longi + '&coordtype=wgs84ll&output=json&pois=0&ak=' + 'lRNKq2t9caNdkxY4jsbPR7j9B8lsSqu6',
                    method: 'GET',
                    success: function (mapres) {
                        // 去除首尾无效字符
                        // let mapresobj = JSON.parse(mapres.data.substr(29, mapres.data.length - 30))
                        let mapresobj = JSON.parse(mapres.data.substring(29, mapres.data.length - 1))
                        // TODO: 可能有必要一层层判断undefined
                        let autocity = mapresobj.result.addressComponent.city
                        // 去掉结尾的'市'字
                        if (autocity.substring(autocity.length - 1) === '市') {
                            autocity = autocity.substring(0, autocity.length - 1)
                        }
                        // 判断是否在列表中
                        let contains = false
                        switch (autocity) {
                            case '青岛':
                            case '烟台':
                            case '潍坊':
                            case '威海':
                            case '日照':
                            case '东营':
                            case '滨州':
                                contains = true
                                break
                            default:
                                break
                        }
                        if (contains === false) {
                            console.log('当前城市不在可选列表中')
                            autocity = '青岛'
                        }
                        console.log('[设备]: 自动定位城市为 ' + autocity)
                        operate(autocity)
                    }, // end-success-request map.baidu.com
                    fail: function () {
                        console.log('自动定位失败')
                        operate('青岛')
                    }
                }) // end-request map.baidu.com
            }, // end-success-uni.getLocation
            fail: function () {
                console.log('[设备]: 获取 地理位置信息 失败')
                operate('青岛')
            }
        }) // end-uni.getLocation
    } else {
        operate(city)
    }
}

// 构建tidedata
const buildTidedata = function (raw) {
    let result = []
    for (let i = 0; i < raw.length; i++) {
        let item = raw[i]
        // 添加曲线数据
        let newdata = {
            value: [new Date(item.time), Number(item.data)]
        }
        // 如果由label值 则添加label数据
        if (item.label !== '') {
            newdata.label = {
                show: true,
                position: 'top',
                formatter: item.label + 'cm'
            }
        }
        result.push(newdata)
    }
    return result
}
// 构建markdata
const buildMarkdata = function (raw) {
    let result = []
    for (let l = 0; l < raw.length; l++) {
        let item = raw[l]
        result.push([
            {
                coord: [new Date(item.time), Number(item.data)]
            },
            {
                coord: [new Date(item.time), 0]
            }
        ])
    }
    return result
}

module.exports = {
    setWeatherIcon: setWeatherIcon, // 天气图标
    setAirconClass: setAirconClass, // pm2.5 class
    setFivedayChartOptionNew: setFivedayChartOptionNew, // 五日高低温chart option
    getLocName: getLocName, // 根据潮汐预报STATION生成对应的地名
    getShandongData: getShandongData,   // 处理服务器返回数据
    storeToLocal: storeToLocal, //将数据存入本地缓存
    getAstroOptionNew: getAstroOptionNew,   // 根据tidedata和markdata生成曲线chart option
    buildTidedata: buildTidedata,
    buildMarkdata: buildMarkdata,
    switchCity: switchCity  // 切换城市 包括自动定位
}
