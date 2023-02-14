document.oncontextmenu = function () {
    window.event.returnValue = false; //將滑鼠右鍵事件取消
}


$(document).ready(function () {


    get_user(get_cookie("smarc_id"))
    change_line_id()
    look_data_btn()
    // var user_name = get_unescape_Cookie("user_name")
    var pictureUrl = get_unescape_Cookie("pictureUrl")

    if (pictureUrl != 'undefined') {
        $('.user_info .user img').attr("src", pictureUrl);
    } else {
        $('.user_info .user img').attr("src", "../img/user_img.png");
    }

    $(".menu").find("i").css("color", "#bbb") //先重製
    $(".menu").find("p").css("color", "#bbb")
    $(".menu").find("i").eq(0).css("color", "#1abc9c") // 再換色
    $(".menu").find("p").eq(0).css("color", "#1abc9c")
    $(".menu").find("a").eq(0).css("text-shadow", "0px 0px 30px #fff")

    $('.refresh').on('click', function (e) {
        get_exesummary_oneday()
        get_exesummary_oneweek()
        $('.refresh i').addClass("animation");
        setTimeout(function () {
            $('.refresh i').removeClass("animation");
        }, 1000)
    })

    $('.invite_friend').on('click', function (e) {
        share()
    })

    // -----------------------------------------------
    // alert(document.cookie)
    get_exesummary_oneday()
    get_exesummary_oneweek()
    get_line_id()
    click_time()
});

//----------------------------------------------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
function get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function delete_cookie(name) {
    if (get_cookie(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

function get_unescape_Cookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
};

function getWeekStartDate() {
    var now = new Date(); //當前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
    var nowDay = now.getDate(); //當前日
    var nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
    var nowYear = now.getFullYear(); //當前年
    nowYear += (nowYear < 2000) ? 1900 : 0;

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    var weekStartDate = new Date(
        nowYear, nowMonth, nowDay - nowDayOfWeek
    );
    var y = weekStartDate.getFullYear()
    var m = weekStartDate.getMonth() + 1
    var d = weekStartDate.getDate()
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0

    return y + '-' + m + '-' + d
}

function getWeekEndDate() {
    var now = new Date(); //當前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
    var nowDay = now.getDate(); //當前日
    var nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
    var nowYear = now.getFullYear(); //當前年
    nowYear += (nowYear < 2000) ? 1900 : 0;

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    var weekEndDate = new Date(
        nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)
    );

    var y = weekEndDate.getFullYear()
    var m = weekEndDate.getMonth() + 1
    var d = weekEndDate.getDate()
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0

    return y + '-' + m + '-' + d
}

function getDateBetween(start, end) {
    var result = [];
    //使用传入参数的时间
    var startTime = new Date(start);
    var endTime = new Date(end);
    while (endTime - startTime >= 0) {
        let year = startTime.getFullYear();
        let month = startTime.getMonth();
        month = month < 9 ? '0' + (month + 1) : month + 1;
        let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
        //加入数组
        result.push(year + "-" + month + "-" + day);
        //更新日期
        startTime.setDate(startTime.getDate() + 1);
    }
    return result;
}
// ------------------------------------------------


function get_user(smarc_id) {
    var smarc_id_exist = false
    var smarc_name = ""
    $.ajax({
        type: 'POST',
        url: path + "get-user.php",
        async: false,
        data: {
            smarc_id: smarc_id,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            var data = JSON.parse(e[0])
            // alert(data.code);
            if (data.code == 500) {
                // console.log(data.data)
                smarc_id_exist = true
                smarc_name = data.data.name
                $('.user_info .user h3').html(data.data.name + ' &nbsp;<i class="fas fa-edit"></i>')
            } else {
                // Toast.fire({
                //     icon: 'error',
                //     title: '查無此ID !'
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'error !!!'
            })
        }
    });
    if (smarc_id_exist) {
        return smarc_name
    } else {
        return smarc_id_exist
    }
}

function get_exesummary_oneday() {
    var today = new Date()
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate()
    var model = "all_models"
    var smarc_id = get_cookie("smarc_id")

    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0

    var from_date = y + "-" + m + "-" + d
    var to_date = y + "-" + m + "-" + d

    // var smarc_id = "1"
    // var from_date = "2021-04-01"
    // var to_date = "2021-04-30"

    // console.log(y + "-" + m + "-" + d)

    $.ajax({
        type: 'POST',
        url: path + "get_exesummary.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            selected_model: model,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                $('.grade p').html('<i class="fas fa-question"></i>')
                $('.quality p').html('<i class="fas fa-question"></i>')
                $('.time p').html('<i class="fas fa-question"></i>')
            } else {
                var data = JSON.parse(e[0])
                score = data.overall.pie_score
                time = data.overall.total_duration / 60
                if (score >= 80) {
                    $('.grade p').html('Perfect')
                } else if (score >= 60) {
                    $('.grade p').html('Good')
                } else {
                    $('.grade p').html('Pool')
                }
                // console.log(time)
                $('.quality p').html(score)
                $('.time p').html(Math.round(time))

            }
        },

        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'Error !!!'
            })
        }
    });
}


function get_exesummary_oneweek() {
    var api_get_data = []
    var model = "all_models"
    var smarc_id = get_cookie("smarc_id")
    var from_date = getWeekStartDate()
    var to_date = getWeekEndDate()

    // var smarc_id = "1"
    // var from_date = "2021-04-22"
    // var to_date = "2021-04-22"

    // console.log(from_date)
    // console.log(to_date)

    $.ajax({
        type: 'POST',
        url: path + "get_exesummary.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            selected_model: model,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                var chart_data = [0, 0, 0, 0, 0, 0, 0]
                Draw_chart_home(chart_data)
            } else {
                var data = JSON.parse(e[0])
                // console.log(data.daily)
                // console.log(Object.keys(data.daily).length)

                for (var i = 0; i < Object.keys(data.daily).length; i++) {
                    // console.log(Object.keys(data.daily)[i])
                    // console.log(Object.getOwnPropertyDescriptor(data.daily, '2021-03-22'))
                    score = Object.getOwnPropertyDescriptor(data.daily, Object.keys(data.daily)[i]).value.pie_score
                    api_get_data.push(score)
                }
                console.log(api_get_data.reverse())
                console.log(Object.keys(data.daily).reverse())

                var all_week_date = getDateBetween(from_date, to_date)
                var chart_data = [0, 0, 0, 0, 0, 0, 0]
                for (var k = 0; k < Object.keys(data.daily).length; k++) {
                    for (var j = 0; j < 7; j++) {
                        if (Object.keys(data.daily).reverse()[k] == all_week_date[j]) {
                            chart_data[j] = api_get_data[k]
                        }
                    }
                }
                // console.log(chart_data)
                Draw_chart_home(chart_data)

            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'Error !!!'
            })
        }
    });
}


function change_line_id() {
    let timer = null
    let startTime = ''
    let endTime = ''

    $('.user i').on('touchstart', function (e) {
        startTime = +new Date()
        timer = setTimeout(function () {
            let name = ""
            Swal.fire({
                title: '切換帳號',
                text: "請輸入 Smarc ID",
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonText: '查詢',
                showLoaderOnConfirm: true,
                preConfirm: (id) => {
                    if (get_user(id) == false) {
                        Swal.showValidationMessage(
                            `查無此id`
                        )
                    } else {
                        name = get_user(id)
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '確定要變更用戶為 ↓',
                        html: `${name}`,
                        showCancelButton: true,
                        confirmButtonText: '確定',
                        cancelButtonText: "取消",
                    }).then((result2) => {
                        if (result2.isConfirmed) {
                            delete_cookie("smarc_id")
                            document.cookie = "smarc_id=" + result.value + "; path=/;";

                            setTimeout(function () {
                                location.replace("../home/index.html")
                            }, 500)

                        } else {
                            location.replace("../home/index.html")
                        }
                    })
                } else {
                    location.replace("../home/index.html")
                }
            })
        }, 5000)
    });

    $('.user i').on('touchend', function (e) {
        endTime = +new Date()
        clearTimeout(timer)
        if (endTime - startTime < 700) {
            // console.log("請長按2秒")
        }
    });

}


function get_line_id() {
    let timer = null
    let startTime = ''
    let endTime = ''

    $('.refresh').on('touchstart', function (e) {
        startTime = +new Date()
        timer = setTimeout(function () {
            Swal.fire({
                title: '會員編號',
                html: get_cookie("user_id"),
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: '點我複製',
                cancelButtonText: '取消',
            }).then((result) => {
                if (result.value) {
                    var a = document.createElement('input')
                    document.body.appendChild(a)
                    a.value = get_cookie("user_id")
                    a.select()
                    document.execCommand('copy')
                    document.body.removeChild(a)
                    // https://tools.wingzero.tw/article/sn/116
                }
            })
        }, 5000)
    });

    $('.refresh').on('touchend', function (e) {
        endTime = +new Date()
        clearTimeout(timer)
        if (endTime - startTime < 700) {
            // console.log("請長按2秒")
        }
    });

}




function Draw_chart_home(data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chartData = {
        labels: ['日', '一', '二', '三', '四', '五', '六', ''],
        datasets: [{
            lineTension: 0.3,
            data: data,
            backgroundColor: '#1abc9c',
            borderColor: '#ddd',
        }]
    };
    var opt = {
        title: {
            display: true,
            // text: '本週趨勢',
            fontColor: 'white',
            fontSize: 16,
            padding: 0,
        },
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                display: false,
                gridLines: {
                    display: false
                },
                afterFit: function (scale) {
                    scale.width = 40 //<-- set value as you wish 
                },
            }],
            xAxes: [{
                ticks: {
                    fontColor: "white",
                    fontStyle: "bold",
                    padding: 10
                },
                gridLines: {
                    display: false
                },
            }]
        },
        plugins: {
            datalabels: {
                borderRadius: 4,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: '#1abc9c',
                color: 'white',
                font: {
                    weight: 'bold'
                },
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
    };
    var myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: opt,
    });

}



function Draw_chart_time_pie(data, time) {
    get_time_chart(time)

    var ctx = document.getElementById('myChart_time_pie').getContext('2d');
    var chartData = {
        labels: ['已完成', '未完成'],
        datasets: [{
            data: data,
            backgroundColor: [
                '#1abc9c',
                'rgba(220, 220, 220,.5)',
                'rgb(255, 205, 120)',
            ],
            borderColor: ['transparent', 'transparent']
        }]
    };
    var opt = {
        title: {
            // display: true,
            // // fontSize: 16,
            // fontColor: '#fff',
            // text: '目標 30',
        },

        tooltips: {
            enabled: false
            // callbacks: {
            //     // label: (tooltipItems, data) => {
            //     //     return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' min';
            //     // }
            // }
        },
        legend: {
            display: false
            // position: 'bottom',
            // labels: {
            //     fontColor: '#fff',
            //     usePointStyle: true,
            //     fontSize: 8
            // }
        },
        scales: {
        },
        plugins: {
            datalabels: {
                // borderRadius: 4,
                borderColor: null,
                borderWidth: 0,
                display: false,
                // backgroundColor: '#1abc9c',
                color: 'transpart',
                font: {
                    weight: '900'
                },
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        cutoutPercentage: 70
    };
    var myChart_time_doughnut = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: opt,
    });
}


function Draw_chart_time_bar(data) {
    var ctx = document.getElementById('myChart_time_bar').getContext('2d');
    var chartData = {
        labels: [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        datasets: [{
            data: data,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(174,77,154)',
                'rgb(255, 205, 120)',
                'rgb(55,126,184)',
                'rgb(102,166,30)',
                'rgb(152,78,163)',
                'rgb(0,210,213)',
                'rgb(255,127,0)',
                'rgb(127,128,205)',
                'rgb(179,233,0)',
                'rgb(196,46,96)',
                'rgb(166,86,40)',
                'rgb(247,129,191)',
                'rgb(141,211,199)',
                'rgb(190,86,218)',
                'rgb(251,128,114)',
                'rgb(128,177,211)',
                'rgb(253,180,98)',
                'rgb(252,205,229)',
                'rgb(188,128,189)',
                'rgb(255,237,111)',
                'rgb(217,95,2)',
                'rgb(27,158,119)',
                'rgb(207,140,0 )',

            ],
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
        }]
    };
    var opt = {
        title: {
            display: true,
            fontSize: 16,
            fontColor: '#fff',
        },
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                label: (tooltipItems, data) => {
                    return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' min';
                }
            },
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    display: false,
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "#aaa",
                    fontSize: 8,
                }
            }]
        },
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold'
                },
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
    };
    var myChart_time_bar = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: opt,
    });
}




function get_time_chart(time) {
    Swal.fire({
        html:
            `<div>
            <canvas id="myChart_time_pie" width="400" height="200">
            </canvas>
            <div class='total_time'><p>` + time + `</p><p>分鐘</p></div>
        </div>
        <div>
            <canvas id="myChart_time_bar" width="400" height="200"></canvas>
        </div>
        `,
        showCloseButton: true,
        customClass: 'swal-height',
        background: 'url(../img/bgc.png)',
        showConfirmButton: false,
    })
    $('.total_time').css('opacity', '0')
    setTimeout(function () { //
        h_pie = $('#myChart_time_pie').height()
        h_txt = $('.total_time').height()
        h = -h_pie / 2 - 55.2 / 2
        // console.log(h_pie)
        // console.log(h_txt)
        // console.log(h)
        $('.total_time').css('top', h + 'px')
        $('.total_time').css('opacity', '1')
    }, 600)
}


function click_time() {
    $('.time').on('touchstart', function (e) {
        startTime = +new Date()
        timer = setTimeout(function () {
            get_exedata_time()
        }, 500)



    });

    $('.time').on('touchend', function (e) {
        endTime = +new Date()
        clearTimeout(timer)
        if (endTime - startTime < 700) {
            // console.log("請長按2秒")
        }
    });
}

function get_exedata_time() {
    var smarc_id = get_cookie("smarc_id")
    var today = new Date(); //今天

    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate()

    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0

    var from_date = y + "-" + m + "-" + d
    var to_date = y + "-" + m + "-" + d

    // var smarc_id = "1"
    // var from_date = "2021-04-22"
    // var to_date = "2021-04-22"


    $.ajax({
        type: 'POST',
        url: path + "get_exedata.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            // console.log(e[0])

            if (e[0].length > 0) {
                var data_arr = e[0]
                var duration_sum = 0
                var time_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                // alert(data_arr.length)
                for (var i = 0; i < data_arr.length; i++) {
                    data = JSON.parse(data_arr[i])
                    // console.log(data)
                    duration_sum += data.duration

                    // ---------------------------------
                    // console.log(data.finish_datetime)
                    var this_time = new Date(data.finish_datetime.replace(' ', 'T')); //IOS系統 在Date的定義不同
                    //https://stackoverflow.com/questions/13363673/javascript-date-is-invalid-on-ios


                    time_arr[this_time.getHours()] += data.duration / 60
                }
                for (var j = 0; j < time_arr.length; j++) {
                    time_arr[j] = Math.round(time_arr[j])
                }

                duration_sum = Math.round(duration_sum / 60)
                // console.log(duration_sum)

                if (duration_sum >= 30) {
                    pie_data = [duration_sum]
                    Draw_chart_time_pie(pie_data, duration_sum)
                } else {
                    pie_data = [duration_sum, 30 - duration_sum]
                    Draw_chart_time_pie(pie_data, duration_sum)
                }
                // console.log(pie_data)

                Draw_chart_time_bar(time_arr)
            } else {
                var time_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                Draw_chart_time_pie([0, 30], 0)
                Draw_chart_time_bar(time_arr)
            }


        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'Error !!!'
            })
        }
    });
}


$(document).on('click', '.user h3 i', function (e) {
    location.replace("../edit_member/index.html")
});





function share() {
    liff.init({
        liffId: liffID
    }).then(function () {
        if (liff.isApiAvailable('shareTargetPicker')) {
            liff.shareTargetPicker([
                {
                    "type": "flex",
                    "altText": "歡迎加入會員",
                    "contents": {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "亞健康促進中心",
                                    "weight": "bold",
                                    "size": "lg",
                                    "margin": "md",
                                    "align": "center"
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "margin": "none",
                                    "spacing": "xs",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "uri",
                                                "label": "加入會員",
                                                "uri": "https://line.me/R/ti/p/123456789"
                                            },
                                            "style": "primary",
                                            "margin": "xl"
                                        }
                                    ]
                                }
                            ]
                        },
                        "size": "kilo",
                        "styles": {
                            "footer": {
                                "separator": true
                            }
                        }
                    }
                }
            ])
                .then(function (res) {
                    if (res) {
                        // succeeded in sending a message through TargetPicker
                        console.log(`[${res.status}] Message sent!`)
                    } else {
                        const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
                        if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
                            // LINE 10.3.0 - 10.10.0
                            // Old LINE will access here regardless of user's action
                            console.log('TargetPicker was opened at least. Whether succeeded to send message is unclear')
                        } else {
                            // LINE 10.11.0 -
                            // sending message canceled
                            console.log('TargetPicker was closed!')
                        }
                    }
                }).catch(function (error) {
                    // something went wrong before sending a message
                    console.log('something wrong happen')
                })
        }
    })


}



function look_data() {
    // let today = new Date()
    // let y = today.getFullYear()
    // let m = today.getMonth() + 1
    // let d = today.getDate()
    // let hh = today.getHours()
    // let mm = today.getMinutes()
    // let ss = today.getSeconds()

    // m = ('0' + m).substr(-2); //月份不足補0
    // d = ('0' + d).substr(-2); //日期不足補0

    // let show_date = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss

    liff.init({
        liffId: liffID
    }).then(function () {
        if (liff.isApiAvailable('shareTargetPicker')) {
            liff.shareTargetPicker([
                {
                    "type": "flex",
                    "altText": "查看運動資料",
                    "contents": {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "亞健康促進中心",
                                    "weight": "bold",
                                    "size": "lg",
                                    "margin": "md",
                                    "align": "center"
                                },
                                {
                                    "type": "separator",
                                    "margin": "md"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "查看資料",
                                        "uri": "https://liff.line.me/123456789"
                                    },
                                    "style": "primary",
                                    "margin": "md"
                                }
                            ]
                        },
                        "size": "kilo",
                        "styles": {
                            "footer": {
                                "separator": true
                            }
                        }
                    }
                }
            ])
                .then(function (res) {
                    if (res) {
                        // succeeded in sending a message through TargetPicker
                        console.log(`[${res.status}] Message sent!`)
                    } else {
                        const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
                        if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
                            // LINE 10.3.0 - 10.10.0
                            // Old LINE will access here regardless of user's action
                            console.log('TargetPicker was opened at least. Whether succeeded to send message is unclear')
                        } else {
                            // LINE 10.11.0 -
                            // sending message canceled
                            console.log('TargetPicker was closed!')
                        }
                    }
                }).catch(function (error) {
                    // something went wrong before sending a message
                    console.log('something wrong happen')
                })
        }
    })


}



function look_data_btn() {
    let timer = null
    let startTime = ''
    let endTime = ''

    $('.invite_friend').on('touchstart', function (e) {
        startTime = +new Date()
        timer = setTimeout(function () {
            look_data()
        }, 3000)
    });

    $('.invite_friend').on('touchend', function (e) {
        endTime = +new Date()
        clearTimeout(timer)
        if (endTime - startTime < 700) {
            // console.log("請長按3秒")
        }
    });

}