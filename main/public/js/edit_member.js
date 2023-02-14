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
//-------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
//--------------------------------


$(document).ready(function () {
    $(".menu").addClass("not-active")
    get_user()
})



$(document).on('click', '.cancel_btn ', function (e) {
    location.replace("../home/index.html")
});
$(document).on('click', '.save_btn ', function (e) {
    var name = $("#name").val()
    var boy = document.getElementById('gender-boy').checked
    var girl = document.getElementById('gender-girl').checked
    var left = document.getElementById('handedness-left').checked
    var right = document.getElementById('handedness-right').checked
    var birthday = $('#birthday').val()
    var phone = $('#phone').val()
    var email = $('#email').val()
    var note = $('#note').val()
    var gender, handedness
    // console.log(name)
    // console.log(boy)
    // console.log(girl)
    // console.log(left)
    // console.log(right)
    // console.log(birthday)
    // console.log(phone)
    // console.log(email)
    // console.log(note)

    (boy == true) ? gender = "1" : gender = "0";
    (left == true) ? handedness = "0" : handedness = "1";
    console.log(gender)
    console.log(handedness)

    $.ajax({
        type: 'POST',
        url: path + "update_user.php",
        data: {
            smarc_id: get_cookie("smarc_id"),
            name: name,
            // gender: gender,
            // birthday: birthday,
            phone: phone,
            // email: email,
            note: note,
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
            // member_number: get_cookie("member_number"),
        },

        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            var data = JSON.parse(e[0])
            // alert(data.code);
            // console.log(data)
            if (data.code == 500) {
                Swal.fire({
                    icon: 'success',
                    title: '更新成功 :)',
                    text: '２秒後將跳轉頁面！',
                    timer: 2000,
                    timerProgressBar: true,
                })
                location.replace("../home/index.html")
            } else {
                Toast.fire({
                    icon: 'error',
                    title: '更新資料失敗!'
                })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: 'error !!!'
            })
        }
    });
});



function get_user() {
    $.ajax({
        type: 'POST',
        url: path + "get-user.php",
        data: {
            smarc_id: get_cookie("smarc_id"),
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        // contenstType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (e) {
            var data = JSON.parse(e[0])
            // alert(data.code);
            if (data.code == 500) {
                console.log(data.data)
                $("#name").val(data.data.name)
                if (data.data.gender == "1") {
                    document.getElementById('gender-boy').checked = true
                } else if (data.data.gender == "0") {
                    document.getElementById('gender-girl').checked = true
                }
                $('#birthday').val(data.data.birthday)
                $('#phone').val(data.data.phone)
                $('#email').val(data.data.email)
                if (data.data.handedness == "0") {
                    document.getElementById('handedness-left').checked = true
                } else if (data.data.handedness == "1") {
                    document.getElementById('handedness-right').checked = true
                }
                $('#note').val(data.data.note)

                $(".two input").prop('disabled', true)
                $(".three input").prop('disabled', true)
                $(".five input").prop('disabled', true)
                $(".six input").prop('disabled', true)



            } else {
                Toast.fire({
                    icon: 'error',
                    title: '獲取資料失敗!'
                })
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



$(document).on('click', '.add_member', function (e) {
    location.replace("../add_member/index.html")
})