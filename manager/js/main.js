var path = "https://jumbo-info.tk/jumbo/php/"

$(document).ready(function () {
    delete_cookie("manager_login")

    $('#btn').on('click', function (e) {
        if ($("#password").val() != "") {
            login()
        }
    });
});


function login() {
    $.ajax({
        type: 'POST',
        url: path + "manager_login.php",
        data: {
            password: $("#password").val(),
        },
        dataType: 'text',
        success: function (e) {
            if (e == "8d&943&^SxOrZIHz%w9s") {
                document.cookie = "manager_login=" + "a^HtlU8k!Z%HDr8ECgV#" + "; path=/;";
                setTimeout(function () {
                    location.replace("home/index.html")
                }, 500)

            } else {
                Swal.fire({
                    icon: 'error',
                    text: '密碼錯誤',
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