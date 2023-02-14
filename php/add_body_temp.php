<?php

include "env.php";

$smarc_id = $_POST['smarc_id'];
$body_temperature = $_POST['body_temperature'];
$date = $_POST['date'];

$smarc_id = (int) $smarc_id;
$body_temperature = (float) $body_temperature;

$cmd = "add_measure";
// $data = '{"smarc_id":1,"data_datetime":"2020-06-28T13:34:00Z","type":"weight","value":66,"unit":"kg"}';
$data = '{"smarc_id":' . $smarc_id . ',"data_datetime":"' . $date . '","type":"body_temperature","value":' . $body_temperature . ',"unit":"c"}';

$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);
// print_r($output);
echo json_encode($output);
