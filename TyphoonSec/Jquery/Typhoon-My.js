
var map;
var numberFor = [];
var tfnumber = 0;
$(document).ready(function () {
    //年加载 begin
    $('#typhoonYearul').empty();
    var date = new Date();
    var tfYearSelect = new Date().getFullYear();
    $(".tfYearList").html("")
    for (tfYearSelect; tfYearSelect > 1944; tfYearSelect--) {
        $(".tfYearList").append('<li value="' + tfYearSelect + '">' + tfYearSelect + '</li>');
    }
    //n = $('.line li').size();
    //var wh = 100 * n + "%";
    //$('.line').width(wh);
    //var lt = (100 / n / 4);
    //var lt_li = lt + "%";
    //$('.line li').width(lt_li);
    //var y = 0;
    //var w = n / 2;
    //年份选择
    $(".tfYearList li").click(function () {
        $.ajax({
            type: "POST",
            url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList",
            data: { areaflg: '青岛', Typhoonyear: $(this).attr("value") },
            success: function (result) {
                var array = $(result).find('string').text().split('#');
                array.pop();
                $('#typInformation table').html('')
                if (array.length > 0) {
                    $(array).each(function () {
                        $('#typInformation table').prepend("<tr><td>" + this.split(',')[0] + "</td><td>" + this.split(',')[1] + "</td><td>" + this.split(',')[2] + "</td></tr>");
                    });
                    $('#typInformation table').prepend('<tr><th>编号</th><th>中文名</th><th>英文名</th></tr>');
                }
                else {
                    $('#typInformation table').append('未查找到台风信息');
                }
                $('#typInformation').show();
                $("#typInformation table tr:gt(0)").click(function () {
                    $("#typhoonBox").hide();
                    $(".tfYear").hide();
                    $("#typhoonName").text("台风：" + $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')');
                    select_name = $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')';
                    GetTyphoonPath($($(this).find('td')[0]).text());

                });
            }
        })
    })
    $(".tfYear").click(function () {
        $(".tfYear").hide();
    })
    $(".tfYear select").change(function () {
        $("#txtsearch").val('')
        $.ajax({
            type: "POST",
            url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList",
            data: { areaflg: '青岛', Typhoonyear: $(".tfYear select").val() },
            success: function (result) {
                var array = $(result).find('string').text().split('#');
                array.pop();
                $('#typInformation table').html('')
                if (array.length > 0) {
                    $(array).each(function () {
                        $('#typInformation table').prepend("<tr><td>" + this.split(',')[0] + "</td><td>" + this.split(',')[1] + "</td><td>" + this.split(',')[2] + "</td></tr>");
                    });
                    $('#typInformation table').prepend('<tr><th>编号</th><th>中文名</th><th>英文名</th></tr>');
                }
                else {
                    $('#typInformation table').append('未查找到台风信息');
                }
                $('#typInformation').show();
                $("#typInformation table tr:gt(0)").click(function () {
                    $("#typhoonBox").hide();
                    $(".tfYear").hide();
                    $("#typhoonName").text("台风：" + $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')');
                    select_name = $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')';
                    GetTyphoonPath($($(this).find('td')[0]).text());

                });
            }
        })
    })
    //搜索
    $("#search").click(function () {
        $.ajax({
            type: "POST",
            url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList",
            data: { areaflg: '青岛', Typhoonyear: $("#txtsearch").val() },
            success: function (result) {
                var array = $(result).find('string').text().split('#');
                array.pop();
                $('#typInformation table').html('')
                if (array.length > 0) {
                    $(array).each(function () {
                        $('#typInformation table').prepend("<tr><td>" + this.split(',')[0] + "</td><td>" + this.split(',')[1] + "</td><td>" + this.split(',')[2] + "</td></tr>");
                    });

                    $('#typInformation table').prepend('<tr><th>编号</th><th>中文名</th><th>英文名</th></tr>');
                }
                else {
                    $('#typInformation table').append('未查找到台风信息');
                }
                $('#typInformation').show();
                $("#typInformation table tr:gt(0)").click(function () {
                    $("#typhoonBox").hide();
                    $(".tfYear").hide();
                    $("#typhoonName").text("台风：" + $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')');
                    select_name = $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')';
                    GetTyphoonPath($($(this).find('td')[0]).text());

                });
            }
        })
    })
    //回车搜索
    $("#txtsearch").keydown(function (e, k) {
        if (e.keyCode == 13) {
            $("#search").click();
        }
    })
    var imgUrl = "Images/";
    var lineArrAll = [];
    var array_data = [];
    var int_arr = 0;
    var setMap = true;
    var select_name;
    //地图上点的信息
    var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
    //创建地图
    map = new AMap.Map('container', {
        center: [123, 30],
        zoom: 4.3
    });
    //给地图添加点击事件
    map.on('click', mapClick);
    $("#typhoon li").click(function () {
        $("#typhoon").hide();
        $("#typList").text("当前台风：" + $(this).text());
    });
    $("#close").click(function () {
        $("#legend").hide();
    });
    $("#legnedButton").click(function () {
        $("#legend").slideToggle();
    });
    $("#typhoonChoose input").click(function () {
        $("#typhoonBox").slideToggle();
        $('#typhoonYear').show();
        $('#typInformation').hide();
        $("#cancel").click();
    });
    //年份选择
    $('#typhoonYearul li').click(function () {
        $('#typhoonYearul li').css({ 'background-color': 'transparent' });
        $(this).css({ 'background-color': '#b0e9e8' });

        $('#typInformation table').empty();
        //获取台风列表
        ;
        $("#years").hide();
        $("#typhoon").slideDown();
    });
    $(".byYear input").click(function () {
        $(".tfYear").show();
        $('.tfYear select').click()
    });
    $(".tfYearList li").click(function () {
        $(".tfYear").hide();
    });
    //搜索操作
    $(".bySearch input").focus(function () {
        $(".tfYear").hide();
        $(".byYear input").hide();
        $(".bySearch").css("float", "left");
        $("#search,#cancel").show();
    });
    $("#cancel").click(function () {
        $("#txtsearch").val('')
        $(".byYear input").show();
        $(".bySearch").css("float", "right");
        $("#search,#cancel").hide();
    });
    //台风路径
    function typhoonYearulclick() {
        $('#typhoonYearul li').css({ 'background-color': 'transparent' });
        $(this).css({ 'background-color': '#b0e9e8' });
        $('#typInformation table').empty();
        //获取台风列表
        $.ajax({
            type: "POST",
            url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList",
            data: { areaflg: '青岛', Typhoonyear: $(this).text() },
            success: function (result) {
                var array = $(result).find('string').text().split('#');
                array.pop();
                $('#typInformation table').append('<tr><th>编号</th><th>中文名</th><th>英文名</th></tr>');
                $(array).each(function () {
                    $('#typInformation table').append("<tr><td>" + this.split(',')[0] + "</td><td>" + this.split(',')[1] + "</td><td>" + this.split(',')[2] + "</td></tr>");
                });
                $('#typInformation').show();
                $("#typInformation table tr:gt(0)").click(function () {
                    $("#typhoonBox").hide();
                    $("#typhoonName").text("台风：" + $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')');
                    select_name = $($(this).find('td')[1]).text() + '(' + $($(this).find('td')[2]).text() + ')';
                    GetTyphoonPath($($(this).find('td')[0]).text());

                });
            }
        });
        $("#years").hide();
        $("#typhoon").slideDown();
    };
    //根据编号获取台风路径
    function GetTyphoonPath(number) {
        $.ajax({
            type: "POST",
            url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonPath",
            data: { areaflg: '青岛', typhoonNumber: number },
            success: function (result) {
                map.clearMap();
                lineArrAll.splice(0, lineArrAll.length);
                //时间、经度、维度、中心气压、中心风力、七级风圈、10级风圈、移动速度、风向
                array_data = $(result).find('string').text().split('#$');
                array_data.pop();
                SetMap(select_name);
                if ($.inArray(number, numberFor) != -1)
                    GetForcestPaths(number, array_data[array_data.length - 1], select_name);
            }
        });
    }
    //台风路径绘制
    function SetMap(tf_name) {
        if (tfnumber == 1 || tfnumber == 0) {
            $("#typhoonName").css("line-height", "60px");
        } else if (tfnumber == 2) {
            $("#typhoonName").css("line-height", "30px");
        } else if (tfnumber >= 3) {
            $("#typhoonName").css({ "line-height": "20px", "font-size": "14px" });
        }
        var lineArrAll = [];
        var tf_move = null;
        var jd = 0.0;
        var wd = 0.0;
        tf_move = new AMap.Marker({
            map: map,
            position: [array_data[0].split(',')[1], array_data[0].split(',')[2]],
            offset: new AMap.Pixel(-12, -12),
            icon: new AMap.Icon({
                size: new AMap.Size(25, 25),  //图标大小
                image: imgUrl + "tf_center25x25.gif"
            })
        });
        for (var i = 0; i < array_data.length; i++) {
            var array_path = array_data[i].split(',');
            var Marker_url = GetMapImage(parseFloat(array_path[4]));
            var marker = new AMap.Marker({
                map: map,
                position: [array_path[1], array_path[2]],
                offset: new AMap.Pixel(-5, -5),
                icon: new AMap.Icon({
                    size: new AMap.Size(11, 11),  //图标大小
                    image: Marker_url
                })
            });
            lineArrAll.push([array_path[1], array_path[2]]);
            var content = "<div style=\"padding:0px 0px 0px 4px;\"><b>台风信息：" + tf_name + "</b><br/>" + "时间：" + array_path[0] + "<br/>" + "经纬度：" + array_path[1] + "," + array_path[2] + "<br/>" + "中心气压(百帕)：" + array_path[3] + "<br/>" + "中心风力(米/秒)：" + array_path[4] + "<br/>" + "七级风圈(公里)：" + array_path[5] + "<br/>" + "十级风圈(公里)：" + array_path[6] + "<br/>" + "移动速度(公里/时)：" + array_path[7] + "<br/>" + "移动方向：" + array_path[8];
            marker.content = content;
            marker.on('click', markerClick);
            if (i != 0) {
                var array_path_pre = array_data[i - 1].split(',');
                var lineArr = [[array_path_pre[1], array_path_pre[2]], [array_path[1], array_path[2]]];
                polyline = new AMap.Polyline({
                    path: lineArr,          //设置线覆盖物路径
                    strokeColor: "#3366FF", //线颜色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: 3,        //线宽
                    strokeStyle: "solid",   //线样式
                    strokeDasharray: [0, 0] //补充线样式
                });
                polyline.setMap(map);
            }
            jd += parseFloat(array_path[1]);
            wd += parseFloat(array_path[2]);
        }
        map.setCenter([jd / array_data.length, wd / array_data.length]);
        map.setZoom(3);

        polylineAll = new AMap.Polyline({
            path: lineArrAll,          //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 3,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [0, 0] //补充线样式
        });
        tf_move.moveAlong(lineArrAll, 250000);
    }
    layers = new AMap.TileLayer.Satellite();
    //卫星图切换
    $('#mapChange').click(function () {
        if (setMap) {
            var getcenter = map.getCenter();
            var getzoom = map.getZoom();
            map.add(layers);
            setMap = false;
            $('.amap-logo img').attr('src', 'Images/fontfamily.png').fadeTo(0, 0.5);
            $('.amap-logo').attr('href', '');
            $(this).css({ 'background-image': 'url(Images/jddt.png)' });
        }
        else {
            map.remove(layers);
            setMap = true;
            $(this).css({ 'background-image': 'url(Images/wxdt.png)' });
        }
        $('.amap-logo').attr('href', '');
        $('.amap-logo img').attr('src', 'Images/fontfamily.png');
    });
    //台风点的点击事件
    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }
    //地图点击事件
    function mapClick() {
        $("#legend").hide();
        $("#typhoonBox").hide();
        $('.tfYear').hide();
        if (infoWindow && typeof (infoWindow) != "undefined") {
            infoWindow.close();
        }
    }
    //根据风力获取对应在地图上点的图片
    function GetMapImage(move_speed) {
        if (move_speed < 17.2) {
            //热带低压
            return imgUrl + "TropicalDepression.png";
        }
        else if (move_speed < 24.5) {
            //热带风暴
            return imgUrl + "tropicalStorm.png";
        }
        else if (move_speed < 32.6) {
            //强热带风暴
            return imgUrl + "SevereTropicalStorm.png";
        }
        else if (move_speed < 41.4) {
            //台风
            return imgUrl + "Typhoon.png";
        }
        else if (move_speed < 50.9) {
            //强台风
            return imgUrl + "ViolentTyphoon.png";
        }
        else {
            //超强台风
            return imgUrl + "SuperTyphoon.png";
        }
    }
    $('.amap-logo img').attr('src', 'Images/fontfamily.png').fadeTo(0, 1);
    var nowdate = new Date();
    $("#typhoonName").text('');
    var index = 0;
    $.ajax({
        type: "POST",
        async: false,
        url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonList",
        data: { areaflg: '青岛', Typhoonyear: nowdate.getFullYear() },
        success: function (result) {
            //加入typhoon中 //.each(function () { $(this).remove(); })
            var array = $(result).find('string').text().split('#');
            array.pop();
            if (array.length > 0) {
                for (var index = 0; index < array.length; index++) {
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: "http://123.234.129.238:8001/MyWebService.asmx/GetTyphoonPath",
                        data: { areaflg: '青岛', typhoonNumber: array[index].split(',')[0] },
                        success: function (result) {
                            lineArrAll.splice(0, lineArrAll.length);
                            array_data = $(result).find('string').text().split('#$');
                            array_data.pop();
                            //时间、经度、维度、中心气压、中心风力、七级风圈、10级风圈、移动速度、风向
                            var tfdate = new Date(array_data[array_data.length - 1].split(",")[0].replace(/-/g, '/'));
                            nowdate = new Date();
                            nowdate.setHours(nowdate.getHours() - 10);
                            if (tfdate > nowdate) {
                                array_data = $(result).find('string').text().split('#$');
                                array_data.pop();
                                if ($("#typhoonName").text().length > 2) {
                                    $("#typhoonName").html($("#typhoonName").text() + '<br />' + "台风：" + array[index].split(',')[1] + '(' + array[index].split(',')[2] + ')');
                                    tfnumber++;
                                }
                                else {
                                    $("#typhoonName").text("台风：" + array[index].split(',')[1] + '(' + array[index].split(',')[2] + ')');
                                    tfnumber++;
                                }
                                SetMap(array[index].split(',')[1] + '(' + array[index].split(',')[2] + ')');
                                GetForcestPaths(array[index].split(',')[0], array_data[array_data.length - 1], array[index].split(',')[1] + '(' + array[index].split(',')[2] + ')');
                                numberFor.push(array[index].split(',')[0]);
                            }
                            else {
                                array_data = [];
                            }
                        }
                    });
                }
            }
        }
    });
    if ($("#typhoonName").text().length == 0)
        $("#typhoonName").text('当前无台风');
    map.zoomIn();
    map.zoomOut();
    function GetForcestPaths(number, point, tf_fname) {
        GetForcestPath(number, [point.split(',')[1], point.split(',')[2]], tf_fname, '#F53C49', '中国');
        GetForcestPath(number, [point.split(',')[1], point.split(',')[2]], tf_fname, '#EA6AE9', '中国台湾');
        GetForcestPath(number, [point.split(',')[1], point.split(',')[2]], tf_fname, '#FF982E', '中国香港');
        GetForcestPath(number, [point.split(',')[1], point.split(',')[2]], tf_fname, '#44D9F5', '美国');
        GetForcestPath(number, [point.split(',')[1], point.split(',')[2]], tf_fname, '#5BF964', '日本')
    }
    function GetForcestPath(numbre, point, tf_fname, color, sites) {
        $.ajax({
            type: "POST",
            async: false,
            url: "http://123.234.129.238:8001/MyWebService.asmx/Typhoonforcastpath",
            data: { areaflg: '青岛', name: "admin", number: numbre, forcastlestTyphoon: sites },
            success: function (result) {
                var forcest = $(result).find('string').text().split('#$');
                forcest.pop();
                var jd = 0.0;
                var wd = 0.0;
                for (var i = 0; i < forcest.length; i++) {
                    var array_path = forcest[i].split(',');
                    var Marker_url = GetMapImage(parseFloat(array_path[3]));
                    var marker = new AMap.Marker({
                        position: [array_path[1], array_path[2]],
                        offset: new AMap.Pixel(-5, -5),
                        icon: new AMap.Icon({
                            size: new AMap.Size(11, 11),  //图标大小
                            image: Marker_url,
                            imageOffset: new AMap.Pixel(0, 0)
                        })
                    });
                    var content = "<div style=\"padding:0px 0px 0px 4px;\"><b>台风预报信息：" + tf_fname + "</b><br/>" +
                        "预报台：" + sites + "<br/>" +
                        "时间：" + array_path[0] + "<br/>" +
                     "经纬度：" + array_path[1] + "," + array_path[2] + "<br/>" +
                     "最大风速(m/s)：" + array_path[3] + "<br/>";
                    marker.content = content;
                    marker.on('click', markerClick);
                    marker.setMap(map);
                    if (i != 0) {
                        var array_path_pre = forcest[i - 1].split(',');
                        var lineArr = [[array_path_pre[1], array_path_pre[2]], [array_path[1], array_path[2]]];
                        polyline = new AMap.Polyline({
                            path: lineArr,          //设置线覆盖物路径
                            strokeColor: color, //线颜色
                            strokeOpacity: 1,       //线透明度
                            strokeWeight: 3,        //线宽
                            strokeStyle: "dashed",   //线样式
                            strokeDasharray: [10, 10] //补充线样式
                        });
                        polyline.setMap(map);
                    }
                    else {
                        var lineArr = [point, [array_path[1], array_path[2]]];
                        polyline = new AMap.Polyline({
                            path: lineArr,          //设置线覆盖物路径
                            strokeColor: color, //线颜色
                            strokeOpacity: 1,       //线透明度
                            strokeWeight: 3,        //线宽
                            strokeStyle: "dashed",   //线样式
                            strokeDasharray: [10, 10] //补充线样式
                        });
                        polyline.setMap(map);
                    }
                }
            }
        });
    }
});
