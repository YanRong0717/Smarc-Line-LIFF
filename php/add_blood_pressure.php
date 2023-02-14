<?php

include "env.php";

$smarc_id = $_POST['smarc_id'];
$blood_pressure_systolic = $_POST['blood_pressure_systolic'];
$blood_pressure_diastolic = $_POST['blood_pressure_diastolic'];
$blood_pressure_pulse = $_POST['blood_pressure_pulse'];
$date = $_POST['date'];

$smarc_id = (int) $smarc_id;
$blood_pressure_systolic = (int) $blood_pressure_systolic;
$blood_pressure_diastolic = (int) $blood_pressure_diastolic;
$blood_pressure_pulse = (int) $blood_pressure_pulse;

$cmd = "add_measure";
// $data = '{"smarc_id":1,"data_datetime":"2020-06-28T13:34:00Z","type":"weight","value":66,"unit":"kg"}';
$data1 = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"blood_pressure_systolic","value":' . $blood_pressure_systolic . ',"unit":""}';
$data2 = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"blood_pressure_diastolic","value":' . $blood_pressure_diastolic . ',"unit":""}';
$data3 = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"blood_pressure_pulse","value":' . $blood_pressure_pulse . ',"unit":""}';
$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

$curl_cmd1 = sprintf($curl_cmd, $public_key, $cmd, addslashes($data1), $url);
$curl_cmd2 = sprintf($curl_cmd, $public_key, $cmd, addslashes($data2), $url);
$curl_cmd3 = sprintf($curl_cmd, $public_key, $cmd, addslashes($data3), $url);

exec($curl_cmd1, $output);
exec($curl_cmd2, $output);
exec($curl_cmd3, $output);
// print_r($output);
echo json_encode($output);
