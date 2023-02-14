//----------------------------------------------------------------------
function get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function get_unescape_Cookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
};

function delete_cookie(name) {
    if (get_cookie(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}


$(document).ready(function () {
    // $('.one').addClass("focus")
    // $('.two').addClass("focus")
    // $('.six').addClass("focus")
    // $('.seven').addClass("focus")
    $(".area ul").hide()
    $(".menu").addClass("not-active")


    $("#name").val(get_unescape_Cookie('user_name'))
    $("#member_number").val(get_cookie('user_id'))

    $(".btn").attr("disabled", false);

    // alert(get_Cookie('user_id'))
    // alert(get_unescape_Cookie('user_name'))
})

var boy, girl, left, right;

var gender = 2;
var handedness = 2;
var area = false;
//-------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
//--------------------------------




$(document).on('click', '.btn', function (e) {


    $(".btn").attr("disabled", true);
    $(".btn").css("background-image", "linear-gradient(to right, #999, #777, #999)");

    boy = document.getElementById('gender-boy').checked
    girl = document.getElementById('gender-girl').checked

    left = document.getElementById('handedness-left').checked
    right = document.getElementById('handedness-right').checked
    if (boy == true) gender = 1;
    if (girl == true) gender = 0;
    if (left == true) handedness = 0;
    if (right == true) handedness = 1;
    // console.log(gender)
    // console.log(handedness)

    check_area_code()

    if ($("#name").val() != "" && gender != 2 && $("#birthday").val() != "" && handedness != 2 && area) {
        get_ip()

    } else {
        if ($("#name").val() == "") {
            Toast.fire({
                icon: 'error',
                title: '請輸入姓名!',
                timer: 3000,
                timerProgressBar: true,
            })
            // alert("請輸入姓名")
        }
        if (gender == 2) {
            Toast.fire({
                icon: 'error',
                title: '請輸入性別!',
                timer: 3000,
                timerProgressBar: true,
            })
            // alert("請輸入性別")
        }
        if ($("#birthday").val() == "") {
            Toast.fire({
                icon: 'error',
                title: '請輸入生日!',
                timer: 3000,
                timerProgressBar: true,
            })
            // alert("請輸入生日")
        }
        if (handedness == 2) {
            Toast.fire({
                icon: 'error',
                title: '請輸入慣用側!',
                timer: 3000,
                timerProgressBar: true,
            })
            // alert("請輸入慣用側")
        }
        $(".btn").css("background-image", "linear-gradient(to right, #1abc9c, #25caa9, #1abc9c)");
        $(".btn").attr("disabled", false);
    }

    check_area_code()

});



function add(area_id) {
    $.ajax({
        type: 'POST',
        url: path + "add-member.php",
        data: {
            name: $("#name").val(),
            gender: gender,
            birthday: $("#birthday").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            handedness: handedness,
            member_number: $("#member_number").val(),
            note: $("#note").val(),
            area_id: area_id,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),

        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            var data = JSON.parse(e[0])
            // alert(data.code);
            if (data.code == 300) {
                // alert('新增成功 ^^\n請重新開啟此網頁!!');
                Swal.fire({
                    icon: 'success',
                    title: '註冊成功 :)',
                    text: '請重新開啟網頁！\n２秒後自動關閉！！',
                    timer: 2000,
                    timerProgressBar: true,
                })

                $(".btn").attr("disabled", true);
                $(".btn").val("已新增")
                $(".menu").removeClass("not-active")
                window.setTimeout((() => liff.closeWindow()), 2000)

            } else {
                Toast.fire({
                    icon: 'error',
                    title: '註冊失敗!'
                })
                $(".btn").css("background-image", "linear-gradient(to right, #1abc9c, #25caa9, #1abc9c)");
                $(".btn").attr("disabled", false);
            }
        },
        error: function (e) {
            // alert(e);
            Toast.fire({
                icon: 'error',
                title: 'error !!!'
            })
            $(".btn").attr("disabled", false);
        }
    });
}





function check_area_code() {
    $.ajax({
        type: 'POST',
        url: path + "get_area_code.php",
        data: {
            area_code: $("#area").val(),
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'text',
        success: function (e) {
            // console.log(e)
            if (e == "0") {
                Toast.fire({
                    icon: 'error',
                    title: '查無此場域'
                })
                area = false
            } else if (e == "1") {
                area = true
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'error !!!'
            })
        }
    });
}


function get_ip() {
    $.ajax({
        type: 'POST',
        url: path + "get_ip_api_key_in_addmember.php",
        data: {
            area_code: $("#area").val(),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            document.cookie = "ip=" + e[0].ip + "; path=/;";
            document.cookie = "api_key=" + e[0].api_key + "; path=/;";

            add(e[0].area_id)
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'error !'
            })
        }
    });
}
