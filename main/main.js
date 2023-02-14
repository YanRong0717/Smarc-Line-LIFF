function get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function get_unescape_Cookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
};

function delete_cookie(name) {
    if (get_cookie(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
// ------------------------------------------------------------------------


$(document).ready(function () {
    delete_cookie("user_id")
    delete_cookie("user_name")
    delete_cookie("smarc_id")
    delete_cookie("pictureUrl")
    delete_cookie("ip")
    delete_cookie("api_key")

    liff.init({
        liffId: liffID
    }).then(function () {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            // alert("你已經登入Line哦！");
            liff.getProfile().then(function (profile) {
                let user_id = profile.userId;
                let user_name = profile.displayName;
                let pictureUrl = profile.pictureUrl;

                // alert(user_id)
                // alert(user_name)
                // alert(pictureUrl)

                document.cookie = "user_id=" + user_id + "; path=/;"; //將id放入cookie
                document.cookie = "user_name=" + escape(user_name) + "; path=/;";
                document.cookie = "pictureUrl=" + escape(pictureUrl) + "; path=/;";


                $.ajax({
                    type: 'POST',
                    url: path + "if_multi_area.php",
                    data: {
                        line_id: user_id,
                    },
                    dataType: 'json',
                    success: function (e) {
                        if (e !== null) {
                            if (e.length >= 2) {
                                // alert("2222")
                                let a = ""
                                for (let i = 0; i < e.length; i++) {
                                    if (i == 0) {

                                        a += `<div class="dropdown">
                                        <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                            data-bs-toggle="dropdown" aria-expanded="false">` + "&nbsp;&nbsp;&nbsp;&nbsp;請選擇要登入的場域&nbsp;&nbsp;&nbsp;&nbsp;" + `
                                        </a>
                
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">`
                                        a += `<li class=" p-2"><a class="dropdown-item" href="#" id="` + e[i].area_id + `">` + e[i].area_name + `</a></li>`
                                    } else {
                                        a += `<li class=" p-2"><a class="dropdown-item" href="#" id="` + e[i].area_id + `">` + e[i].area_name + `</a></li>`
                                    }
                                }
                                a += `</ul></div>`

                                Swal.fire({
                                    html: a,
                                    showConfirmButton: false
                                })
                            } else if (e.length == 1) {
                                get_ip_apikey(e[0].area_id)
                            } else {
                                location.replace("public/add_member/index.html")
                            }
                        } else {
                            location.replace("public/add_member/index.html")
                        }

                    },
                    error: function (e) {
                        Swal.fire({
                            icon: 'error',
                            text: '讀取使用者資料錯誤 !!!!',
                        })
                    }
                });

            })

        }
    }).catch(function (error) {
        alert("Error !!");
    });
})




$(document).on('click', '.dropdown-menu li', function (e) {
    area_id = $(".dropdown-menu li a").eq($(this).index()).attr("id")
    // alert(area_id)
    get_ip_apikey(area_id)
})

function get_ip_apikey(area_id) {

    $.ajax({
        type: 'POST',
        url: path + "get_area_ip_apikey.php",
        data: {
            line_id: get_cookie("user_id"),
            area_id: area_id,
        },
        dataType: 'json',
        success: function (e) {

            // console.log(e[0].ip)
            document.cookie = "ip=" + e[0].ip + "; path=/;";
            document.cookie = "api_key=" + e[0].api_key + "; path=/;";
            document.cookie = "smarc_id=" + e[0].smarc_id + "; path=/;";
            // alert(get_cookie("ip"))
            // alert(get_cookie("api_key"))

            get_user()
        },
        error: function (e) {
            // alert("Get user Error !!")

            Swal.fire({
                icon: 'error',
                text: '讀取使用者資料錯誤',
            })
        }
    });
}
// ........................................................
function get_user() {
    // alert(document.cookie)
    $.ajax({
        type: 'POST',
        url: path + "get-user.php",
        data: {
            smarc_id: get_cookie("smarc_id"),
            api_key: get_cookie("api_key"),
            ip: get_cookie("ip"),
        },
        dataType: 'json',
        success: function (e) {

            let all = e[0].replace(/[\']/g, "")
            all = JSON.parse(all)
            let code_user = all.code
            // alert(code_user)
            $(".menu").removeClass("not-active")
            if (code_user == 500) {
                // let smarc_id = all.data.smarc_id //如果沒會員的話，會找不到這行，程式會卡住，所以要先if判斷code==500
                // document.cookie = "smarc_id=" + smarc_id + "; path=/;";
                location.replace("public/home/index.html")
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '您之前有註冊過,\n但資料可能遺失',
                    text: '請重新註冊',
                    timer: 5000,
                    timerProgressBar: true,
                })
                setTimeout(function () {
                    location.replace("public/add_member/index.html")
                }, 5000)

            }

        },
        error: function (e) {
            // alert("Get user Error !!")

            Swal.fire({
                icon: 'error',
                text: '讀取使用者資料錯誤',
            })
        }
    });
}



