var path = "https://jumbo-info.tk/jumbo/php/"

$(document).ready(function () {
    if (get_cookie("manager_login") != "a^HtlU8k!Z%HDr8ECgV#") {
        location.replace("../index.html")
    }

    $('#btn').on('click', function (e) {
        if ($("#area_code").val() != "" && $("#line_id").val() != "" && $("#smarc_id").val() != "") {
            edit()
        } else {
            Toast.fire({
                icon: 'warning',
                title: '請輸入完整'
            })
        }
    })
});


function edit() {
    $.ajax({
        type: 'POST',
        url: path + "edit_db_smarc_id.php",
        data: {
            area_code: $("#area_code").val(),
            line_id: $("#line_id").val(),
            smarc_id: $("#smarc_id").val(),
        },
        dataType: 'text',
        success: function (e) {
            if (e == "t") {
                Toast.fire({
                    icon: 'success',
                    title: '更新成功 !'
                })
            } else {
                Toast.fire({
                    icon: 'error',
                    title: '更新失敗 !\n輸入資料可能有誤',
                    html: ''
                })
            }
        },
        error: function (e) {
            Swal.fire({
                icon: 'error',
                text: '系統錯誤 !!',
            })
        }
    });
}

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
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})