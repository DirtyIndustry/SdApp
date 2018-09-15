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

// 根据空气质量设置图标
const setAirconIcon = function (airconDesc) {
    switch (airconDesc) {
        case '重度污染':
            return '../../static/Images/right_leaf_sev.png'
        case '轻度污染':
            return '../../static/Images/right_leaf_bad.png'
        case '良':
            return '../../static/Images/right_leaf_very.png'
        case '优':
            return '../../static/Images/right_leaf_excellent.png'
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

// 由三日数据生成chart option
const setTideChartOption = function (arr) {
    // 按日期排序
    function SortByDate (x, y) {
        let datex = new Date(x.PREDICTIONDATE)
        let datey = new Date(y.PREDICTIONDATE)
        return datex - datey
    }
    arr.sort(SortByDate)
    // 提取潮汐数值
    let tidedata = [] // 曲线用的数值集
    let markdata = [] // 最高最低潮竖直标线用的数值集
    for (let i = 0; i < arr.length; i++) {
        // 一次循环为一天的数据
        // 初始日期时间
        let inittime = new Date(arr[i].PREDICTIONDATE)
        // 高低潮需要的日期字符串，必须在这里取值，后面的运算会改变inittime值
        let datestring = inittime.getFullYear() + '/' + (inittime.getMonth() + 1) + '/' + inittime.getDate()
        // 每小时数值 加入曲线数值表
        // 格式为[ [时间1, 数值1], [时间2, 数值2], ... ]
        tidedata.push([inittime.setHours(inittime.getHours()), arr[i].H0])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H1])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H2])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H3])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H4])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H5])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H6])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H7])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H8])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H9])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H10])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H11])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H12])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H13])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H14])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H15])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H16])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H17])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H18])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H19])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H20])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H21])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H22])
        tidedata.push([inittime.setHours(inittime.getHours() + 1), arr[i].H23])
        // 高低潮数值 加入曲线数值表和垂直标线数值表
        // 第一次高潮
        if (arr[i].FSTHIGHWIDETIME !== '-') {
            // 第一次高潮的日期时间
            let dateFH = new Date(datestring + ' ' + arr[i].FSTHIGHWIDETIME + ':00')
            // 第一次高潮曲线数据
            tidedata.push([dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT])
            // 第一次高潮垂直标线数据
            // 垂直标线数据格式为: [ [{coord: [横坐标1, 纵坐标起始值1]},{coord: [横坐标1, 纵坐标结束值1]}], [{coord: [横坐标2, 纵坐标起始值2]},{coord: [横坐标2, 纵坐标结束值2]}], ... ]
            let fh = [
                {
                    coord: [dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT]
                },
                {
                    coord: [dateFH.setHours(dateFH.getHours()), 0]
                }
            ]
            markdata.push(fh)
        }
        // 第一次低潮
        if (arr[i].FSTLOWWIDETIME !== '-') {
            // 第一次低潮的日期时间
            let dateFL = new Date(datestring + ' ' + arr[i].FSTLOWWIDETIME + ':00')
            // 第一次低潮的曲线数据
            tidedata.push([dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT])
            // 第一次低潮的垂直标线数据
            let fl = [
                {
                    coord: [dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT]
                },
                {
                    coord: [dateFL.setHours(dateFL.getHours()), 0]
                }
            ]
            markdata.push(fl)
        }
        // 第二次高潮
        if (arr[i].SCDHIGHWIDETIME !== '-') {
            // 第二次高潮的日期时间
            let dateSH = new Date(datestring + ' ' + arr[i].SCDHIGHWIDETIME + ':00')
            // 第二次高潮的曲线数据
            tidedata.push([dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT])
            // 第二次高潮的垂直标线数据
            let sh = [
                {
                    coord: [dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT]
                },
                {
                    coord: [dateSH.setHours(dateSH.getHours()), 0]
                }
            ]
            markdata.push(sh)
        }
        // 第二次低潮
        if (arr[i].SCDLOWWIDETIME !== '-') {
            // 第二次低潮的日期时间
            let dateSL = new Date(datestring + ' ' + arr[i].SCDLOWWIDETIME + ':00')
            // 第二次低潮的曲线数据
            tidedata.push([dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT])
            // 第二次低潮的垂直标线数据
            let sl = [
                {
                    coord: [dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT]
                },
                {
                    coord: [dateSL.setHours(dateSL.getHours()), 0]
                }
            ]
            markdata.push(sl)
        }
    } // end-for
    // 排序曲线数据集
    function SortByFirst (x, y) {
        return x[0] - y[0]
    }
    tidedata.sort(SortByFirst)

    // 数据准备完毕，生成并返回echarts用option
    return getOption(tidedata, markdata) 
}

// 由高低温数据生成五日预报气温chart option
const setFivedayChartOption = function (higharr, lowarr) {
    let low = 100   // 气温最低值
    let high = -100 // 气温最高值
    let anim = false // 是否显示动画
    // 获取气温最值
    for (let i = 0; i < 5; i++) {
        if (lowarr[i] < low) {
            low = lowarr[i]
        }
        if (higharr[i] > high) {
            high = higharr[i]
        }
    }
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

// 由数组生成近海预报表格数据
const setInshoreTableData = function (arr) {
    let result = {
        location: '',
        time: '',
        data: [],
        showextra: false,
        extra: {}
    }
    // 地区时间
    result.location = arr[0].SDOSCWAREA
    result.time = arr[0].PUBLISHDATE
    if (arr.length > 1) // 如果是青岛地区的数据
    {
        result.data.push({loc: '海域', wave: '浪高(m)', temp: '表层水温(℃)'})
        for (let i = 0; i < arr.length; i++) {
            result.data.push({loc: arr[i].SDOSCWAREA, wave: arr[i].SDOSCWLOWESTWAVEHEIGHT, temp: arr[i].SDOSCWSURFACETEMPERATURE})
        }
        // 青岛地区额外表格
        result.showextra = true
        result.extra = {
            wave48h: arr[0].SDOSCWESTWAVEHEIGHT48H,
            temp48h: arr[0].SDOSCWSURFACETEMPERATURE48H,
            wave72h: arr[0].SDOSCWESTWAVEHEIGHT72H,
            temp72h: arr[0].SDOSCWSURFACETEMPERATURE72H
        }
    } else { // 如果是山东其他城市的数据
        result.data.push({loc: '时效', wave: '浪高(m)', temp: '表层水温(℃)'})
        result.data.push({loc: '24h', wave: arr[0].SDOSCWLOWESTWAVEHEIGHT, temp: arr[0].SDOSCWSURFACETEMPERATURE})
        result.data.push({loc: '48h', wave: arr[0].SDOSCWESTWAVEHEIGHT48H, temp: arr[0].SDOSCWSURFACETEMPERATURE48H})
        result.data.push({loc: '72h', wave: arr[0].SDOSCWESTWAVEHEIGHT72H, temp: arr[0].SDOSCWSURFACETEMPERATURE72H})
    } // end-if-else
    return result
}

// 根据4值数组生成精细化预报chart option
const setRefinedChartOption = function (arr) {
    // 生成曲线data和标线data
    let tidedata = []
    let markdata = []
    for (let i = 0; i < arr.length; i++) {
        // 格式化日期时间数据
        let date = new Date(arr[i].FORECASTDATE)
        let fhtime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + arr[i].FIRSTHIGHTIME.substring(0,2) + ':' + arr[i].FIRSTHIGHTIME.substring(2) + ':00'
        let fltime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + arr[i].FIRSTLOWTIME.substring(0,2) + ':' + arr[i].FIRSTLOWTIME.substring(2) + ':00'
        let shtime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + arr[i].SECONDHIGHTIME.substring(0,2) + ':' + arr[i].SECONDHIGHTIME.substring(2) + ':00'
        let sltime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + arr[i].SECONDLOWTIME.substring(0,2) + ':' + arr[i].SECONDLOWTIME.substring(2) + ':00'
        // 如果日期不为'-'则加入数组
        if (arr[i].FIRSTHIGHTIME !== '-') {
            tidedata.push([new Date(fhtime), arr[i].FIRSTHIGHLEVEL])
            markdata.push([
                {coord: [new Date(fhtime), arr[i].FIRSTHIGHLEVEL]},
                {coord: [new Date(fhtime), 0]}
            ])
        }
        if (arr[i].FIRSTLOWTIME !== '-') {
            tidedata.push([new Date(fltime), arr[i].FIRSTLOWLEVEL])
            markdata.push([
                {coord: [new Date(fltime), arr[i].FIRSTLOWLEVEL]},
                {coord: [new Date(fltime), 0]}
            ])
        }
        if (arr[i].SECONDHIGHTIME !== '-') {
            tidedata.push([new Date(shtime), arr[i].SECONDHIGHLEVEL])
            markdata.push([
                {coord: [new Date(shtime), arr[i].SECONDHIGHLEVEL]},
                {coord: [new Date(shtime), 0]}
            ])
        }
        if (arr[i].SECONDLOWTIME !== '-') {
            tidedata.push([new Date(sltime), arr[i].SECONDLOWLEVEL])
            markdata.push([
                {coord: [new Date(sltime), arr[i].SECONDLOWLEVEL]},
                {coord: [new Date(sltime), 0]}
            ])
        }
    } // end-for
    // 曲线数据按照日期排序
    function SortByFirst (x, y) {
        return x[0] - y[0]
    }
    tidedata.sort(SortByFirst)
    // 根据潮汐和标线数据生成chart option
    return getOption(tidedata, markdata)
}

// 根据地区数据生成威海专项预报chart option
const setWeihaiChartOption = function (obj) {
    let tidedata = []
    let markdata = []
    // 格式化日期
    let reportdate = new Date(obj.FORECASTDATE)
    let reportdatestring = reportdate.getFullYear() + '/' + (reportdate.getMonth() + 1) + '/' + reportdate.getDate()
    let fhtime = reportdatestring + ' ' + obj.FIRSTHIGHTIME + ':00'
    let fltime = reportdatestring + ' ' + obj.FIRSTLOWTIME + ':00'
    let shtime = reportdatestring + ' ' + obj.SECONDHIGHTIME + ':00'
    let sltime = reportdatestring + ' ' + obj.SECONDLOWTIME + ':00'
    // 如果数据不为空则填入数组
    if (obj.FIRSTHIGHLEVEL !== '') {
        tidedata.push([new Date(fhtime), Number(obj.FIRSTHIGH)])
        markdata.push([
            { coord: [new Date(fhtime), Number(obj.FIRSTHIGH)] },
            { coord: [new Date(fhtime), 0] }
        ])
    }
    if (obj.FIRSTLOWLEVEL !== '') {
        tidedata.push([new Date(fltime), Number(obj.FIRSTLOW)])
        markdata.push([
            { coord: [new Date(fltime), Number(obj.FIRSTLOW)] },
            { coord: [new Date(fltime), 0] }
        ])
    }
    if (obj.SECONDHIGHLEVEL !== '') {
        tidedata.push([new Date(shtime), Number(obj.SECONDHIGH)])
        markdata.push([
            { coord: [new Date(shtime), Number(obj.SECONDHIGH)] },
            { coord: [new Date(shtime), 0] }
        ])
    }
    if (obj.SECONDLOWLEVEL !== '') {
        tidedata.push([new Date(sltime), Number(obj.SECONDLOW)])
        markdata.push([
            { coord: [new Date(sltime), Number(obj.SECONDLOW)] },
            { coord: [new Date(sltime), 0] }
        ])
    }
    // 曲线数据按照日期排序
    function SortByFirst (x, y) {
        return x[0] - y[0]
    }
    tidedata.sort(SortByFirst)
    // 根据曲线和标线数据生成chart option
    return getOption(tidedata, markdata)
}

// 根据精细化数据object生成精细化数据object
const setRefinedData = function (obj) {
    let result = []
    // 按照日期排序数组
    function SortByDate (x, y) {
        let datex = new Date(x.FORECASTDATE)
        let datey = new Date(y.FORECASTDATE)
        return datex - datey
    }
    let tidearr = obj.tide
    let temparr = obj.temperature
    let wavearr = obj.wave
    tidearr.sort(SortByDate)
    temparr.sort(SortByDate)
    wavearr.sort(SortByDate)
    // 生成每天数据 加入result数组
    let location = getLocName(tidearr[0].FORECASTAREA)
    for (let i = 0; i < 3; i++) {
        let daydata = {
            loc: location,  // 地区
            time: tidearr[i].FORECASTDATE,  // 日期
            wave: wavearr[i].WAVEHEIGHT,    // 浪高
            temp: temparr[i].WATERTEMPERATURE,  // 水温
            windLvl: wavearr[i].WINDFORCE,  // 风力
            windDir: wavearr[i].WINDDIRECTION,  // 风向
        }
        result.push(daydata)
    }
    return result
}

// 根据城市选择潮汐预报request的url和data
const getTideReqData = function (city) {
    let result = {
        url: '',
        data: {}
    }
    if (city === '青岛') {
        result.url = 'GetAstronomicalTide_QD'
        result.data = { name: 'admin', areaflg: '青岛' }
    } else {
        result.url = 'GetCityforcast_BH'
        result.data = { name: 'admin', areaflg: '山东',cityname: city }
    }
    return result
}

// 根据城市选择近海预报的request的url和data
const getInshoreReqData = function (city) {
    let result = {
        url: '',
        data: {}
    }
    if (city === '青岛') {
        result.url = 'GetQDBinhai_0823'
        result.data = { name: 'admin', areaflg: '山东' }
    } else {
        result.url = 'GetSevenCity_1020'
        result.data = { name: 'admin', areaflg: '山东',city: city }
    }
    return result
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
            return '东营渔港'
        case 'WHXQ':
            return '威海新区'
        case 'YTQQ':
            return '烟台清泉'
        case 'DJKP':
            return '董家口'
        case 'RZTHD':
            return '日照桃花岛'
        default:
            return ''
    }
}

// 根据tidedata和markdata生成曲线chart option
const getOption = function (tidedata, markdata) {
    // 获取现在时间
    let now = new Date()
    now = now.setHours(now.getHours())
    // 获取y轴最大最小值
    let max = -100
    let min = 1000
    for (let i = 0; i < markdata.length; i++) {
        let value = Number(markdata[i][0].coord[1])
        if (value > max) {
            max = value
        }
        if (value < min) {
            min = value
        }
    }
    // 获取x轴最大最小值
    let firstrecord = new Date(tidedata[0][0])
    let lastrecord = new Date(tidedata[tidedata.length-1][0])
    let firstdate = new Date(firstrecord.getFullYear() + '/' + (firstrecord.getMonth() + 1) + '/' + firstrecord.getDate() + ' 00:00:00')
    let lastdate = new Date(lastrecord.getFullYear() + '/' + (lastrecord.getMonth() + 1) + '/' + lastrecord.getDate() + ' 23:59:59')
    // 为了让x轴的长度显示完整三天，需要在tidedata首尾添加数据
    // 如果tidedata和markdata长度相同，则首尾都要添加，数值为所有item数值的平均值
    // 否则只在结尾添加，数值为tidedata最后一个item的数值
    if (tidedata.length === markdata.length) {
        // 计算平均值
        let sum = 0
        for (let i = 0; i < tidedata.length; i++) {
            sum += Number(tidedata[i][1])
        }
        // 开头添加
        tidedata.unshift([firstdate, sum / tidedata.length])
        // 结尾添加
        tidedata.push([lastdate, sum / tidedata.length])
    } else {
        tidedata.push([lastdate, tidedata[tidedata.length - 1][1]])
    }
    let option = {
        // 图表距离外围div的padding
        grid: {
            top: '4%',
            left: '-2.6%',
            right: '0%',
            bottom: '20%',
            // top: '4%',
            // left: '0%',
            // right: '2%',
            // bottom: '20%',
            containLabel: true
        },
        // 横坐标轴
        xAxis: {
            type: 'time',
            // show: false,
            offset: 0,
            interval: 24*60*60*1000,
            axisLabel: {
                // 横坐标刻度数值
                show: true,
                inside: true,
                // rotate: 90,
                fontSize: '14',
                align: 'left',
                padding: [0,0,30,0],
                color: 'red',
                // formatter: function (value, index) {
                //     // 格式化为'月-日'，只在第一个刻度显示年份
                //     let date = new Date(value)
                //     let texts = [date.getMonth() + 1, date.getDate()]
                //     if (index === 0) {
                //         texts.unshift(date.getFullYear())
                //     }
                //     return '\n' + texts.join('-')
                // } // end-formatter-axisLabel
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
            // 第一组series： 曲线数据 + 高低潮垂直标线 + 标线顶部数字label
            {
                name: '潮汐',
                type: 'line',
                smooth: true,
                silent: true,
                animation: false,
                symbolSize: 0, // 曲线上数据点小圆圈的大小
                lineStyle: {
                    color: '#1c8d3b', // 曲线颜色
                    width: 1 // 曲线粗细
                },
                data: tidedata,
                markLine: {
                    symbolSize: 0.1, // 垂直标线一端的箭头 和数据label的大小， 不能设为0否则label不显示
                    silent: true,
                    animation: false,
                    label: {
                        show: true,
                        position: 'start',
                        formatter: function (param) {
                            return param.data.coord[1] + 'cm'
                        }
                        /*
                        textStyle: {
                            color: '#000000',
                        }
                        */
                    }, // end-label-markLine
                    lineStyle: {
                        type: 'dot'
                    },
                    data: markdata
                },
                /*
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 2,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{b}'
                    },
                    itemStyle: {
                        color: 'blue'
                    },
                    data: [
                        {name:'一个点', x: 100, y: 60},
                        {name:'另一个点', coord:[tidedata[13][0], tidedata[13][1]]}
                    ]
                }
                */
            },
            // 第二组series: 高低潮垂直标线（透明度为0） + 标线底部时间label
            {
                name: '标线时间',
                type: 'line',
                markLine: {
                    symbolSize: 0.1,
                    opacity: 0, // 透明度为0 不渲染这条标线
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
                        }
                        /*
                        textStyle: {
                            color: '#000000',
                        }
                        */
                    }, // end-label-markLine
                    lineStyle: {
                        type: 'dot'
                    },
                    data: markdata
                } // end-markLine
            },
            // 第三组series： 两条水平标线 表示三天最高和最低的潮位
            {
                name: '最值横线',
                type: 'line',
                markLine: {
                    symbolSize: 0,
                    silent: true,
                    animation: false,
                    lineStyle: {
                        type: 'dot'
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

// 根据包含label信息的tidedata生成潮汐预报chart option
const getAstroOption = function (tidedata, markdata) {
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
    // 获取y轴最大最小值
    let max = -100
    let min = 1000
    for (let i = 0; i < markdata.length; i++) {
        let value = Number(markdata[i][0].coord[1])
        if (value > max) {
            max = value
        }
        if (value < min) {
            min = value
        }
    }
    // 为了让x轴的长度显示完整三天，需要在tidedata首尾添加数据
    // 获取x轴最大最小值
    // 第一个和最后一个tidedata的日期时间 得到第一天0点和最后一天23点59分59秒的日期
    let firstrecord = new Date(tidedata[0].value[0])
    let lastrecord = new Date(tidedata[tidedata.length - 1].value[0])
    let headdate = new Date(firstrecord.getFullYear() + '/' + (firstrecord.getMonth() + 1) + '/' + firstrecord.getDate() + ' 00:00:00')
    let taildate = new Date(lastrecord.getFullYear() + '/' + (lastrecord.getMonth() + 1) + '/' + lastrecord.getDate() + ' 23:59:59')
    // tidedata时间与与首尾之间的差值 秒
    let deltahead = Math.round(Number(firstrecord - headdate) / 1000)
    let deltatail = Math.round(Number(taildate - lastrecord) / 1000)
    // 倒数一二个tidedata的值
    let valuelast1 = tidedata[tidedata.length - 1].value[1]
    let valuelast2 = tidedata[tidedata.length - 2].value[1]
    // 最后一天23:59:59的值
    let tailvalue = ''
    // tidedata多于13组数据则是青岛地区
    if (tidedata.length > 13) {
        if (valuelast1 <= valuelast2) { // 曲线末尾下坠
            // 如果尾部差值小于59分59秒 则最后数据点为极值
            if (deltatail < 3599) {
                // 尾部上扬
                tailvalue = valuelast1 + Math.round(deltatail / 120)
            } else {
                // 尾部下坠
                tailvalue = valuelast1 - Math.round(deltatail / 120)
            }
        } else {    // 曲线末尾上扬
            // 如果尾部差值小于59分59秒 则最后数据点为极值
            if (deltatail < 3599) {
                // 尾部下坠
                tailvalue = valuelast1 - Math.round(deltatail / 120)
            } else {
                tailvalue = valuelast1 + Math.round(deltatail / 120)
            }
        }
    } else {    // 青岛以外的城市
        if (valuelast1 <= valuelast2) { // 曲线末尾下坠
            // 尾部上扬
            tailvalue = valuelast1 + Math.round(deltatail / 120)
        } else {    // 曲线末尾上扬
            tailvalue = valuelast1 - Math.round(deltatail / 120)
        }
    }
    if (tailvalue > max) {
        tailvalue = max
    }
    if (tailvalue < min) {
        tailvalue = min
    }
    // 向tidedata结尾添加数据
    tidedata.push({
        value: [taildate, tailvalue]
    })
    // 如果第一个tidedata的时间与0点有差值 则需要在tidedata开头插入数据
    if (deltahead !== 0) {
        // 第一二个tidedata的值
        let value1 = tidedata[0].value[1]
        let value2 = tidedata[1].value[1]
        // 第一天0点的值
        let headvalue = ''
        if (value1 <= value2) { // 第一点小于第二点 说明第一点为低潮 0点数值高于第一点
            headvalue = value1 + Math.round(deltahead / 120)
        } else {    // 第一点大于第二点 说明第一点为高潮 0点数值低于第一点
            headvalue = value1 - Math.round(deltahead / 120)
        }
        if (headvalue > max) {
            headvalue = max
        }
        if (headvalue < min) {
            headvalue = min
        }
        // 向tidedata开头添加数据
        tidedata.unshift({
            value: [headdate, headvalue]
        })
    }
    
    let option = {
        // 图表距离外围div的padding
        grid: {
            top: '4%',
            left: '0%',
            right: '2%',
            bottom: '20%',
            containLabel: true
        },
        // 横坐标轴
        xAxis: {
            type: 'time',
            // show: false,
            offset: 0,
            interval: 24 * 60 * 60 * 1000,
            axisLabel: {
                // 横坐标刻度数值
                show: true,
                inside: true,
                rotate: 90,
                formatter: function (value, index) {
                    // 格式化为'月-日'，只在第一个刻度显示年份
                    let date = new Date(value)
                    let texts = [date.getMonth() + 1, date.getDate()]
                    if (index === 0) {
                        texts.unshift(date.getFullYear())
                    }
                    return '\n' + texts.join('-')
                } // end-formatter-axisLabel
            }, // end-axisLabel
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
            interval: 24*60*60*1000,
            axisLabel: {
                // 横坐标刻度数值
                show: true,
                showMaxLabel: false,
                inside: true,
                fontSize: '14',
                align: 'left',
                padding: [0,0,30,0],
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
                    url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + lati + ',' + longi + '&coordtype=wgs84ll&output=json&pois=0&ak=' +'lRNKq2t9caNdkxY4jsbPR7j9B8lsSqu6',
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
            fail: function() {
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

// 在console显示object内部的属性
const deepEquals = function (x, y, layer) {
    if (layer > 6) {
        return
    }
    let head = ''
    for (let i = 0; i < layer; i++) {
        head += '  '
    }
    for (let attr in x) {
        if (x.hasOwnProperty(attr) & y.hasOwnProperty(attr)) {
            console.log(head + attr + ' : ' + x[attr])
            if (typeof x[attr] != 'string') {
                this.deepEquals(x[attr], y[attr], layer + 1)
            }
        }
    }
}

module.exports = {
    setWeatherIcon: setWeatherIcon, // 天气图标
    setAirconIcon: setAirconIcon,   // 空气质量图标
    setAirconClass: setAirconClass, // pm2.5 class
    setTideChartOption: setTideChartOption, // 潮汐chart option
    setFivedayChartOption: setFivedayChartOption, // 五日高低温chart option
    setFivedayChartOptionNew: setFivedayChartOptionNew,
    setInshoreTableData: setInshoreTableData,   // 近海预报数据
    setRefinedChartOption: setRefinedChartOption, // 精细化预报chart option
    setRefinedData: setRefinedData, // 精细化预报图表下方数据
    setWeihaiChartOption: setWeihaiChartOption, // 威海专项预报chart option
    getTideReqData: getTideReqData, // 潮汐预报request的url和data
    getInshoreReqData: getInshoreReqData,   // 近海预报的request的url和data
    getLocName: getLocName, // 根据潮汐预报STATION生成对应的地名
    storeToLocal: storeToLocal, //将数据存入本地缓存
    getOption: getOption,   // 根据tidedata和markdata生成曲线chart option
    getAstroOption: getAstroOption, // 根据包含Label的tidedata和markdata生成潮汐chart option
    getAstroOptionNew: getAstroOptionNew,
    buildTidedata: buildTidedata,
    buildMarkdata: buildMarkdata,
    switchCity: switchCity, // 切换城市 包括自动定位
    deepEquals: deepEquals
}
