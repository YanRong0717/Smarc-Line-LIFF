<?php
include "env.php";

$smarc_id = $_POST['smarc_id'];
$from_date = $_POST['from_date'];
$to_date = $_POST['to_date'];
$type = $_POST['type'];

// print_r($smarc_id);
// print_r($from_date);
// print_r($to_date);
// print_r($type);

$result = array();

$cmd = "get_enote";
// $data = '{"smarc_id":1,"type":1,"fromDate":"2020-04-24","toDate":"2021-04-24"}';
$data = '{"smarc_id":' . $smarc_id . ',"type":' . $type . ',"fromDate":"' . $from_date . '","toDate":"' . $to_date . '"}';
// echo $data;

$public_key = getPublicKey();
$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST %s';
$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);
$QQ = str_replace('\'', "", $output[0]);
$WW = json_decode($QQ);
$code = $WW->code;
$ZZ = $WW->data;

if ($code == 600) {
    array_push($result, $ZZ);
    echo json_encode($result);
} else {
    echo json_encode("NoData");
}
