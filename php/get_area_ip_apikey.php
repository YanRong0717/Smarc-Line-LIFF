<?php
include "env.php";

#變數設定
$line_id = $_POST['line_id'];
$area_id = $_POST['area_id'];

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = 'SELECT `area`.`ip` , `area`.`api_key`, `user`.`smarc_id` FROM `user`,`area` WHERE `area`.`area_id` = `user`.`area_id` and `line_id` = :line_id  and `user`.`area_id` =  :area_id';
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":line_id" => $line_id, ":area_id" => $area_id));
// $statement->execute();
while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    $allData[] = array(
        "ip" => $row['ip'],
        "api_key" => $row['api_key'],
        "smarc_id" => $row['smarc_id'],
    );
}
// print_r($allData);
echo json_encode($allData);
#關閉連線
$conn = null;
