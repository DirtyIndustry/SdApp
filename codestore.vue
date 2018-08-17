<template>
<scroll-view class="scroll-view_H" scroll-x="true">
    <view class="chart">
        <mpvue-echarts :echarts="echarts" :onInit="handleInit" canvasId="canvasid"></mpvue-echarts>
    </view>
</scroll-view>
</template>

<style>
.chart { width: 290%; height: 250px; border: 1px solid #000000; }
</style>

<script>
    import * as echarts from 'echarts'
    import mpvueEcharts from 'mpvue-echarts'

    let chart

    export default {
        components: {
            mpvueEcharts
        },
        data () {
            return {
                echarts,
                option: {}
            }
        },
        method: {
            // 读取服务器潮汐预报
            loadAstronomicalTide() {
                let that = this
                uni.request({
                    url: 'http://123.234.129.238:8001/MyWebService.asmx/GetAstronomicalTide_QD',
                    data: {
                        name: 'admin',
                        areaflg: '山东'
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log('成功获取潮汐预报数据')
                        // STATION 101wmt为金沙滩 102xmd为第一海水浴场
                        let resarr = JSON.parse(res.data.d)
                        let arrJST = []	// 金沙滩三日数据数组
                        let arrYY = []	//一浴三日数据数组
                        // 遍历接口返回值，依据STATION将数据放入以上两个数组中
                        for (let i = 0; i < 6; i++) {
                            if (resarr[i].STATION === '101wmt') {
                                arrJST.push(resarr[i])
                            } else if (resarr[i].STATION === '102xmd') {
                                arrYY.push(resarr[i])
                            }
                        } // end-for
                        // 由数组生成echarts所需的option
                        that.optionJST = that.setChartOption(arrJST)
                        that.optionYY = that.setChartOption(arrYY)
                    } // end-success-request
                }) // end-request
            },
            // 由三日数据生成chart option
            setChartOption(arr) {
                // 按日期排序
                function SortByDate(x, y) {
                    let datex = new Date(x.PREDICTIONDATE)
                    let datey = new Date(y.PREDICTIONDATE)
                    return datex - datey
                }
                arr.sort(SortByDate)
                // 提取潮汐数值
                let tidedata = [] // 曲线用的数值集
                let markdata = [] // 最高最低潮竖直标线用的数值集
                let max = 0			// 三天最高潮位数值
                let min = 0			// 三天最低潮位数值
                for (let i = 0; i < arr.length; i++) {
                    // 一次循环为一天的数据
                    // 初始日期时间
                    let inittime = new Date(arr[i].PREDICTIONDATE)
                    // 高低潮需要的日期字符串，必须在这里取值，后面的运算会改变inittime值
                    let datestring = inittime.getFullYear() + '-' + (inittime.getMonth() + 1) + '-' + inittime.getDate()
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
                    // 第一次高潮的日期时间
                    let dateFH = new Date(datestring + ' ' + arr[i].FSTHIGHWIDETIME)
                    // 第一次高潮曲线数据
                    tidedata.push([dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT])
                    // 第一次高潮垂直标线数据
                    // 垂直标线数据格式为: [ [{coord: [横坐标1, 纵坐标起始值1]},{coord: [横坐标1, 纵坐标结束值1]}], [{coord: [横坐标2, 纵坐标起始值2]},{coord: [横坐标2, 纵坐标结束值2]}], ... ]
                    let fh = [{
                        coord: [dateFH.setHours(dateFH.getHours()), arr[i].FSTHIGHWIDEHEIGHT]
                    }, {
                        coord: [dateFH.setHours(dateFH.getHours()), 0]
                    }]
                    markdata.push(fh)
                    // 第一次低潮的日期时间
                    let dateFL = new Date(datestring + ' ' + arr[i].FSTLOWWIDETIME)
                    // 第一次低潮的曲线数据
                    tidedata.push([dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT])
                    // 第一次低潮的垂直标线数据
                    let fl = [{
                        coord: [dateFL.setHours(dateFL.getHours()), arr[i].FSTLOWWIDEHEIGHT]
                    }, {
                        coord: [dateFL.setHours(dateFL.getHours()), 0]
                    }]
                    markdata.push(fl)
                    // 第二次高潮的日期时间
                    let dateSH = new Date(datestring + ' ' + arr[i].SCDHIGHWIDETIME)
                    // 第二次高潮的曲线数据
                    tidedata.push([dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT])
                    // 第二次高潮的垂直标线数据
                    let sh = [{
                        coord: [dateSH.setHours(dateSH.getHours()), arr[i].SCDHIGHWIDEHEIGHT]
                    }, {
                        coord: [dateSH.setHours(dateSH.getHours()), 0]
                    }]
                    markdata.push(sh)
                    // 第二次低潮的日期时间
                    let dateSL = new Date(datestring + ' ' + arr[i].SCDLOWWIDETIME)
                    // 第二次低潮的曲线数据
                    tidedata.push([dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT])
                    // 第二次低潮的垂直标线数据
                    let sl = [{
                        coord: [dateSL.setHours(dateSL.getHours()), arr[i].SCDLOWWIDEHEIGHT]
                    }, {
                        coord: [dateSL.setHours(dateSL.getHours()), 0]
                    }]
                    markdata.push(sl)
                    // 计算今天的最高潮位 并与已有的max值比较 将最大值存入max用于水平标线
                    let firstH = Number(arr[i].FSTHIGHWIDEHEIGHT)
                    let secondH = Number(arr[i].SCDHIGHWIDEHEIGHT)
                    if (firstH > secondH) { // 如果First比较大
                        if (firstH > max) {
                            max = firstH
                        }
                    } else { // 如果Second比较大
                        if (secondH > max) {
                            max = secondH
                        }
                    }
                    // 计算今天的最低潮位 并于已有的min值比较 将最小值存入min用于水平标线
                    let firstL = Number(arr[i].FSTLOWWIDEHEIGHT)
                    let secondL = Number(arr[i].SCDLOWWIDEHEIGHT)
                    if (firstL < secondL) { // 如果First比较小
                        if (firstL < min || min === 0) {
                            min = firstL
                        }
                    } else { // 如果Second比较小
                        if (secondL < min || min === 0) {
                            min = secondL
                        }
                    }
                } // end-for
                // 排序曲线数据集
                function SortByFirst(x, y) {
                    return x[0] - y[0]
                }
                tidedata.sort(SortByFirst)
                //markdata.sort(SortByFirst)
                // 数据准备完毕，生成并返回echarts用option
                return {
                    // 图表距离外围div的padding
                    grid: {
                        top: '4%',
                        left: '0%',
                        right: '2%',
                        bottom: '20%',
                        containLabel: true
                    },
                    // 横坐标周
                    xAxis: {
                        type: 'time',
                        axisLabel: { // 不显示横坐标刻度数值
                            show: false
                        }
                    },
                    yAxis: {
                        show: false
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
                                //type: 'solid',
                                color: '#1c8d3b', // 曲线颜色
                                width: 1					// 曲线粗细
                            },
                            data: tidedata,
                            markLine: {
                                symbolSize: 0.1,	// 垂直标线一端的箭头 和数据label的大小， 不能设为0否则label不显示
                                silent: true,
                                animation: false,
                                label: {
                                    show: true,
                                    position: 'start',
                                    formatter: function (param) {
                                        return param.data.coord[1] + 'cm'
                                    },
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
                            name: '标线日期',
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
                                data: [
                                    { yAxis: max },
                                    { yAxis: min }
                                ]
                            } // end-markLine
                        }
                    ] // end-series
                } // end-return
            },
            
            handleInit(canvas, width, height) {
                chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                }),
                    canvas.setChart(chart)
                chart.setOption(this.option)
                return chart
            }
        }
    }
</script>