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

// -----------------------------------------------------------------------------------------
$(document).ready(function () {

    $(".menu").find("i").css("color", "#bbb") //先重製
    $(".menu").find("p").css("color", "#bbb")
    $(".menu").find("i").eq(4).css("color", "#1abc9c") // 再換色
    $(".menu").find("p").eq(4).css("color", "#1abc9c")
    $(".menu").find("a").eq(4).css("text-shadow", "0px 0px 30px #fff")


    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);


    var month = new Array()
    month[0] = "January"
    month[1] = "February"
    month[2] = "March"
    month[3] = "April"
    month[4] = "May"
    month[5] = "June"
    month[6] = "July"
    month[7] = "August"
    month[8] = "September"
    month[9] = "October"
    month[10] = "November"
    month[11] = "December"

    var d = new Date()
    var n = month[d.getMonth()]
    var title = d.getMonth() + 1 + "月  " + n
    $('.title').html(title)

    var k = new Date(d.getYear(), d.getMonth() + 1, 0)
    last_day = k.getDate()

    data = ''
    for (var i = 1; i <= last_day; i++) {
        // console.log(i)
        if (i % 7 == 1) {
            data += `<tr class="week">` +
                `<td class="day" tabindex="0"><span class="day-number"> ` + i + `</span>`
        }
        else if (i % 7 != 0) {
            data += `<td class="day" tabindex="0"><span class="day-number"> ` + i + `</span>`
        }
        else if (i % 7 == 0) {
            data += `<td class="day" tabindex="0"><span class="day-number"> ` + i + `</span></tr>`
        }

    }
    // console.log(data)
    $('tbody').append(data)



    // -------------------------------------------------------------------
    get_exesummary_onemonth()
});






function get_exesummary_onemonth() {
    var model = "all_models"
    var smarc_id = get_cookie("smarc_id")

    var startdate = new Date();
    startdate.setDate(1);//設定日期為第一天
    var enddate = new Date();//取當日
    enddate.setMonth(enddate.getMonth() + 1);//將月份移至下個月份
    enddate.setDate(1);//設定為下個月份的第一天
    enddate.setDate(enddate.getDate() - 1);//將日期-1為當月的最後一天

    var from_date_y = startdate.getFullYear()
    var from_date_m = startdate.getMonth() + 1
    var from_date_d = startdate.getDate()
    var to_date_y = enddate.getFullYear()
    var to_date_m = enddate.getMonth() + 1
    var to_date_d = enddate.getDate()



    from_date_m = ('0' + from_date_m).substr(-2); //月份不足補0
    from_date_d = ('0' + from_date_d).substr(-2); //日期不足補0
    to_date_m = ('0' + to_date_m).substr(-2); //月份不足補0
    to_date_d = ('0' + to_date_d).substr(-2); //日期不足補0

    var from_date = from_date_y + "-" + from_date_m + "-" + from_date_d
    var to_date = to_date_y + "-" + to_date_m + "-" + to_date_d

    // console.log(from_date)
    // console.log(to_date)

    var d = new Date()
    var k = new Date(d.getYear(), d.getMonth() + 1, 0)
    var last_day = k.getDate()

    // var smarc_id = "1"
    // var from_date = "2021-04-01"
    // var to_date = "2021-04-30"


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
                console.log("Nodata")
            } else {
                var data = JSON.parse(e[0])
                // console.log(data.daily)
                // console.log(Object.keys(data.daily))
                var all_month_date = getDateBetween(from_date, to_date)
                // console.log(all_month_date)
                // console.log(Object.keys(data.daily)[1])
                var check = 30 //檢查每日運動時間有沒有超過這個數
                total_duration = []
                sum_duration = 0
                for (var q = 0; q < Object.keys(data.daily).length; q++) { //建立簽到簿陣列
                    this_duration = Object.getOwnPropertyDescriptor(data.daily, Object.keys(data.daily)[q]).value.total_duration
                    sum_duration += this_duration
                    total_duration.push(Math.round(this_duration / 60))
                }
                sum_duration = Math.round(sum_duration / 60)

                console.log(total_duration)
                console.log(sum_duration)


                var check_in_times = 0

                for (var i = 0; i < Object.keys(data.daily).length; i++) { //找在該月有做過運動的
                    for (var j = 0; j < last_day; j++) {
                        if (Object.keys(data.daily)[i] == all_month_date[j]) {
                            if (total_duration[i] >= check) {
                                check_in_times += 1
                                $('tbody .day').eq(j).addClass('today')
                                $('tbody .day-number').eq(j).html('<i class="fas fa-check"></i>')
                            }
                        }
                    }
                }
                $('.times h3').html(check_in_times + ' 次')
                $('.time h3').html(sum_duration + ' 分鐘')
                console.log()
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



