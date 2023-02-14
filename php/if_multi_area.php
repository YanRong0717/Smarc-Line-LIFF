<?php

include "env.php";

#變數設定
$line_id = $_POST['line_id'];
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = 'SELECT * FROM `user`,`area` WHERE `area`.`area_id` = `user`.`area_id` and `line_id` = :line_id';
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":line_id" => $line_id));

// $count = $statement->rowCount();

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    $allData[] = array(
        "area_id" => $row['area_id'],
        "area_name" => $row['area_name'],
    );
}

echo json_encode($allData);
