<?php

include "env.php";

$smarc_id = $_POST['smarc_id'];
// $member_number = $_POST['member_number'];

$cmd = "get_user";

$data = "{\"smarc_id\":" . $smarc_id . "}";

$public_key = getPublicKey();

$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';

$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);

echo json_encode($output);
