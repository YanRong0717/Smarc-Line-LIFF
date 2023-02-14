// const { default: Swal } = require("sweetalert2");

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

function DateDiff(sDate1, sDate2) { // sDate1 和 sDate2 是 2016-06-18 格式
    var oDate1 = new Date(sDate1);
    var oDate2 = new Date(sDate2);
    var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒數轉換為天數
    return iDays;
};

// ------------------------------------------------
$(document).ready(function () {

    $(".menu").find("i").css("color", "#bbb") //先重製
    $(".menu").find("p").css("color", "#bbb")
    $(".menu").find("i").eq(1).css("color", "#1abc9c") // 再換色
    $(".menu").find("p").eq(1).css("color", "#1abc9c")
    $(".menu").find("a").eq(1).css("text-shadow", "0px 0px 30px #fff")

    // -----------------------
    $("#from").val(last_year())
    $("#to").val(today())

    date_from = $(".date #from").val()
    date_to = $(".date #to").val()


});
function today() {
    var today = new Date(); //今天
    var y = today.getFullYear()
    var m = today.getMonth() + 1
    var d = today.getDate()
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0
    return y + "-" + m + "-" + d
}
function last_year() {
    var today = new Date(); //今天
    var y = today.getFullYear() - 1
    var m = today.getMonth() + 1
    var d = today.getDate()
    m = ('0' + m).substr(-2); //月份不足補0
    d = ('0' + d).substr(-2); //日期不足補0
    return y + "-" + m + "-" + d
}

$(document).on('click', '.trend_btn', function (e) {
    $(".trend_btn").prop('disabled', true)
    var check_index = []
    var count = 0
    $('.item').each(function (index, value) {
        // console.log(index)
        if ($('.item input').eq(index).prop('checked') == true) {
            check_index.push(1)
            count++
        } else {
            check_index.push(0)
        }
    })
    // console.log(check_index)
    if (count >= 2) {
        get_trend(check_index)

    } else {
        Toast.fire({
            icon: 'warning',
            title: '請選擇兩筆以上',
            timer: 3000,
            timerProgressBar: true,
        })

        $(".trend_btn").prop('disabled', false)
    }
});




function get_all_enote() { // 查詢該期間內所有的評估紀錄

    var smarc_id = get_cookie('smarc_id')
    // var smarc_id = 1
    var from_date = $("#from").val()
    var to_date = $("#to").val()
    var type = 1
    if (from_date == "" || to_date == "") {
        Toast.fire({
            icon: 'warning',
            title: '請選擇日期',
            timer: 3000,
            timerProgressBar: true,
        })
    }
    $.ajax({
        type: 'POST',
        url: path + "get-enote.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            type: type,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                // console.log("Nodata")
                Toast.fire({
                    icon: 'warning',
                    title: '查無資料',
                    timer: 3000,
                    timerProgressBar: true,
                })
            } else {
                a = ''

                data_length = e[0].length

                for (var i = data_length - 1; i >= 0; i--) {
                    a += `<div class="item" id="item` + i + `"><input type="checkbox">
                <div class="txt">
                    <label for="item`+ i + `"> ` + e[0][i].datetime + ` </label>
                    <i class="fas fa-chart-line"></i>
                </div></div>`
                    // date_arr.push(e[0][i].datetime)
                    // console.log(e[0][i].datetime)
                }
                $('.result').html('')
                $('.result').append(a)
                $(".search_btn").prop('disabled', false)

                Toast.fire({
                    icon: 'success',
                    title: '共有 ' + data_length + '筆資料',
                    timer: 1500,
                    timerProgressBar: true,
                })
            }
        },
        error: function () {
            $(".search_btn").prop('disabled', false)
            Swal.fire({
                icon: 'error',
                title: 'error !!',
            })
        }
    });
}

$(document).on('click', '.item i', function (e) {
    $(".item i").prop('disabled', true)
    // console.log($('.item i').index(this)) //https://stackoverflow.com/questions/5545283/get-index-of-clicked-element-in-collection-with-jquery
    index = $('.item i').index(this)
    get_this_enote(index)
    $(".item i").prop('disabled', false)
});

$(document).on('click', '.search_btn', function (e) {
    $(".search_btn").prop('disabled', true)
    get_all_enote()
});

function get_trend(index) {
    var smarc_id = get_cookie('smarc_id')
    // var smarc_id = 1
    var from_date = $("#from").val()
    var to_date = $("#to").val()
    var type = 1

    $.ajax({
        type: 'POST',
        url: path + "get-enote.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            type: type,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                // console.log("Nodata")
                Toast.fire({
                    icon: 'warning',
                    title: '查無資料',
                })
            } else {
                var date_arr = []
                var core_arr = []
                var lower_arr = []
                var total_arr = []
                var upper_arr = []

                data_length = e[0].length
                // console.log(data_length)

                console.log(e[0])
                // console.log(e[0][0].enote)
                // console.log("====")
                for (var j = 0; j < data_length; j++) {
                    date_arr.push(e[0][j].datetime)
                    core_arr.push(e[0][j].enote.core)
                    lower_arr.push(e[0][j].enote.lower_extremity)
                    total_arr.push(e[0][j].enote.total)
                    upper_arr.push(e[0][j].enote.upper_extremity)
                }
                var total = []
                var upper = []
                var core = []
                var lower = []
                var date = []
                for (var k = data_length - 1; k >= 0; k--) {
                    if (index[k] == 1) {
                        total.push(total_arr[k])
                        upper.push(upper_arr[k].sub_total)
                        core.push(core_arr[k].sub_total)
                        lower.push(lower_arr[k].sub_total)
                        var this_data = new Date(date_arr[k].replace(' ', 'T')); //IOS系統 在Date的定義不同
                        var this_date = this_data.getFullYear() + '-' + (this_data.getMonth() + 1) + '-' + this_data.getDate()
                        date.push(this_date)

                    }
                }
                // console.log(total)
                // console.log(upper)
                // console.log(core)
                // console.log(lower)
                // console.log(date)

                Draw_chart_trend(date.reverse(), [total, upper, core, lower].reverse())


            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'error !!',
            })
        }
    });
}


function get_this_enote(index) { // 點選單一筆查看評估報表
    var smarc_id = get_cookie('smarc_id')
    // var smarc_id = 1
    var from_date = $("#from").val()
    var to_date = $("#to").val()
    var type = 1

    $.ajax({
        type: 'POST',
        url: path + "get-enote.php",
        data: {
            smarc_id: smarc_id,
            from_date: from_date,
            to_date: to_date,
            type: type,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        dataType: 'json',
        success: function (e) {
            if (e == "NoData") {
                // console.log("Nodata")
                Toast.fire({
                    icon: 'warning',
                    title: '查無資料',
                })
            } else {
                // var date_arr = []
                var core_arr = []
                var lower_arr = []
                var total_arr = []
                var upper_arr = []

                data_length = e[0].length
                // console.log(data_length)
                // console.log(date_arr)
                // console.log(e[0][0].enote)
                // console.log("====")
                for (var j = 0; j < data_length; j++) {
                    core_arr.push(e[0][j].enote.core)
                    lower_arr.push(e[0][j].enote.lower_extremity)
                    total_arr.push(e[0][j].enote.total)
                    upper_arr.push(e[0][j].enote.upper_extremity)
                }
                // console.log(upper_arr[0]) //包含sub_total
                // console.log(core_arr[0])
                // console.log(lower_arr[0])

                var core = [] //不包含sub_total 且按照我要的順序排
                var upper = []
                var lower = []

                core.push(core_arr[index].accuracy)
                core.push(core_arr[index].coordination)
                core.push(core_arr[index].strength)
                core.push(core_arr[index].endurance)
                core.push(core_arr[index].rom)
                // ----------------
                upper.push(upper_arr[index].accuracy)
                upper.push(upper_arr[index].coordination)
                upper.push(upper_arr[index].strength)
                upper.push(upper_arr[index].endurance)
                upper.push(upper_arr[index].rom)
                // -----------------
                lower.push(lower_arr[index].accuracy)
                lower.push(lower_arr[index].coordination)
                lower.push(lower_arr[index].strength)
                lower.push(lower_arr[index].endurance)
                lower.push(lower_arr[index].rom)

                // console.log(core)
                // console.log(upper)
                // console.log(lower)
                var data = [upper, core, lower]
                Draw_chart_Radar(data)
                $('.total h1').html(total_arr[index])
                $('.upper h2').html(upper_arr[index].sub_total)
                $('.core h2').html(core_arr[index].sub_total)
                $('.lower h2').html(lower_arr[index].sub_total)


            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'error !!',
            })
        }
    });
}

function get_trend_chart() {
    Swal.fire({
        html:
            `<div>
            <canvas id="myChart_trend" width="400" height="400"></canvas>
            </div>
        `,
        showCloseButton: true,
        customClass: 'swal-height',
        background: 'url(../img/bgc.png)',
        showConfirmButton: false,
    })
}

function get_radar_chart() {
    Swal.fire({
        html:
            `<div>
            <canvas id="myChart_radar" width="400" height="300"></canvas>
            </div>
            <div class="score">
            <div class="total">
                <h1></h1>
                <p>綜合評分</p>
            </div>
            <div class="upper">
                <h2></h2>
                <p>上肢</p>
            </div>
            <div class="core">
                <h2></h2>
                <p>核心</p>
            </div>
            <div class="lower">
                <h2></h2>
                <p>下肢</p>
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
    get_radar_chart()
    var ctx = document.getElementById('myChart_radar').getContext('2d');
    var chartData = {
        labels: ['精準度', '      協調性', '         功能性肌力', '功能肌耐力        ', '活動度       '],
        // datasets: [{
        //     data: data,
        //     backgroundColor: '#1abc9c',
        //     borderColor: '#ddd',

        // }]
        datasets: [
            {
                label: "上肢",
                backgroundColor: "rgba(255,214,176,.8)",
                // pointBackgroundColor: "rgba(252,0,62,1)",
                data: data[0],
                // pointRadius: 5,
                // hidden: true,

            },
            {
                label: "核心",
                backgroundColor: "rgba(159,183,229,.8)",
                // pointBackgroundColor: "rgba(255,204,224,1)",
                data: data[1],
                // pointRadius: 5,
                // hidden: true,
            },
            {
                label: "下肢",
                backgroundColor: "rgba(87,204,152,.8)",
                // pointBackgroundColor: "rgba(54,162,235,1)",
                data: data[2],
                // pointRadius: 5,
                // hidden: true,
            },

        ],
        backgroundColor: '#fff'
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
                padding: 15
            },
            onClick: function (e, legendItem) {
                var index = legendItem.datasetIndex;
                var ci = this.chart;
                var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
                // console.log(index)
                // console.log(alreadyHidden)

                ci.data.datasets.forEach(function (e, i) {
                    var meta = ci.getDatasetMeta(i);
                    if (i !== index) {
                        if (!alreadyHidden) {
                            meta.hidden = meta.hidden === null ? !meta.hidden : null;
                        } else if (meta.hidden === null) {
                            meta.hidden = true;
                        }
                    } else if (i === index) {
                        meta.hidden = null;
                    }
                });

                ci.update();
            },
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
                color: 'rgba(200, 200, 200, 0.4)',
                display: true,
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




function Draw_chart_trend(labels, data) {
    get_trend_chart()
    var ctx = document.getElementById('myChart_trend').getContext('2d');
    var chartData = {
        labels: labels,
        // datasets: [{
        //     lineTension: 0.3,
        //     data: data,
        //     backgroundColor: '#1abc9c',
        //     borderColor: '#ddd',
        // }]
        datasets: [
            {
                fill: false,
                lineTension: 0.1,
                label: "綜合表現",
                backgroundColor: "rgba(255,214,176,.75)",
                pointBackgroundColor: "rgba(255,214,176,1)",
                data: data[0],
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                borderColor: "rgba(255,214,176,1)",
            },
            {
                fill: false,
                lineTension: 0.1,
                label: "上肢功能",
                backgroundColor: "rgba(159,183,229,.75)",
                pointBackgroundColor: "rgba(159,183,229,1)",
                data: data[1],
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                borderColor: "rgba(159,183,229,1)",
            },
            {
                fill: false,
                lineTension: 0.1,
                label: "核心功能",
                backgroundColor: "rgba(87,204,152,.75)",
                pointBackgroundColor: "rgba(87,204,152,1)",
                data: data[2],
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                borderColor: "rgba(87,204,152,1)",
            },
            {
                fill: false,
                lineTension: 0.1,
                label: "下肢功能",
                backgroundColor: "rgba(255,107,107,.75)",
                pointBackgroundColor: "rgba(135,90,152,1)",
                data: data[3],
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                borderColor: "rgba(135,90,152,1)",
            },

        ],
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
                padding: 15
            }
        },
        scales: {
            yAxes: [{
                display: true,

                gridLines: {
                    display: true,
                    color: "rgba(220,220,220,.5)"
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
                    display: true
                },
            }]
        },
        plugins: {
            datalabels: {
                display: false,
                borderRadius: 4,
                borderColor: 'white',
                borderWidth: 2,
                // backgroundColor: ['rgba(255,214,176,1)', 'rgba(159,183,229,1)', 'rgba(87,204,152,1)', 'rgba(135,90,152,1)'],
                color: 'white',
                font: {
                    weight: 'normal'
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
    $(".trend_btn").prop('disabled', false)
}

$(document).on('change', '.date input[type=date]', function (e) {
    // console.log($(".week_trend  #from").val())
    // console.log($(".week_trend  #to").val())
    if (DateDiff($(".date #to").val(), $(".date #from").val()) > 365) {
        Toast.fire({
            icon: 'warning',
            title: '搜尋範圍不得超過１年 !'
        })
        $(".date #from").val(date_from)
        $(".date #to").val(date_to)
    }
    if ($(".date #from").val() > $(".date #to").val()) {
        Toast.fire({
            icon: 'warning',
            title: '請輸入正確日期順序 !'
        })

        $(".date #from").val(date_from)
        $(".date #to").val(date_to)
    } else {
        trend_from = $(".date #from").val()
        trend_to = $(".date #to").val()
    }
})