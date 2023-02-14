<?php

include "env.php";

#變數設定
$area_code = $_POST['area_code'];
$line_id = $_POST['line_id'];
$smarc_id = $_POST['smarc_id'];


// $zone_id = 1;
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = "UPDATE `user` SET `smarc_id` = :smarc_id WHERE `user`.`area_id` = (SELECT `area_id` FROM `area` WHERE `area_code` = :area_code) and `user`.`line_id` = :line_id";
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":area_code" => $area_code, ":smarc_id" => $smarc_id, ":line_id" => $line_id));
$count = $statement->rowCount();

if ((int)$count >= 1) {
    echo "t"; //更新超過1筆
} else {
    echo "f"; //更新0筆
}

#關閉連線
$conn = null;
