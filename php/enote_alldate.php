<?php
include "env.php";

//----------------------------------------------------------
$num = $_POST['num'];
$smarc_id = $_POST['smarc_id'];
$getDate = date("Y-m-d"); //當天日期

// $num = 7;
// $smarc_id = 1;
// $getDate = "2020-06-20";
//----------------------------------------------------------

$QQ = "";
$result = array();

$date = str_replace('-', '/', $getDate);
$date = date('Y-m-d', strtotime($date . "+1 days")); //因為回圈內一開始先-1了

for ($i = 1; $i <= $num; $i++) {
    $date = date('Y-m-d', strtotime($date . "-1 days"));
    $data = '{"smarc_id": ' . $smarc_id . ', "type": 1, "date":"' . $date . '"}';

    $cmd = "get_enote";

    $public_key = getPublicKey();
    $curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';
    $curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

    exec($curl_cmd, $output);

    $QQ = str_replace('\'', "", $output[0]);
    $WW = json_decode($QQ);
    $code = $WW->code;

    if ($code == 600) {
        // echo $date . "<br>";
        array_push($result, $date);
    }
    $output = "";
}

echo json_encode($result);
