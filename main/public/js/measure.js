var type;
$(document).ready(function () {
    $(".blood_glucose").hide()
    $(".body_temp").hide()
    $(".height").hide()
    $(".weight").hide()
    type = 1;

    $(".menu").find("i").css("color", "#bbb") //先重製
    $(".menu").find("p").css("color", "#bbb")
    $(".menu").find("i").eq(3).css("color", "#1abc9c") // 再換色
    $(".menu").find("p").eq(3).css("color", "#1abc9c")
    $(".menu").find("a").eq(3).css("text-shadow", "0px 0px 30px #fff")
})



$(document).on('click', '.item', function (e) {
    console.log($(this).find("p").html())
    var a = $(this).find("p").html()
    if (a == "血壓") {
        type = 1;
        $(".blood_pressure").show()
        $(".blood_glucose,.body_temp,.height,.weight").hide()
    } else if (a == "血糖") {
        type = 2;
        $(".blood_glucose").show()
        $(".blood_pressure,.body_temp,.height,.weight").hide()
    }
    else if (a == "體溫") {
        type = 3;
        $(".body_temp").show()
        $(".blood_glucose,.blood_pressure,.height,.weight").hide()
    }
    else if (a == "身高") {
        type = 4;
        $(".height").show()
        $(".blood_glucose,.blood_pressure,.body_temp,.weight").hide()
    }
    else if (a == "體重") {
        type = 5;
        $(".weight").show()
        $(".blood_glucose,.blood_pressure,.body_temp,.height").hide()
    }

})



$(document).on('click', '#measure_btn', function (e) {
    $("#measure_btn").attr("disabled", true);
    var blood_pressure_1 = $(".measure_data input[type=number]").eq(0).val()
    var blood_pressure_2 = $(".measure_data input[type=number]").eq(1).val()
    var blood_pressure_3 = $(".measure_data input[type=number]").eq(2).val()
    var blood_glucose_1 = $(".measure_data input[type=number]").eq(3).val()
    var blood_glucose_2 = $(".measure_data input[type=number]").eq(4).val()
    var body_temp = $(".measure_data input[type=number]").eq(5).val()
    var height = $(".measure_data input[type=number]").eq(6).val()
    var weight = $(".measure_data input[type=number]").eq(7).val()


    //---------------get current time--------------
    var qq = new Date();
    var month = ((qq.getMonth() + 1).toString()).padStart(2, "0")

    var date = qq.getFullYear() + "-" + month + "-" + qq.getDate() + "T" + qq.getHours() + ":" + qq.getMinutes() + ":" + qq.getSeconds() + "Z"
    var date2 = qq.getFullYear() + "-" + month + "-" + qq.getDate() + "@" + qq.getHours() + ":" + qq.getMinutes() + ":" + qq.getSeconds()
    // console.log(date)
    // --------------get current time--------------



    if (type == 1 && blood_pressure_1 != "" && blood_pressure_2 != "" && blood_pressure_3 != "") {
        // alert(blood_pressure_1)
        // alert(blood_pressure_2)
        // alert(blood_pressure_3)
        // alert(get_cookie("smarc_id"))

        $.ajax({
            type: 'POST',
            url: path + "/add_blood_pressure.php",
            data: {
                smarc_id: get_cookie("smarc_id"),
                date: date,
                blood_pressure_systolic: blood_pressure_1,
                blood_pressure_diastolic: blood_pressure_2,
                blood_pressure_pulse: blood_pressure_3,
                api_key: get_cookie("api_key"),
                ip: get_cookie("ip"),
            },
            dataType: 'json',
            success: function (e) {
                var data = JSON.parse(e[0])
                var code = data.code
                if (code == 300) {
                    Swal.fire({
                        icon: 'success',
                        title: '新增成功',
                        text: date2
                    })

                    // alert("新增成功\n" + date2)
                } else {
                    // alert("新增失敗")
                    Swal.fire({
                        icon: 'success',
                        title: '新增失敗'
                    })
                }
                $("#measure_btn").attr("disabled", false);
            },
            error: function (qq) {
                // alert("error !!")
                Swal.fire({
                    icon: 'error',
                    title: 'error !!'
                })
                $("#measure_btn").attr("disabled", false);
            }
        });
    } else if (type == 2 && blood_glucose_1 != "" && blood_glucose_2 != "") {
        // console.log(blood_glucose_1)
        // console.log(blood_glucose_2)

        $.ajax({
            type: 'POST',
            url: path + "add_blood_glucose.php",
            data: {
                smarc_id: get_cookie("smarc_id"),
                date: date,
                blood_glucose_before_meal: blood_glucose_1,
                blood_glucose_after_meal: blood_glucose_2,
                api_key: get_cookie("api_key"),
                ip: get_cookie("ip"),
            },
            dataType: 'json',
            success: function (e) {
                var data = JSON.parse(e[0])
                var code = data.code
                if (code == 300) {
                    Swal.fire({
                        icon: 'success',
                        title: '新增成功',
                        text: date2
                    })

                    // alert("新增成功\n" + date2)
                } else {
                    // alert("新增失敗")
                    Swal.fire({
                        icon: 'success',
                        title: '新增失敗'
                    })
                }
                $("#measure_btn").attr("disabled", false);
            },
            error: function (qq) {
                Swal.fire({
                    icon: 'error',
                    title: 'error !!'
                })
                $("#measure_btn").attr("disabled", false);
            }
        });
    } else if (type == 3 && body_temp != "") {
        // console.log(body_temp)

        $.ajax({
            type: 'POST',
            url: path + "add_body_temp.php",
            data: {
                smarc_id: get_cookie("smarc_id"),
                date: date,
                body_temperature: body_temp,
                api_key: get_cookie("api_key"),
                ip: get_cookie("ip"),
            },
            dataType: 'json',
            success: function (e) {
                var data = JSON.parse(e[0])
                var code = data.code
                if (code == 300) {
                    Swal.fire({
                        icon: 'success',
                        title: '新增成功',
                        text: date2
                    })

                    // alert("新增成功\n" + date2)
                } else {
                    // alert("新增失敗")
                    Swal.fire({
                        icon: 'success',
                        title: '新增失敗'
                    })
                }
                $("#measure_btn").attr("disabled", false);
            },
            error: function (qq) {
                Swal.fire({
                    icon: 'error',
                    title: 'error !!'
                })
                $("#measure_btn").attr("disabled", false);
            }
        });
    } else if (type == 4 && height != "") {
        // console.log(height)

        $.ajax({
            type: 'POST',
            url: path + "add_height.php",
            data: {
                smarc_id: get_cookie("smarc_id"),
                date: date,
                height: height,
                api_key: get_cookie("api_key"),
                ip: get_cookie("ip"),
            },
            dataType: 'json',
            success: function (e) {
                var data = JSON.parse(e[0])
                var code = data.code
                if (code == 300) {
                    Swal.fire({
                        icon: 'success',
                        title: '新增成功',
                        text: date2
                    })

                    // alert("新增成功\n" + date2)
                } else {
                    // alert("新增失敗")
                    Swal.fire({
                        icon: 'success',
                        title: '新增失敗'
                    })
                }
                $("#measure_btn").attr("disabled", false);
            },
            error: function (qq) {
                Swal.fire({
                    icon: 'error',
                    title: 'error !!'
                })
                $("#measure_btn").attr("disabled", false);
            }
        });
    } else if (type == 5 && weight != "") {
        // console.log(weight)

        $.ajax({
            type: 'POST',
            url: path + "add_weight.php",
            data: {
                smarc_id: get_cookie("smarc_id"),
                date: date,
                weight: weight,
                api_key: get_cookie("api_key"),
                ip: get_cookie("ip"),
            },
            dataType: 'json',
            success: function (e) {
                var data = JSON.parse(e[0])
                var code = data.code
                if (code == 300) {
                    Swal.fire({
                        icon: 'success',
                        title: '新增成功',
                        text: date2
                    })

                    // alert("新增成功\n" + date2)
                } else {
                    // alert("新增失敗")
                    Swal.fire({
                        icon: 'success',
                        title: '新增失敗'
                    })
                }
                $("#measure_btn").attr("disabled", false);
            },
            error: function (qq) {
                Swal.fire({
                    icon: 'error',
                    title: 'error !!'
                })
                $("#measure_btn").attr("disabled", false);
            }
        });
    } else {
        // alert("請輸入完整資料 !!")
        Swal.fire({
            icon: 'error',
            title: '請輸入完整資料 !!'
        })
        $("#measure_btn").attr("disabled", false);
    }
})



















//----------------------------------------------------------------------
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