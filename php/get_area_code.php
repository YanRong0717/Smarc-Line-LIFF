<?php

include "env.php";

#變數設定
$area_code = $_POST['area_code'];
// $zone_id = 1;
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = 'SELECT * FROM `area` WHERE `area_code` = :area_code';
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":area_code" => $area_code));

$count = $statement->rowCount();

print_r($count);

#關閉連線
$conn = null;
