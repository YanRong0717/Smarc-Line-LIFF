<?php

include "env.php";

$name = "";
$gender = 2;
$birthday = "";
$phone = "";
$email = "";
$handedness = 2;
$member_number = "";
$note = "";

//------------------以上這部分是預設--------------------

$name = $_POST['name'];
$gender = $_POST['gender'];
$birthday = $_POST['birthday'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$handedness = $_POST['handedness'];
$member_number = $_POST['member_number'];
$note = $_POST['note'];

$name = urlencode($name);
$note = urlencode($note);

// echo $name . "," .  $gender . "," .  $birthday . "," .  $phone . "," .  $email . "," .  $handedness . "," .  $member_number;
//----------------------------------------------------

$cmd = "create_user";
$data = "{\"model_set\":11111111,\"member_number\":\"" . $member_number . "\",\"name\":\"" . $name . "\",\"gender\":" . $gender . ",\"birthday\":\"" . $birthday . "\",\"phone\":\"" . $phone . "\",\"email\":\"" . $email . "\",\"rfid_sn\":\"\",\"endian\":0 " . ",\"handedness\":" . $handedness . ",\"note\":\"" . $note . "\"}";

$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';
$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);
exec($curl_cmd, $output);
// print_r($output);
// $AA = str_replace('\'', "", $output[0]);

$QQ = str_replace('\'', "", $output[0]);
$WW = json_decode($QQ);
$code = $WW->code;

if ($code <= 0) {
    // 新增會員失敗
    echo json_encode($output);
} else {

    $cmd2 = "get_user";

    $data2 = "{\"member_number\":\"" . $member_number . "\"}";

    $public_key2 = getPublicKey();

    $curl_cmd2 = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

    $curl_cmd2 = sprintf($curl_cmd2, $public_key2, $cmd2, addslashes($data2), $url);

    exec($curl_cmd2, $output2);

    $QQQ = str_replace('\'', "", $output2[0]);
    $WWW = json_decode($QQQ);
    $smarc_id = $WWW->data->smarc_id;

    // print_r($smarc_id);

    // **********************************************************************************************************
    #變數設定
    $area_id = $_POST['area_id'];
    #連結資料庫
    $conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
    $conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
    #設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

    $sql = 'SELECT * FROM `user` WHERE `area_id` = :area_id AND `line_id` = :line_id';
    #執行prepare
    $statement = $conn->prepare($sql);
    $statement->execute(array(":area_id" => $area_id, ":line_id" => $member_number));
    $count = $statement->rowCount();
    if ($count == 0) { //該會員在該場域無資料
        $sql2 = 'INSERT INTO `user` (`user_id`, `area_id`, `line_id` , `smarc_id`) VALUES (NULL, :area_id, :line_id , :smarc_id);';
        #執行prepare
        $statement2 = $conn->prepare($sql2);
        $statement2->execute(array(":area_id" => $area_id, ":line_id" => $member_number, ":smarc_id" => $smarc_id));
    } else if ($count >= 1) { //該會員有在該場域創建會員過
        $sql3 = 'UPDATE `user` SET `smarc_id` = :smarc_id WHERE `user`.`area_id` = :area_id AND `user`.`line_id` = :line_id;';
        #執行prepare
        $statement3 = $conn->prepare($sql3);
        $statement3->execute(array(":area_id" => $area_id, ":line_id" => $member_number, ":smarc_id" => $smarc_id));
    }

    #關閉連線
    $conn = null;

// **********************************************************************************************************

    echo json_encode($output);
}
