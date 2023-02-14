<?php
include "env.php";

// $smarc_id = $_POST['smarc_id'];
// $date = $_POST['date'];

$smarc_id = 1;
$date = "2020-03-25";

$cmd = "get_user_ids";
$data = '';
// $data = '{"smarc_id":'. $smarc_id . ',"date":"' . $date . '"}';
// echo $data;

$public_key = getPublicKey();
$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST %s';
$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);
// print_r($output);
echo json_encode($output);
