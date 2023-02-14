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

function today() {
    var today = new Date(); //今天
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate()
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0
    return y + "-" + m + "-" + d
}
function yesterday() {
    var today = new Date(); //今天
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate() - 1
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0
    return y + "-" + m + "-" + d
}
function last_week() {
    var today = new Date(); //今天
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate() - 7
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0
    return y + "-" + m + "-" + d
}
function formatSecToStr(seconds) {
    let daySec = 24 * 60 * 60;
    let hourSec = 60 * 60;
    let minuteSec = 60;
    let dd = Math.floor(seconds / daySec);
    let hh = Math.floor((seconds % daySec) / hourSec);
    let mm = Math.floor((seconds % hourSec) / minuteSec);
    let ss = seconds % minuteSec;
    if (dd > 0) {
        // return dd + "天" + hh + "小時" + mm + "分鐘" + ss + "秒";
        return dd + " 天 " + hh + " 小時 " + mm + " 分鐘";
    } else if (hh > 0) {
        // return hh + "小時" + mm + "分鐘" + ss + "秒";
        return hh + " 小時 " + mm + " 分鐘";
    } else if (mm > 0) {
        return mm + " 分鐘 " + ss + " 秒";
    } else {
        return ss + " 秒";
    }
}



function getYearWeek(date) {
    ymd = date.split("-")
    /*
    date1是當前日期
    date2是當年第一天
    d是當前日期是今年第多少天
    用d + 當前年的第一天的周差距的和在除以7就是本年第几周
    */
    var date1 = new Date(ymd[0], parseInt(ymd[1]) - 1, ymd[2]), date2 = new Date(ymd[0], 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil(
        // (d + ((date2.getDay() + 1) - 1)) / 7
        (d + ((date2.getDay() + 1))) / 7
    );
};

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

// -----------------------------------------------
$(document).on('click', '.week_trend_btn', function (e) {
    // console.log(1111)
    $('.animation').css('right', '-50%')
    $('.summary').css('display', 'none')
    $('.week_trend').css('display', 'flex')
    $('.result').css('display', 'block')
    $('.trend_btn').css('display', 'block')
    // $('.result').show()
    // $('.trend_btn').show()
})
$(document).on('click', '.summary_btn', function (e) {
    // console.log(2222)
    $('.animation').css('right', '0%')
    $('.summary').css('display', 'flex')
    $('.week_trend').css('display', 'none')
    $('.result').css('display', 'none')
    $('.trend_btn').css('display', 'none')
    // $('.result').hide()
    // $('.trend_btn').hide()
})




$(document).ready(function () {
    // alert(get_cookie("userid"))
    // alert(get_cookie("smarc_id"))
    $(".loading-container").css("z-index", 99)
    $(".loading-container").hide()

    $(".menu").find("i").css("color", "#bbb") //先重製
    $(".menu").find("p").css("color", "#bbb")
    $(".menu").find("i").eq(2).css("color", "#1abc9c") // 再換色
    $(".menu").find("p").eq(2).css("color", "#1abc9c")
    $(".menu").find("a").eq(2).css("text-shadow", "0px 0px 30px #fff")
    // --------------------------------
    $(".summary #from").val(today())
    $(".summary #to").val(today())
    $(".week_trend #from").val(last_week())
    $(".week_trend #to").val(today())
    $('.result').hide()

    summary_from = $(".summary #from").val()
    summary_to = $(".summary #to").val()
    trend_from = $(".week_trend #from").val()
    trend_to = $(".week_trend #to").val()

});




$(document).on('click', '#summary_search_btn', function (e) {
    $("#summary_search_btn").prop('disabled', true)
    if ($('.summary #from').val() == "" || $('.summary #to').val() == "") {
        Toast.fire({
            icon: 'warning',
            title: '請輸入日期 !'
        })
        $("#summary_search_btn").prop('disabled', false)
        // console.log(111)
    } else {
        // console.log(222)
        get_exesummary()
        $("#summary_search_btn").prop('disabled', false)
    }

})
$(document).on('click', '#week_trend_search_btn', function (e) {
    $("#week_trend_search_btn").prop('disabled', true)
    if ($('.week_trend #from').val() == "" || $('.week_trend #to').val() == "") {
        Toast.fire({
            icon: 'warning',
            title: '請輸入日期 !'
        })
        $("#week_trend_search_btn").prop('disabled', false)
        // console.log(111)
    } else {
        // console.log(222)
        get_date_week_number()
        $("#week_trend_search_btn").prop('disabled', false)
    }
})

function get_date_week_number() {

    var from = $('.week_trend #from').val()
    var to = $('.week_trend #to').val()
    date_arr = getDateBetween(from, to)
    var week_arr = []
    // console.log(date_arr)
    for (var i = 0; i < date_arr.length; i++) {
        week_arr.push(getYearWeek(date_arr[i]))
    }
    // console.log(week_arr)
    var a = date_arr[0] + " ~ "//預設從第一筆開始
    var a_arr = []
    var str = ""
    var item = 0
    for (var i = 0; i < date_arr.length; i++) {
        if (week_arr[i] != week_arr[i + 1]) {
            a += date_arr[i]
            a_arr.push(a)
            // console.log(a)
            str += `
            <div class="item">
            <div class="txt">
            <label for="item`+ item + `">` + a + `</label>
            <i class="fas fa-chart-line"></i>
            </div>
            
            </div>`
            a = date_arr[i + 1] + " ~ "
            item++
        }
    }
    Toast.fire({
        icon: 'success',
        title: '共有 ' + item + '筆資料',
        timer: 1500,
        timerProgressBar: true,
    })
    $('.result').html("")
    $('.result').html(str)
    $('.result').show()
}

function get_exesummary() {
    var api_get_data = []
    var model = "all_models"
    var smarc_id = get_cookie("smarc_id")
    var from_date = $('.summary #from').val()
    var to_date = $('.summary #to').val()

    // var smarc_id = "1"
    // var from_date = "2021-04-12"
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
                Toast.fire({
                    icon: 'warning',
                    title: '查無資料 !'
                })
                // Draw_chart_home(chart_data)
            } else {
                var data = JSON.parse(e[0])
                var qulity = []
                var duration = []
                var achivement = []
                // console.log(data.overall)
                var models_qulity = data.overall.overall_effectiveness_by_models
                var models_duration = data.overall.total_duration_by_models


                // console.log(models_duration)
                // console.log(models.CS101.average)

                // console.log(Object.keys(models_qulity))
                qulity.push(models_qulity.CS101.average)
                qulity.push(models_qulity.CS102.average)
                qulity.push(models_qulity.CS103.average)
                qulity.push(models_qulity.CS104.average)
                qulity.push(models_qulity.CS105.average)
                qulity.push(models_qulity.CS106.average)
                qulity.push(models_qulity.CS107.average)
                qulity.push(models_qulity.CS108.average)

                duration.push(models_duration.CS101.sum)
                duration.push(models_duration.CS102.sum)
                duration.push(models_duration.CS103.sum)
                duration.push(models_duration.CS104.sum)
                duration.push(models_duration.CS105.sum)
                duration.push(models_duration.CS106.sum)
                duration.push(models_duration.CS107.sum)
                duration.push(models_duration.CS108.sum)



                achivement.push(data.overall.control_achivement)
                achivement.push(data.overall.velocity_achivement)
                achivement.push(data.overall.duration_achivement)
                achivement.push(data.overall.repeat_achivement)
                achivement.push(data.overall.rom_achivement)

                var duration_sum = 0
                for (var i = 0; i < 8; i++) {
                    // console.log(duration[i])
                    duration_sum += duration[i]
                    duration[i] = Math.round(duration[i] / 60 * 10) / 10
                }
                // console.log(formatSecToStr(duration_sum))
                // labels = ['肩胛/上肢 CS101', '上肢/腹背 CS103', '骨盆/腰腹 CS104', '骨盆底/髖 CS106',
                //     '臀髖/膝 CS102', '臀髖 CS105', '膝 CS107', '全身 CS108']
                labels = ["101", "102", "103", "104", "105", "106", "107", "108"]
                // console.log(qulity)
                // console.log(duration)

                get_chart()
                Draw_chart_bar(labels, [qulity, duration])
                Draw_chart_Radar(achivement)

                $('.quality h2').html(data.overall.pie_score + '/100')
                $('.duration h2').html(formatSecToStr(duration_sum))
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



function get_chart() {
    Swal.fire({
        html:
            `<div>
            <canvas id="myChart_bar" width="400" height="200"></canvas>
            </div>
            <div>
            <canvas id="myChart_radar" width="400" height="250"></canvas>
            </div>
            <div class='summary_socre'>
            <div class="quality">
                <h2></h2>
                <p>運動品質</p>
            </div>
            <div class="duration">
                <h2></h2>
                <p>運動時間</p>
            </div>
            </div>
        `,
        showCloseButton: true,
        customClass: 'swal-height',
        background: 'url(../img/bgc.png)',
        showConfirmButton: false,
    })
}


function Draw_chart_Radar(data) {
    var ctx = document.getElementById('myChart_radar').getContext('2d');
    var chartData = {
        labels: ['動作控制能力', '    速度達成率', '    時間達成率', '次數達成率    ', '角度達成率      '],
        // datasets: [{
        //     data: data,
        //     backgroundColor: '#1abc9c',
        //     borderColor: '#ddd',

        // }]
        datasets: [
            {
                label: "動作表現分析",
                backgroundColor: "rgba(255,214,176,1)",
                // pointBackgroundColor: "rgba(252,0,62,1)",
                data: data,
                // pointRadius: 5,
            }

        ],
        // backgroundColor: '#000'
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
            fullWidth: true,
            position: 'bottom',
            labels: {
                fontColor: '#fff',
                boxWidth: 15,
                padding: 15,
            }
        },
        scale: {
            angleLines: {
                lineWidth: 2,
                color: 'rgba(255, 255, 255, 0.4)',
                display: false,

            },
            ticks: {
                beginAtZero: true,
                fontColor: 'transparent', // labels such as 10, 20, etc
                showLabelBackdrop: false, // hide square behind text
                // max: 5,
                min: 0,
                stepSize: 1
            },
            pointLabels: {
                fontColor: 'white' // labels around the edge like 'Running'
            },
            gridLines: {
                color: 'rgba(255, 255, 255, 0.4)',
                display: false,
            },

        },
        plugins: {
            datalabels: {
                borderRadius: 4,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(240,240,240,1)',
                color: '#888',
                font: {
                    weight: 'bold'
                },
            }
        },
    };
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: opt,
    });

}


function Draw_chart_bar(labels, data) {

    var ctx = document.getElementById('myChart_bar').getContext('2d');
    var chartData = {
        labels: labels,
        datasets: [
            {
                label: '運動品質',
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(101,91,124)',
                    'rgb(255, 205, 120)',
                    'rgb(55,126,184)',
                    'rgb(102,166,30)',
                    'rgb(152,78,163)',
                    'rgb(0,210,213)',
                    'rgb(255,127,0)',
                ],
                // pointBackgroundColor: "rgba(252,0,62,1)",
                data: data[0],
                pointRadius: 5,
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,

            }, {
                label: '運動時間',
                backgroundColor: [
                    'rgb(240, 220, 230)',
                    'rgb(101,91,124)',
                    'rgb(255, 205, 120)',
                    'rgb(55,126,184)',
                    'rgb(102,166,30)',
                    'rgb(152,78,163)',
                    'rgb(0,210,213)',
                    'rgb(255,127,0)',
                ],
                // pointBackgroundColor: "rgba(252,0,62,1)",
                data: data[1],
                pointRadius: 5,
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
                hidden: true,

            }
        ],
    };
    var opt = {
        title: {
            display: true,
            fontSize: 16,
            fontColor: '#fff',
        },
        legend: {
            position: 'bottom',
            labels: {
                fontColor: '#fff',
                boxWidth: 15,
                padding: 15
            }
            // display: false
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
                    fontColor: "#fff",
                    fontSize: 12,
                },
            }]
        },
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 16,
                },
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
    };
    var myChart_bar = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: opt,
    });
}









$(document).on('click', '.item i', function (e) {
    $(".item i").prop('disabled', true)
    // console.log($('.item i').index(this)) //https://stackoverflow.com/questions/5545283/get-index-of-clicked-element-in-collection-with-jquery
    index = $('.item i').index(this)
    var date = $('.item label').eq(index).html()
    // console.log(date)
    get_this_summary(date)
    $(".item i").prop('disabled', false)
});



function get_this_summary(date) { // 點選單一筆查看評估報表
    var api_get_data = []
    var smarc_id = get_cookie('smarc_id')
    // var smarc_id = 1
    // var from_date = $("#from").val()
    // var to_date = $("#to").val()
    var model = "all_models"

    date = date.replace('~', '')
    date_from_and_to = date.split(' ') // 0: from , 2 : to
    console.log(date_from_and_to)
    $.ajax({
        type: 'POST',
        url: path + "get_exesummary.php",
        data: {
            smarc_id: smarc_id,
            from_date: date_from_and_to[0],
            to_date: date_from_and_to[2],
            selected_model: model,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                Toast.fire({
                    icon: 'warning',
                    title: '查無資料 !'
                })
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

                Draw_chart_this_summary(Object.keys(data.daily).reverse(), api_get_data)

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


function get_time_chart() {
    Swal.fire({
        html:
            `<div>
            <canvas id="myChart" width="400" height="400">
            </canvas>
        </div>
        `,
        showCloseButton: true,
        customClass: 'swal-height',
        background: 'url(../img/bgc.png)',
        showConfirmButton: false,
    })
}

function Draw_chart_this_summary(labels, data) {
    get_time_chart()
    var ctx = document.getElementById('myChart').getContext('2d');
    var chartData = {
        labels: labels,
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

$(document).on('change', '.summary input[type=date]', function (e) {
    // console.log($(".summary  #from").val())
    // console.log($(".summary  #to").val())
    if ($(".summary #from").val() > $(".summary #to").val()) {
        Toast.fire({
            icon: 'warning',
            title: '請輸入正確日期順序 !'
        })
        $(".summary #from").val(summary_from)
        $(".summary #to").val(summary_to)
    } else {
        summary_from = $(".summary #from").val()
        summary_to = $(".summary #to").val()
    }
})


$(document).on('change', '.week_trend input[type=date]', function (e) {
    // console.log($(".week_trend  #from").val())
    // console.log($(".week_trend  #to").val())
    if ($(".week_trend #from").val() > $(".week_trend #to").val()) {
        Toast.fire({
            icon: 'warning',
            title: '請輸入正確日期順序 !'
        })

        $(".week_trend #from").val(trend_from)
        $(".week_trend #to").val(trend_to)
    } else {
        trend_from = $(".trend #from").val()
        trend_to = $(".trend #to").val()
    }
})