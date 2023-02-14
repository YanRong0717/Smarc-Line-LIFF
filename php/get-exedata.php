<?php
include "env.php";

$smarc_id = $_POST['smarc_id'];
$date = $_POST['date'];

// $smarc_id = 1;
// $date = "2020-03-25";

$result = array();

$cmd = "get_exedata";
// $data = '{"smarc_id":69,"date":"2020-07-14"}';
$data = '{"smarc_id":' . $smarc_id . ',"date":"' . $date . '"}';
// echo $data;

$public_key = getPublicKey();
$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST %s';
$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);

$QQ = str_replace('\'', "", $output[0]);
$WW = json_decode($QQ);
$code = $WW->code;
$ZZ = $WW->data;
if ($code == 500) {
    // echo $date . "<br>";
    array_push($result, $ZZ);
}
echo json_encode($result);
