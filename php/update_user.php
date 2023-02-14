<?php

include "env.php";

$smarc_id = $_POST['smarc_id'];
$name = $_POST['name'];
// $gender = $_POST['gender'];
// $birthday = $_POST['birthday'];
$phone = $_POST['phone'];
// $email = $_POST['email'];
$note = $_POST['note'];

$cmd = "update_user";

$data = "{\"smarc_id\":\"" . $smarc_id . "\",\"name\":\"" . $name . "\",\"phone\":\"" . $phone . "\",\"note\":\"" . $note . "\"}";
// $data = '{"smarc_id":69,"rfid_sn":"508FAF90"}';
// print_r($data);

$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);
// print_r($output);
echo json_encode($output);
