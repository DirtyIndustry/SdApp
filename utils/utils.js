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
    let max = 0 // 三天最高潮位数值
    let min = 0 // 三天最低潮位数值
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
        // 计算今天的最高潮位 并与已有的max值比较 将最大值存入max用于水平标线
        let firstH = Number(arr[i].FSTHIGHWIDEHEIGHT)
        let secondH = Number(arr[i].SCDHIGHWIDEHEIGHT)
        if (firstH > secondH) {
            // 如果First比较大
            if (firstH > max) {
                max = firstH
            }
        } else {
            // 如果Second比较大
            if (secondH > max) {
                max = secondH
            }
        }
        // 计算今天的最低潮位 并于已有的min值比较 将最小值存入min用于水平标线
        let firstL = Number(arr[i].FSTLOWWIDEHEIGHT)
        let secondL = Number(arr[i].SCDLOWWIDEHEIGHT)
        if (firstL < secondL) {
            // 如果First比较小
            if (firstL < min || min === 0) {
                min = firstL
            }
        } else {
            // 如果Second比较小
            if (secondL < min || min === 0) {
                min = secondL
            }
        }
    } // end-for
    // 排序曲线数据集
    function SortByFirst (x, y) {
        return x[0] - y[0]
    }
    tidedata.sort(SortByFirst)

    // 数据准备完毕，生成并返回echarts用option
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
            } // end-axisLabel
        },
        yAxis: {
            show: false,
            boundaryGap: ['20%', '20%'] // 纵坐标轴的范围，比有效数字上下多出20%
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
                }
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

// 设置日期球的状态 scrollLeft为滚动距最左边的距离，windowWidth是系统信息屏幕宽度, ballObj为包含一系列bool值的object
const setDateballStatus = function (scrollLeft, windowWidth, ballObj) {
    //开始滚动 scrollLeft为0
    if (scrollLeft < 50) {
        // 刚开始滚动 还不足以让第二个球开始动
        ballObj.fstballActive = true;
        ballObj.sndballActive = false;
        ballObj.trdballActive = false;
        ballObj.sndballMove = false;
        ballObj.sndballLeft = false;
        ballObj.trdballMove = false;
        ballObj.trdballLeft = false;
    } else if (scrollLeft < windowWidth - 45) {
        // 第二个球开始动
        ballObj.fstballActive = true;
        ballObj.sndballActive = false;
        ballObj.trdballActive = false;
        ballObj.sndballMove = true;
        ballObj.sndballLeft = false;
        ballObj.trdballMove = false;
        ballObj.trdballLeft = false;
    } else if (scrollLeft < windowWidth) {
        // 第二个球停在最左边 第三个球还没开始动
        ballObj.fstballActive = false;
        ballObj.sndballActive = true;
        ballObj.trdballActive = false;
        ballObj.sndballMove = false;
        ballObj.sndballLeft = true;
        ballObj.trdballMove = false;
        ballObj.trdballLeft = false;
    } else if (scrollLeft < windowWidth + 9) {
        // 第三个球开始动
        ballObj.fstballActive = false;
        ballObj.sndballActive = true;
        ballObj.trdballActive = false;
        ballObj.sndballMove = false;
        ballObj.sndballLeft = true;
        ballObj.trdballMove = true;
        ballObj.trdballLeft = false;
    } else if (scrollLeft < windowWidth + 270) {
        // 第三个球动
        ballObj.fstballActive = false;
        ballObj.sndballActive = true;
        ballObj.trdballActive = false;
        ballObj.sndballMove = false;
        ballObj.sndballLeft = true;
        ballObj.trdballMove = true;
        ballObj.trdballLeft = false;
    } else {
        // 第三个球停在最左边
        ballObj.fstballActive = false;
        ballObj.sndballActive = false;
        ballObj.trdballActive = true;
        ballObj.sndballMove = false;
        ballObj.sndballLeft = true;
        ballObj.trdballMove = false;
        ballObj.trdballLeft = true;
    }
}

// 由高低温数据生成五日预报气温chart option
const setFivedayChartOption = function (higharr, lowarr) {
    let low = 100   // 气温最低值
    let high = -100 // 气温最高值
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
                animation: false,
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
                animation: false,
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

module.exports = {
    setWeatherIcon: setWeatherIcon, // 根据天气设置图标
    setAirconIcon: setAirconIcon,   // 根据空气质量设置图标
    setAirconClass: setAirconClass, // 根据空气质量设置pm2.5 class
    setTideChartOption: setTideChartOption, // 由三日数据生成chart option
    setDateballStatus: setDateballStatus,   // 设置日期球的状态
    setFivedayChartOption: setFivedayChartOption // 由高低温数据生成chart option
}