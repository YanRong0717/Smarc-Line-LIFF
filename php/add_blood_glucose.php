<?php

include "env.php";

$smarc_id = $_POST['smarc_id'];
$blood_glucose_before_meal = $_POST['blood_glucose_before_meal'];
$blood_glucose_after_meal = $_POST['blood_glucose_after_meal'];
$date = $_POST['date'];

$smarc_id = (int) $smarc_id;
$blood_glucose_before_meal = (int) $blood_glucose_before_meal;
$blood_glucose_after_meal = (int) $blood_glucose_after_meal;

$cmd = "add_measure";
// $data = '{"smarc_id":1,"data_datetime":"2020-06-28T13:34:00Z","type":"weight","value":66,"unit":"kg"}';
$data1 = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"blood_glucose_before_meal","value":' . $blood_glucose_before_meal . ',"unit":"mmol/L"}';
$data2 = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"blood_glucose_after_meal","value":' . $blood_glucose_after_meal . ',"unit":"mmol/L"}';

$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

$curl_cmd1 = sprintf($curl_cmd, $public_key, $cmd, addslashes($data1), $url);
$curl_cmd2 = sprintf($curl_cmd, $public_key, $cmd, addslashes($data2), $url);

exec($curl_cmd1, $output);
exec($curl_cmd2, $output);
// print_r($output);
echo json_encode($output);
